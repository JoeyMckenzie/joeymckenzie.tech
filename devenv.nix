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

  # The CI pipeline lives here rather than in the workflow file, so `ci-lint`
  # and `ci-build` run identically on a laptop and on a runner. `.github/
  # workflows/ci.yml` only sets up devenv and calls these.
  scripts = {
    # Checks only -- no build. Keeping the build out means a formatting slip
    # reports as a formatting slip in seconds, instead of after a full build.
    ci-lint.exec = ''
      set -euo pipefail
      npm run lint
      npm run fmt:check
      npm run types:check
    '';

    # The build is the real test here: `output: "export"` fails loudly on
    # anything a static export cannot represent, so a green build is the
    # guarantee that the site can actually ship.
    ci-build.exec = ''
      set -euo pipefail
      npm run build
    '';

    # Rebuilds rather than reusing the `ci-build` job's output: each job sets
    # up its own devenv shell anyway, and passing `out/` between them as an
    # artifact costs more than the rebuild does.
    #
    # `--branch` is passed explicitly because a runner checks out a detached
    # HEAD, where wrangler's own branch detection reports nothing. Pages uses
    # it to decide production vs preview deployment.
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
    dev.exec = "npm run dev";
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
