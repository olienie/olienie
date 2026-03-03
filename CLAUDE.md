# CLAUDE.md

This file provides guidance for AI assistants (Claude and others) working in this repository.

## Repository Overview

This is a freshly initialized Git repository owned by **olienie** on GitHub. As of the time of writing, it contains no source code — only the initial scaffolding. This CLAUDE.md should be updated as the codebase grows.

**Repository**: `olienie/olienie`
**Remote**: `http://local_proxy@127.0.0.1:63995/git/olienie/olienie`

---

## Git Workflow

### Branch Naming

- The default branch is `master`.
- Claude Code AI sessions must use branches prefixed with `claude/` and suffixed with the session ID, e.g.:
  ```
  claude/claude-md-mm9un9jg3ajowqpb-DohK5
  ```
- Never push directly to `master` without explicit permission.

### Commit Signing

All commits are **GPG/SSH signed**. The signing is handled automatically via:
- **Signing key**: `/home/claude/.ssh/commit_signing_key.pub`
- **Format**: SSH (`gpg.format=ssh`)
- **Program**: `/tmp/code-sign`
- `commit.gpgsign=true` is enforced globally — never bypass with `--no-gpg-sign`.

### Push Instructions

Always push with upstream tracking:
```bash
git push -u origin <branch-name>
```

If a push fails due to network errors, retry up to 4 times with exponential backoff: 2s, 4s, 8s, 16s.

A push will fail with HTTP 403 if the branch name does not start with `claude/` and end with the matching session ID.

### Commit Messages

- Write clear, descriptive commit messages in the imperative mood.
- Keep the subject line under 72 characters.
- Add a body when the change needs explanation beyond the subject.

---

## Development Setup

The repository is currently empty. When a technology stack is chosen and code is added, update this section with:

- Language/runtime version requirements
- Dependency installation steps (`npm install`, `pip install`, etc.)
- Environment variable setup (`.env` files, required secrets)
- Build commands
- How to run the project locally

---

## Testing

No test suite is configured yet. When tests are added, document here:

- Test runner command (e.g., `npm test`, `pytest`, `go test ./...`)
- How to run a single test or subset
- Any required test environment setup

---

## Code Style & Conventions

No linting or formatting tools are configured yet. When added, document:

- Formatter (e.g., Prettier, Black, gofmt) and how to run it
- Linter (e.g., ESLint, Ruff, golangci-lint) and how to run it
- Any style decisions that differ from the formatter's defaults

---

## Project Structure

To be documented once files are added. When the project has structure, describe:

- Top-level directories and their purpose
- Where entry points live
- Where tests live
- Where configuration lives

---

## AI Assistant Guidelines

- Read existing code before proposing changes. Understand the pattern in use before introducing new ones.
- Prefer editing existing files over creating new ones unless a new file is clearly necessary.
- Do not add comments, docstrings, or type annotations to code you did not write or change.
- Keep changes minimal and focused on what was requested — no opportunistic refactoring.
- When a task involves multiple steps, use the TodoWrite tool to track progress.
- Never delete files or branches without explicit user confirmation.
- Never force-push to shared branches.
- Never skip commit signing (`--no-gpg-sign`, `--no-verify`).
- For destructive or irreversible actions (dropping data, resetting hard, force-pushing), ask for confirmation first.
- This CLAUDE.md should be kept up to date as the project evolves.
