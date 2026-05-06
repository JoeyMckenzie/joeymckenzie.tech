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

  appPort = 8000 + index;
  vitePort = 5173 + index;
  hostname =
    if shortName == "main"
    then "${slug}.test"
    else "${shortName}.${slug}.test";

  toolsPath = /. + "${builtins.getEnv "HOME"}/.config/devenv/tools.nix";
in
{
  imports = [ toolsPath ];

  dotenv.disableHint = true;

  languages.php = {
    enable = true;
    version = "8.5";
    extensions = [
      "intl"
      "bcmath"
      "zip"
    ];
  };

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_22;
    npm.enable = true;
  };

  processes.app.exec = "php artisan serve --host=127.0.0.1 --port=${toString appPort}";
  processes.vite.exec = "npm run dev -- --port ${toString vitePort} --strictPort";
  processes.pail.exec = "php artisan pail --timeout=0";

  processes.migrate = {
    exec = "php artisan migrate --force";
    process-compose.availability.restart = "no";
  };
  processes.app.process-compose.depends_on.migrate.condition = "process_completed_successfully";

  env = {
    APP_URL = "https://${hostname}:8443";
    APP_PORT = toString appPort;

    SESSION_DOMAIN = ".${slug}.test";

    DB_CONNECTION = "sqlite";
  };

  enterShell = ''
    echo "── ${shortName} (index=${toString index}) ──"
    echo "  url   https://${hostname}:8443"
    echo "  app   127.0.0.1:${toString appPort}"
    echo "  vite  127.0.0.1:${toString vitePort}"

    [ ! -d vendor ]                   && composer install
    [ ! -d node_modules ]             && npm install
    [ ! -f .env ]                     && cp .env.example .env && php artisan key:generate
    [ ! -f database/database.sqlite ] && touch database/database.sqlite
  '';
}
