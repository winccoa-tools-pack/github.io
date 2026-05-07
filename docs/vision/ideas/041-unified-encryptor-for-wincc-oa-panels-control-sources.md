---
title: "Unified encryptor for WinCC OA panels & control sources"
description: "Vision idea tracked as GitHub issue #41."
---

- Status: **open**
- GitHub issue: [winccoa-tools-pack/.github#41](https://github.com/winccoa-tools-pack/.github/issues/41)
- Last sync: 2026-05-07 05:38:07 UTC
- Labels:
- enhancement
- security

---

# Tool: winccoa-encrypt — unified encryptor for WinCC OA panels & control sources

## Summary
Create a cross-platform CLI and library (and optional VS Code extension) that encrypts WinCC OA panels, control scripts, libs, and classes so projects can be published or distributed safely (GitHub, GitLab, Artifactory, Jenkins, local CLI). The tool should behave like the referenced npm-winccoa-ui-pnl-xml project but also handle control sources (`.ctl`, libs, classes) and support encrypting an entire project folder with automatic handling of `/panels` and `/scripts`.

## Motivation
- WinCC OA uses two separate encryption tools for panels and control sources today, making CI/CD and distribution brittle.
- Customers need a single, automated, auditable way to protect sources before publishing.
- Tooling should be usable interactively (VS Code), via CI (GitHub Actions / GitLab CI / Jenkins), and locally from the command line.

## Goals
- Single CLI and library that:
	- Encrypts WinCC OA panel files (same behavior as official panel encryption).
	- Encrypts control sources: `scripts`, `libs`, `classes`, `*.ctl` artifacts (matching WinCC OA control encryption expectations).
	- Optionally decrypts for local development if authorized.
	- Operates on single files, directories, or whole project roots.
	- Registers/deregisters a temporary project when given a raw project path (to use WinCC OA project-based encryption where needed).
	- Integrates into VS Code, GitHub/GitLab CI, and Jenkins.
	- Produces deterministic output suitable for packaging and reproducible builds.

## Non-goals
- Replace official WinCC OA runtime or UI — only encryption tooling.
- Provide a long-term key-management server (but allow integration with external KMS).
- Bypass WinCC OA licensing or protections.

## Functional requirements

- CLI
	- `winccoa-encrypt encrypt -i &lt;input&gt; -o &lt;output&gt; [options]`
	- `winccoa-encrypt decrypt -i &lt;input&gt; -o &lt;output&gt; [options]` (optional, gated by policy)
	- `winccoa-encrypt status -i &lt;input&gt;`
	- `winccoa-encrypt version`

- Project targeting
	- `--proj &lt;registered_project_name&gt;` — use an existing registered WinCC OA project.
	- `--config &lt;fullPathToWinCCOAProjectConfig&gt;` — use specific project config.
	- `--sourcePath &lt;fullPathToProjectSources&gt;` — temporarily register the project, perform encryption, then deregister.
	- If none provided and input is a file/folder, infer behavior from path structure.
    - `--version` for to force which wincc oa version shall be used.
    - `--overwrite`      Overwrite existing output files
    - `--timeout &lt;ms&gt;`    Increase process timeout

- Automatic handling
	- When a project root is provided, automatically find and process:
		- `/panels` (panel XML & related assets) — use panel encryption flow.
		- `/scripts`, `/libs`, `/classes` and `*.ctl` files — use control encryption flow.
	- Recursive mode with `--recursive`.

- File selection and patterns
	- `--include` / `--exclude` (glob patterns)
	- `--dry-run` to list changes without writing
	- `--preserve` to control whether original files are replaced or new encrypted files are written

- Output & packaging
	- `--manifest` produces a manifest JSON listing files processed and cryptographic metadata

- Key & passphrase management
	- `--keyfile &lt;path&gt;` specify key file (PEM or proprietary)
	- `--passphrase-env &lt;ENV_VAR&gt;` read passphrase from environment variable (for CI)
	- `--kms &lt;provider&gt;:&lt;identifier&gt;` optional: integrate with AWS KMS / Azure Key Vault / Hashicorp Vault
	- Support ephemeral keys for one-off builds and pinned keys for reproducible packages

- Logging & compliance
	- `--verbose`, `--quiet`, `--log &lt;path&gt;`
	- `--checksum` (sha256) for manifest entries

## Security
The core encryption formats, keys and runtime protections are part of WinCC OA and must be enforced by the official WinCC OA toolchain. `winccoa-encrypt` will act as a wrapper or orchestrator for the official encryptors and will not implement or replace WinCC OA's cryptographic primitives or license enforcement. The tool should avoid persisting secrets; users must provide keys/passphrases via CI secrets or external KMS integrations.

## Expected behavior: project registration flow
- If `-sourcePath` provided and the project is not registered:
	- Temporarily register project.
	- Run required WinCC OA registration steps needed for encryption.
	- Perform encryption on panels & control sources.
	- Deregister the temporary project.
	- Clean up temp files, leaving only encrypted output and manifest.
- Provide `--keep-registration` for debugging.
- Check if registered project has the same path as `sourcePath` argument

## Integration examples

- VS Code
	- Provide a lightweight extension with a command palette action `WinCC OA: Encrypt project`.
	- The extension calls the `winccoa-encrypt` binary with configured options or uses the Node library API.
	- Use workspace settings to store `keyfile`, `policy`, and `default out folder`.

- GitHub Actions
```yaml
jobs:
	# Note: WinCC OA must be installed on the runner. Use a self-hosted Windows runner
	# with WinCC OA installed, or a custom OCI image that contains WinCC OA where applicable.
	encrypt:
		runs-on: [self-hosted, windows, x64]
		steps:
			- uses: actions/checkout@v4
			- name: Install winccoa-encrypt
				run: npm ci && npm run build # or download binary
			- name: Encrypt sources
				env:
					ENC_PASSPHRASE: ${{ secrets.WCCOA_ENC_PASSPHRASE }}
				run: |
					winccoa-encrypt encrypt -i . --sourcePath ./ --keyfile keys/prod.key --passphrase-env ENC_PASSPHRASE --manifest
			- name: Upload artifact
				uses: actions/upload-artifact@v4
				with:
					name: encrypted-project
					path: ./encrypted
```

- GitLab CI
```yaml
encrypt:
	script:
		- winccoa-encrypt encrypt -i . --sourcePath ./ -keyfile keys/prod.key --passphrase-env ENC_PASSPHRASE --manifest
	artifacts:
		paths:
			- encrypted/
```

- Jenkins (declarative pipeline snippet)
```groovy
withCredentials([string(credentialsId: 'wccoa-pass', variable: 'ENC_PASSPHRASE')]) {
		sh 'winccoa-encrypt encrypt -i . --sourcePath ./ -keyfile keys/prod.key --passphrase-env ENC_PASSPHRASE --manifest'
}

## Reusable GitHub workflow (action)
Provide a reusable workflow that encapsulates the encryption step so other repos can call it via `uses:`. Example `.github/workflows/winccoa-encrypt.yml` with `workflow_call` inputs:

```yaml
name: WinCC OA Encrypt
on:
	workflow_call:
		inputs:
			sourcePath:
				required: true
				type: string
			keyfile:
				required: true
				type: string
		secrets:
			ENC_PASSPHRASE:
				required: true
jobs:
	encrypt:
		# Use a self-hosted Windows runner that has WinCC OA 3.21 installed,
		# or reference a custom container image if you have a supported Linux image.
		runs-on: [self-hosted, windows, x64]
		steps:
			- uses: actions/checkout@v4
			- name: Run winccoa-encrypt
				run: |
					winccoa-encrypt encrypt -i $&#123;&#123; inputs.sourcePath &#125;&#125; --sourcePath $&#123;&#123; inputs.sourcePath &#125;&#125; --keyfile $&#123;&#123; inputs.keyfile &#125;&#125; --passphrase-env ENC_PASSPHRASE --manifest
```

Example usage from another workflow:

```yaml
jobs:
	call-encrypt:
		uses: ./.github/workflows/winccoa-encrypt.yml
		with:
			sourcePath: ./
			keyfile: keys/prod.key
		secrets:
			ENC_PASSPHRASE: $&#123;&#123; secrets.WCCOA_ENC_PASSPHRASE &#125;&#125;
```

## Dockerfile (optional)
Provide an OCI image recipe that includes WinCC OA 3.21 and the `winccoa-encrypt` tool for CI runners. Note: WinCC OA is proprietary — the image must be built by users who supply the installer and any required licenses.

Example Dockerfile skeleton:

```dockerfile
FROM ubuntu:22.04
ARG WCCOA_INSTALLER=winccoa-3.21-installer.tar.gz
COPY $&#123;WCCOA_INSTALLER&#125; /tmp/
# TODO: add install steps using vendor installer and license files
# install dependencies and the winccoa-encrypt binary
RUN apt-get update && apt-get install -y ca-certificates curl
# placeholder for vendor install
CMD ["/bin/bash"]
```
```

## Library / API
- Provide Node.js library (and optionally Python) that exposes:
	- `encryptPath(&#123; path, project, key, out, policy &#125;) -> Promise&lt;Manifest&gt;`
	- `encryptFile(&#123;...&#125;)`
	- Hooks/callbacks for progress and custom handlers
- Ensure sync-friendly interfaces for build tools

## Testing & acceptance criteria
- Unit tests for file discovery, pattern matching and manifest generation
- Integration test that:
	- Encrypts a sample project with `-projPath`, verifies registration/deregistration, verifies the manifest and checksums
	- Verifies encrypted panels are consumable by the WinCC OA runtime (if feasible) or match official encrypted output expectations
- CI pipeline examples in repo that demonstrate full encrypt + artifact publish flow
- Security audit checklist for common threats (passphrase leakage, temp files)

## Implementation roadmap (high-level)
1. PoC: CLI that encrypts control files only (local), supports keyfile/passphrase  
2. Add panel encryption flow to match official behavior  
3. Implement `-projPath` temporary registration flow  
4. Add manifest, packaging and KMS support  
5. Provide Node library and VS Code extension prototype  
6. Add CI examples, tests, docs

## Deliverables
- `winccoa-encrypt` CLI (cross-platform binary or Node package)  
- Node library API  
- Manifest format specification  
- VS Code extension (optional initial version)  
- Example GitHub Actions / GitLab CI / Jenkins pipelines  
- README, usage docs, security considerations

## Open questions
- Preferred KMS providers for integration (AWS, Azure, Hashicorp, other)?


