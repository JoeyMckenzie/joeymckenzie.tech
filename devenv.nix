{ pkgs, ... }:

let
  appName = "website";
  phpPort = 8000;
  vitePort = 5173;
  workingDir = toString ./.;

  dbName = appName;
  testDbName = "${appName}_test";
  dbUser =
    let
      envUser = builtins.getEnv "USER";
    in
    if envUser == "" then "mysql" else envUser;

  backendHost = "${appName}.test";
  viteHost = "assets.${backendHost}";

  home = builtins.getEnv "HOME";
  caddySitesDir = "${home}/.config/caddy/sites";
  caddySite = "${caddySitesDir}/${appName}.caddy";
in
{
  dotenv.disableHint = true;

  env = {
    APP_URL = "https://${backendHost}";
    APP_HOST = backendHost;

    DB_DATABASE = dbName;
    DB_USERNAME = dbUser;

    VITE_PORT = toString vitePort;
    VITE_DEV_HOST = viteHost;
  };

  packages = [
    pkgs.figlet
    pkgs.minio-client
    pkgs.postgresql_17
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

  claude.code.enable = true;
  claude.code.mcpServers = {
    devenv = {
      type = "stdio";
      command = "devenv";
      args = [ "mcp" ];
    };
    shadcn = {
      type = "stdio";
      command = "pnpm";
      args = [
        "dlx"
        "shadcn@latest"
        "mcp"
      ];
    };
    boost = {
      type = "stdio";
      command = "php";
      args = [
        "artisan"
        "boost:mcp"
      ];
    };
    playwright = {
      type = "stdio";
      command = "pnpm";
      args = [
        "dlx"
        "@playwright/mcp@latest"
      ];
    };
    nightwatch = {
      type = "http";
      url = "https://nightwatch.laravel.com/mcp";
    };
  };

  languages.php = {
    enable = true;
    version = "8.5";
    extensions = [
      "bcmath"
      "calendar"
      "gd"
      "imagick"
      "zip"
      "pdo_pgsql"
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
    vite.exec = ''
      pids=$(lsof -ti:${toString vitePort} 2>/dev/null || true)
      if [ -n "$pids" ]; then
        echo "→ killing orphan on :${toString vitePort} ($pids)"
        kill -9 $pids
      fi
      exec pnpm dev --host 127.0.0.1 --port ${toString vitePort} --strictPort
    '';
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
      root * ${workingDir}/public
      php_fastcgi 127.0.0.1:${toString phpPort}
      encode zstd gzip
      file_server
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

    if pg_isready -h 127.0.0.1 -p 5432 >/dev/null 2>&1; then
      for db in "${dbName}" "${testDbName}"; do
        if ! psql -h 127.0.0.1 -p 5432 -U "${dbUser}" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$db'" | grep -q 1; then
          echo "Creating database $db..."
          createdb -h 127.0.0.1 -p 5432 -U "${dbUser}" "$db"
        fi
      done
    else
      echo "⚠ Postgres is not accepting connections on 127.0.0.1:5432; start it, then re-enter the shell (or run: createdb ${dbName} && createdb ${testDbName})."
    fi

    echo "Applying migrations..."

    php artisan migrate --force

    echo "Done!"

    figlet "${appName}"
  '';
}
