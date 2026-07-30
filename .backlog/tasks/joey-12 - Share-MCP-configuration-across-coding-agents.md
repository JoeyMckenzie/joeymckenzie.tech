---
id: JOEY-12
title: Share MCP configuration across coding agents
status: Done
assignee:
  - OpenCode
created_date: '2026-07-30 18:26'
updated_date: '2026-07-30 18:36'
labels:
  - devenv
  - mcp
milestone: Developer tooling
dependencies: []
references:
  - devenv.nix
documentation:
  - 'https://developers.openai.com/codex/extend/mcp'
modified_files:
  - devenv.nix
  - .gitignore
  - .codex/config.toml
priority: medium
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Remove duplicated MCP server declarations from devenv.nix and make Claude Code, OpenCode, and Codex consume one project-level MCP server definition so adding or changing a server requires one edit.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 A single MCP server definition supplies all configured servers to Claude Code, OpenCode, and Codex.
- [x] #2 Local and remote MCP transports are translated into each client's expected configuration shape.
- [x] #3 devenv generates a project-scoped .codex/config.toml containing the shared MCP servers.
- [x] #4 The devenv configuration evaluates successfully and generated client configurations contain all shared servers.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define a single transport-neutral mcpServers attribute set in devenv.nix using command/args for stdio servers and url for HTTP servers.
2. Derive Claude Code and OpenCode MCP attributes with builtins.mapAttrs, translating only each client's transport type and command representation.
3. Generate the project-scoped .codex/config.toml from the shared definitions via devenv's TOML file support and ignore the generated symlink.
4. Format and evaluate devenv, materialize generated files, and verify every client configuration contains the same six MCP servers.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Verified generated .mcp.json, opencode.jsonc, and .codex/config.toml each contain backlog, boost, devenv, nightwatch, playwright, and shadcn.

Codex CLI 0.146.0 accepted the generated TOML. Normal project-layer loading remains gated by Codex's repository trust prompt.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Consolidated all six MCP server declarations into one mcpServers attribute set in devenv.nix. Claude Code and OpenCode now derive their client-specific transport shapes with small mapAttrs adapters, while devenv generates Codex's project-scoped .codex/config.toml directly from the shared definitions. Added the generated Codex config to .gitignore alongside the other generated agent configuration files.

Verification: nixfmt --check passed; Claude and OpenCode each discovered all six generated MCP servers; Codex parsed and listed all six entries from the generated TOML; devenv info and devenv test completed successfully. The test process logged existing port-in-use retries for ports 8000 and 5173 before reporting success.
<!-- SECTION:FINAL_SUMMARY:END -->
