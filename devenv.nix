{ pkgs, lib, ... }:

let
  slug = "joeymckenzie.tech";

  rawName = builtins.baseNameOf (toString ./.);
  shortName = lib.removePrefix "${slug}-" rawName;

  indexFile = ./.devenv-index;
  index =
    if builtins.pathExists indexFile then
      lib.toInt (lib.removeSuffix "\n" (builtins.readFile indexFile))
    else
      0;

  appPortBase = 8100;
  vitePortBase = 5273;
  appPort = appPortBase + index;
  vitePort = vitePortBase + index;

  hostname = if shortName == "main" then "${slug}.test" else "${shortName}.${slug}.test";
  assetsHost = "assets.${hostname}";

  dbName = "joeymckenzie_tech_" + lib.replaceStrings [ "-" "." "/" ] [ "_" "_" "_" ] shortName;

  home = builtins.getEnv "HOME";
  caddySitesDir = "${home}/.config/caddy/sites";
  caddySite = "${caddySitesDir}/joeymckenzie-${shortName}.caddy";
  worktreeRoot = toString ./.;
  worktreesRoot = builtins.dirOf (toString ./.);
in
{
  dotenv.disableHint = true;

  scripts = {
    ci-lint.exec = ''
      set -euo pipefail
      php artisan wayfinder:generate --with-form
      composer fmt:check
      composer refactor:check
      composer lint
      npm run fmt:check
      npm run types:check
      npm run lint
    '';

    ci-test.exec = ''
      set -euo pipefail
      php artisan wayfinder:generate --with-form
      npm run build
      php artisan test
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
      command = "npx";
      args = [
        "shadcn@latest"
        "mcp"
      ];
    };
    magicuidesign = {
      type = "stdio";
      command = "npx";
      args = [
        "-y"
        "@magicuidesign/mcp@latest"
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
      command = "bunx";
      args = [
        "@playwright/mcp@latest"
      ];
    };
  };

  languages.php = {
    enable = true;
    version = "8.5";
    extensions = [
      "intl"
      "bcmath"
      "zip"
      "pdo_mysql"
    ];
    fpm.pools.web = {
      settings = {
        "listen" = "127.0.0.1:${toString appPort}";
        "pm" = "dynamic";
        "pm.max_children" = 10;
        "pm.start_servers" = 2;
        "pm.min_spare_servers" = 1;
        "pm.max_spare_servers" = 3;
        "clear_env" = "no";
      };
    };
  };

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_22;
    npm.enable = true;
  };

  git-hooks.hooks = {
    oxfmt = {
      enable = true;
      name = "oxfmt (frontend formatting)";
      entry = "npm run fmt";
      files = "\\.(js|jsx|ts|tsx|json|md)$";
      language = "system";
      pass_filenames = false;
    };
    pint = {
      enable = true;
      name = "pint (php formatting)";
      entry = "composer fmt";
      files = "\\.php$";
      language = "system";
      pass_filenames = false;
    };
    rector = {
      enable = true;
      name = "rector (php refactor)";
      entry = "composer refactor";
      files = "\\.php$";
      language = "system";
      pass_filenames = false;
    };

    npm-audit = {
      enable = true;
      name = "npm packages audit";
      entry = "npm audit";
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
    vite.exec = "npm run dev -- --host 127.0.0.1 --port ${toString vitePort} --strictPort";
    pail.exec = "php artisan pail --timeout=0";
  };

  env = {
    APP_URL = "https://${hostname}";

    SESSION_DOMAIN = ".${slug}.test";

    DB_CONNECTION = "mysql";
    DB_DATABASE = dbName;

    VITE_APP_URL = "https://${assetsHost}";
  };

  enterShell = ''
    set -euo pipefail

    mkdir -p "${caddySitesDir}"
    cat > "${caddySite}" <<EOF
    ${hostname} {
      root * ${worktreeRoot}/public
      php_fastcgi 127.0.0.1:${toString appPort}
      encode zstd gzip
      file_server
    }

    ${assetsHost} {
      reverse_proxy 127.0.0.1:${toString vitePort}
    }
    EOF

    if curl -fsS --max-time 2 http://localhost:2019/config/ >/dev/null 2>&1; then
      if curl -fsS -X POST -H "Content-Type: text/caddyfile" \
           --data-binary @/etc/caddy/Caddyfile \
           "http://localhost:2019/load?adapter=caddyfile" >/dev/null; then
        echo "✓ caddy reloaded (${hostname}, ${assetsHost})"
      else
        echo "⚠ caddy admin API rejected reload — check /etc/caddy/Caddyfile syntax"
      fi
    else
      echo "⚠ caddy admin API not reachable. Try: sudo launchctl kickstart -k system/org.nixos.caddy"
    fi

    shopt -s nullglob 2>/dev/null || true
    for f in "${caddySitesDir}/"joeymckenzie-*.caddy; do
      base=$(basename "$f" .caddy)
      name=''${base#joeymckenzie-}
      [ "$name" = "main" ] && continue
      [ "$name" = "${shortName}" ] && continue
      if [ ! -d "${worktreesRoot}/$name" ]; then
        echo "→ removing stale caddy site: $name"
        rm -f "$f"
      fi
    done

    if [ ! -d vendor ]; then composer install; fi
    if [ ! -d node_modules ]; then npm install; fi
    if [ ! -f .env ]; then
      cp .env.example .env
      php artisan key:generate
    fi
    if mysqladmin ping -h 127.0.0.1 -P 3306 -u root --silent 2>/dev/null; then
      if ! mysql -h 127.0.0.1 -P 3306 -u root -N -e "SHOW DATABASES LIKE '${dbName}'" | grep -q "${dbName}"; then
        echo "Creating database ${dbName}..."
        mysql -h 127.0.0.1 -P 3306 -u root -e "CREATE DATABASE \`${dbName}\`"
      fi
      php artisan migrate --force
    else
      echo "⚠ MySQL is not accepting connections on 127.0.0.1:3306; start it, then re-enter the shell (or run: mysql -u root -e 'CREATE DATABASE \`${dbName}\`;')."
    fi

    echo "── ${shortName} (index=${toString index}) ──"
    echo "  url    https://${hostname}"
    echo "  assets https://${assetsHost}"
    echo "  fpm    127.0.0.1:${toString appPort}"
    echo "  vite   127.0.0.1:${toString vitePort}"
  '';
}
