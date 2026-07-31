{ pkgs, ... }:

let
  appName = "joeymckenzie.tech";
  phpPort = 8000;
  vitePort = 5173;

  dbName = "website";
  testDbName = "${dbName}_test";

  backendHost = "${appName}.test";
  viteHost = "assets.${backendHost}";

  minioPort = 9000;
  minioAccessKey = "minioadmin";
  minioSecretKey = "minioadmin";
  minioBucket = "website";
  minioAlias = "website-local";

  home = builtins.getEnv "HOME";
  caddySitesDir = "${home}/.config/caddy/sites";
  caddySite = "${caddySitesDir}/${appName}.caddy";

  mcpServers = {
    devenv = {
      command = "devenv";
      args = [ "mcp" ];
    };
    shadcn = {
      command = "pnpm";
      args = [
        "dlx"
        "shadcn@latest"
        "mcp"
      ];
    };
    boost = {
      command = "php";
      args = [
        "artisan"
        "boost:mcp"
      ];
    };
    playwright = {
      command = "pnpm";
      args = [
        "dlx"
        "@playwright/mcp@latest"
      ];
    };
    nightwatch.url = "https://nightwatch.laravel.com/mcp";
    backlog = {
      command = "backlog";
      args = [
        "mcp"
        "start"
      ];
    };
  };

  claudeMcpServers = builtins.mapAttrs (
    _name: server:
    server
    // {
      type = if server ? command then "stdio" else "http";
    }
  ) mcpServers;

  opencodeMcpServers = builtins.mapAttrs (
    _name: server:
    if server ? command then
      {
        type = "local";
        command = [ server.command ] ++ (server.args or [ ]);
      }
    else
      {
        type = "remote";
        inherit (server) url;
      }
  ) mcpServers;
in
{
  dotenv.disableHint = true;

  env = {
    APP_URL = "https://${backendHost}";
    APP_HOST = backendHost;

    DB_DATABASE = dbName;
    DB_USERNAME = "root";

    R2_ACCESS_KEY_ID = minioAccessKey;
    R2_SECRET_ACCESS_KEY = minioSecretKey;
    R2_REGION = "us-east-1";
    R2_BUCKET = minioBucket;
    R2_URL = "http://127.0.0.1:${toString minioPort}/${minioBucket}";
    R2_ENDPOINT = "http://127.0.0.1:${toString minioPort}";
    R2_USE_PATH_STYLE_ENDPOINT = "true";

    VITE_PORT = toString vitePort;
    VITE_DEV_HOST = viteHost;
  };

  packages = [
    pkgs.figlet
    pkgs.minio-client
    pkgs.mysql84
  ];

  scripts = {
    ci-lint.exec = ''
      set -euo pipefail
      composer fmt:check
      composer refactor:check
      composer lint
      composer types:generate
      pnpm run build
      pnpm lint:check
      pnpm fmt:check
      pnpm types:check
    '';

    ci-test.exec = ''
      set -euo pipefail
      composer types:generate
      pnpm run build
      php artisan test --parallel
    '';

    ci-mutation.exec = ''
      set -euo pipefail
      composer types:generate
      pnpm run build
      composer test:mutation
    '';
  };

  files.".codex/config.toml".toml.mcp_servers = mcpServers;

  claude.code.enable = true;
  claude.code.mcpServers = claudeMcpServers;

  opencode.enable = true;
  opencode.mcp = opencodeMcpServers;

  languages.php = {
    enable = true;
    version = "8.5";
    extensions = [
      "bcmath"
      "calendar"
      "gd"
      "imagick"
      "zip"
      "pdo_mysql"
      "redis"
      "intl"
      "xdebug"
    ];
  };

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_24;
    pnpm.enable = true;
    corepack.enable = true;
  };

  git-hooks.hooks = {
    prettier = {
      enable = true;
      name = "prettier";
      entry = "pnpm fmt";
      files = "\\.(js|jsx|ts|tsx|json|md)$";
      language = "system";
      pass_filenames = false;
    };
    pint = {
      enable = true;
      name = "pint";
      entry = "composer fmt";
      files = "\\.php$";
      language = "system";
      pass_filenames = false;
    };
    rector = {
      enable = true;
      name = "rector";
      entry = "composer refactor";
      files = "\\.php$";
      language = "system";
      pass_filenames = false;
    };
    npm-audit = {
      enable = true;
      name = "npm packages audit";
      entry = "pnpm audit";
      language = "system";
      pass_filenames = false;
      stages = [ "pre-push" ];
    };
    composer-audit = {
      enable = true;
      name = "composer packages audit";
      entry = "composer audit";
      language = "system";
      pass_filenames = false;
      stages = [ "pre-push" ];
    };
  };

  processes = {
    app.exec = "php artisan serve --port ${toString phpPort} ";
    pail.exec = "php artisan pail --timeout=0";
    vite.exec = "exec pnpm dev --port ${toString vitePort} --strictPort";
  };

  enterShell = ''
    if [ ! -d vendor ]; then composer install; fi
    if [ ! -d node_modules ]; then pnpm install; fi
    if [ ! -f .env ]; then
      cp .env.example .env
      php artisan key:generate
    fi

    mkdir -p "${caddySitesDir}"
    cat > "${caddySite}" <<EOF
    ${backendHost} {
      reverse_proxy 127.0.0.1:${toString phpPort}
    }

    ${viteHost} {
      reverse_proxy 127.0.0.1:${toString vitePort}
    }
    EOF

    if curl -fsS --max-time 2 http://localhost:2019/config/ >/dev/null 2>&1; then
      if curl -fsS -X POST -H "Content-Type: text/caddyfile" \
           --data-binary @/etc/caddy/Caddyfile \
           "http://localhost:2019/load?adapter=caddyfile" >/dev/null; then
        echo "✓ caddy reloaded (${backendHost}, ${viteHost})"
      else
        echo "⚠ caddy admin API rejected reload — check /etc/caddy/Caddyfile syntax"
      fi
    else
      echo "⚠ caddy admin API not reachable. Try: sudo launchctl kickstart -k system/org.nixos.caddy"
    fi

    if mysqladmin ping -h 127.0.0.1 -P 3306 --silent 2>/dev/null; then
      for db in "${dbName}" "${testDbName}"; do
        if ! mysql -N -s -h 127.0.0.1 -P 3306 -u root -e "SHOW DATABASES LIKE '$db'" | grep -q .; then
          echo "Creating database $db..."
          mysqladmin -h 127.0.0.1 -P 3306 -u root create "$db"
        fi
      done
    else
      echo "⚠ MySQL is not accepting connections on 127.0.0.1:3306; start it, then re-enter the shell."
    fi

    if curl -fsS --max-time 2 "http://127.0.0.1:${toString minioPort}/minio/health/live" >/dev/null 2>&1; then
      mc alias set ${minioAlias} "http://127.0.0.1:${toString minioPort}" "${minioAccessKey}" "${minioSecretKey}" >/dev/null 2>&1
      if mc mb --ignore-existing "${minioAlias}/${minioBucket}" >/dev/null 2>&1; then
        mc anonymous set download "${minioAlias}/${minioBucket}" >/dev/null 2>&1
        echo "✓ minio bucket ready (${minioBucket})"
      fi
    else
      echo "⚠ MinIO not reachable on 127.0.0.1:${toString minioPort}; skipping bucket creation."
    fi

    echo "Applying migrations..."

    php artisan migrate --force

    echo "Done!"

    figlet "${appName}"
  '';
}
