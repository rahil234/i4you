# System design documentation

This folder contains architecture and system design documentation for the i4you monorepo.

Folder layout:
- docs/system-design/
  - architecture.mmd — main architecture (Mermaid) source
  - assets/ — exported diagrams and supporting images

Conventions:
- Prefer text-based diagrams that live in git:
  - Mermaid: .mmd files (or Mermaid code blocks embedded in Markdown)
  - PlantUML: .puml (if you choose to use it)
- When exporting images for READMEs or external docs:
  - Vector: .svg (preferred)
  - Raster: .png (fallback for screenshots or when SVG isn’t practical)
- Naming:
  - Use kebab-case and a short prefix for the area, e.g. `arch-overview.svg`, `seq-auth-login.svg`, `k8s-dev-topology.svg`
  - Optionally add a version/date suffix if helpful, e.g. `arch-overview-2025-08.svg`
- Paths in README:
  - Use relative paths from the README where you embed, e.g. `./docs/system-design/assets/arch-overview.svg`
- Keep source next to exports:
  - Keep the editable `.mmd` / `.puml` source alongside the exported `.svg`/`.png` so updates are easy.

Notes on Mermaid support:
- GitHub and many tools render Mermaid inside Markdown automatically.
- If a platform does not support Mermaid, include an exported SVG/PNG under `assets/` and embed that instead.

Example embedding in Markdown (Mermaid):

```mermaid
flowchart LR
  A[Browser] -->|HTTPS| B[Traefik Ingress]
  B --> C[Services (K8s)]
  C --> D[(MongoDB)]
  C --> E[(Redis)]
  C --> F[(Kafka)]
```

Example embedding exported image:

```md
![Architecture overview](./assets/arch-overview.svg)
```