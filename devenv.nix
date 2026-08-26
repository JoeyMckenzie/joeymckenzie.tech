{ pkgs, ... }:

let
  appName = "joeymckenzie.tech";
  appHost = "${appName}.test";
  port = 4321;
  home = builtins.getEnv "HOME";
  caddySitesDir = "${home}/.config/caddy/sites";
  caddySite = "${caddySitesDir}/${appName}.caddy";

  mcpServers = {
    astro.url = "https://mcp.docs.astro.build/mcp";
    devenv = {
      command = "devenv";
      args = [ "mcp" ];
    };
    playwright = {
      command = "pnpm";
      args = [
        "dlx"
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
    ASTRO_DEV_BACKGROUND = 0;
    ASTRO_PREVIEW_BACKGROUND = 0;
  };

  packages = [
    pkgs.figlet
  ];

  scripts = {
    ci-lint.exec = ''
      set -euo pipefail
      pnpm run build
      pnpm lint:check
      pnpm fmt:check
      pnpm types:check
    '';
    ci-test.exec = ''
      set -euo pipefail
      pnpm run build
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
    pnpm.enable = true;
    corepack.enable = true;
  };

  git-hooks.hooks = {
    prettier = {
      enable = true;
      name = "prettier";
      entry = "pnpm fmt";
      files = "\\.(js|ts|json|md)$";
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
  };

  processes = {
    vite.exec = "exec pnpm dev --port ${toString port} --strictPort";
  };

  enterShell = ''
    if [ ! -d node_modules ]; then pnpm install; fi

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
