{ pkgs, ... }:

let
  appName = "joeymckenzie.tech";
  appHost = "${appName}.test";
  port = 3000;
  home = builtins.getEnv "HOME";
  caddySitesDir = "${home}/.config/caddy/sites";
  caddySite = "${caddySitesDir}/${appName}.caddy";

  mcpServers = {
    devenv = {
      command = "devenv";
      args = [ "mcp" ];
    };
    playwright = {
      command = "npx";
      args = [
        "-y"
        "@playwright/mcp@latest"
      ];
    };
    backlog = {
      command = "backlog";
      args = [
        "mcp"
        "start"
      ];
    };
    next = {
      command = "npx";
      args = [
        "-y"
        "next-devtools-mcp@latest"
      ];
    };
    shadcn = {
      command = "npx";
      args = [
        "shadcn@latest"
        "mcp"
      ];
    };
    chrome = {
      type = "stdio";
      command = "npx";
      args = [
        "-y"
        "chrome-devtools-mcp@latest"
        "--slim"
        "--headless"
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

  packages = [
    pkgs.figlet
    pkgs.agent-browser
  ];

  scripts = {
    ci-lint.exec = ''
      set -euo pipefail
      npm run lint
      npm run fmt:check
      npm run types:check
    '';

    ci-build.exec = ''
      set -euo pipefail
      npm run build
    '';

    ci-deploy.exec = ''
      set -euo pipefail
      npm run build
      npx wrangler pages deploy \
        --branch "''${GITHUB_REF_NAME:-$(git rev-parse --abbrev-ref HEAD)}"
    '';
  };

  files.".codex/config.toml".toml.mcp_servers = mcpServers;

  claude.code.enable = true;
  claude.code.mcpServers = claudeMcpServers;

  opencode.enable = true;
  opencode.mcp = opencodeMcpServers;

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_24;
  };

  git-hooks.hooks = {
    prettier = {
      enable = true;
      name = "prettier";
      entry = "npm run fmt";
      files = "\\.(js|ts|json|md)$";
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
  };

  processes = {
    dev.exec = ''
      pids=$(lsof -ti :${toString port} 2>/dev/null || true)
      if [ -n "''${pids}" ]; then
        echo "killing process(es) on port ${toString port}: ''${pids}"
        kill -9 ''${pids} 2>/dev/null || true
      fi
      npm run dev
    '';
  };

  enterShell = ''
    if [ ! -d node_modules ]; then npm ci; fi

    mkdir -p "${caddySitesDir}"
    cat > "${caddySite}" <<EOF
    ${appHost} {
      reverse_proxy 127.0.0.1:${toString port}
    }
    EOF

    if curl -fsS --max-time 2 http://localhost:2019/config/ >/dev/null 2>&1; then
      if curl -fsS -X POST -H "Content-Type: text/caddyfile" \
           --data-binary @/etc/caddy/Caddyfile \
           "http://localhost:2019/load?adapter=caddyfile" >/dev/null; then
        echo "✓ caddy reloaded (${appHost})"
      else
        echo "⚠ caddy admin API rejected reload — check /etc/caddy/Caddyfile syntax"
      fi
    else
      echo "⚠ caddy admin API not reachable. Try: sudo launchctl kickstart -k system/org.nixos.caddy"
    fi

    figlet "${appName}"
  '';
}
