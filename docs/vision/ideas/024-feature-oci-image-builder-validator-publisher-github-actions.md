---
title: "[FEATURE] OCI Image Builder + Validator + Publisher (GitHub Actions)"
description: "Vision idea tracked as GitHub issue #24."
---

- Status: **open**
- GitHub issue: [winccoa-tools-pack/.github#24](https://github.com/winccoa-tools-pack/.github/issues/24)
- Last sync: 2026-04-12 04:52:36 UTC
- Labels:
- enhancement
- CI
- DevOps
- containers
- oa-lint
- QG
- gh-automation

---

OCI Image Builder & Publisher Pipeline for WinCC OA Analyzer

🎯 Goal
Create a GitHub Actions pipeline that:

1. Pulls the latest base image from  
   mpokornyetm/winccoa:general
2. Detects whether a new base image version exists
3. Builds a new OCI compliant image on top of the base image
4. Registers a WinCC OA project inside the container using shell commands
5. Starts a CTRL Manager inside the container to validate the image
6. Pushes the final image to:
   - GitHub Container Registry (GHCR)
   - Docker Hub
7. Runs weekly on a schedule
8. Runs inside an organization repository

---

🧱 Base Image
```
https://hub.docker.com/repository/docker/mpokornyetm/winccoa/general
```

---

🏗️ Pipeline Overview

1. Trigger
- Weekly cron schedule
- Manual dispatch
- Optional: trigger when base image changes (digest check)

2. Steps
1. Checkout repository  
2. Pull base image  
3. Compare digest with last known digest  
4. If unchanged → exit  
5. Build new OCI image using Docker Buildx  
6. Run WinCC OA project registration script inside container  
7. Start CTRL Manager inside container  
8. Validate that the manager starts successfully  
9. Tag image for GHCR + Docker Hub  
10. Push to both registries  
11. Update stored digest  
12. Notify success/failure

---

🧪 Validation Logic
Inside the container:

- Run WinCC OA project registration:
```
  /opt/WinCC_OA/<version>/bin/WCCOApmon -autofreg -status -config <absolutePathToProjectConfigFile>
```
- Start CTRL Manager:
```
  /opt/WinCC_OA/<version>/bin/WCCOActrl <ctrlScriptFile.ctl> -proj myproj
```
- Check exit code  
- Check logs for startup success  
- If failure → pipeline stops, no push

---

🐳 Dockerfile Template (OCI ready)
```Dockerfile
FROM mpokornyetm/winccoa:general

Copy analyzer tools
COPY analyzer /usr/local/bin/analyzer

Register project at build time (optional)

RUN /opt/WinCC_OA/<version>/bin/WCCOApmon -regSub -config <...>

ENTRYPOINT ["/usr/local/bin/analyzer"]
```

---

🚀 GitHub Actions Workflow (High Level Plan)

Workflow name
```
oci-image-builder.yml
```

Jobs

job: check-base-image
- Pull base image
- Extract digest
- Compare with stored digest file in repo
- If unchanged → stop workflow

job: build-oci-image
- Set up Docker Buildx
- Build OCI image:
```
  docker buildx build --output type=oci,dest=analyzer.oci .
```
- Also build normal Docker image for validation:
```
  docker build -t analyzer:test .
```

job: validate-image
- Run container:
```
  docker run --rm analyzer:test /opt/WinCC_OA/.../WCCOAregProject -create testproj
```
- Start CTRL Manager:
```
  docker run --rm analyzer:test /opt/WinCC_OA/.../WCCOActrl -proj testproj -num 1
```
- Check logs for success
- If failure → fail job

job: push-images
- Login to GHCR
- Login to Docker Hub
- Tag image:
```
  docker tag analyzer:test ghcr.io/<org>/winccoa-analyzer:latest
  docker tag analyzer:test <dockerhub-user>/winccoa-analyzer:latest
```
- Push both:
```
  docker push ghcr.io/<org>/winccoa-analyzer:latest
  docker push <dockerhub-user>/winccoa-analyzer:latest
```

job: update-digest
- Write new digest to base-image-digest.txt
- Commit & push to repo

---

🕒 Schedule
```
schedule:
  - cron: "0 3 1" # Every Monday at 03:00
```

---

🔐 Secrets Required
- GHCR_TOKEN
- DOCKERHUB_USERNAME
- DOCKERHUB_TOKEN
- Optional: WINCCOA_LICENSE (if needed)

---

📦 Output
- OCI image: analyzer.oci
- GHCR image: ghcr.io/&lt;org&gt;/winccoa-analyzer:latest
- Docker Hub image: &lt;dockerhub-user&gt;/winccoa-analyzer:latest
- Updated digest file

---

📝 Notes
- The pipeline must run in an organization repository.
- The pipeline must fail early if:
  - base image unchanged  
  - build fails  
  - project registration fails  
  - CTRL Manager fails to start  
- Only push when validation succeeds.
