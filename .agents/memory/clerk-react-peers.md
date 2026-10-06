---
name: Clerk React peer versions
description: React and Clerk SDK peer-version compatibility in this workspace.
---

Keep the web artifact's React and React DOM versions within the exact peer range declared by the installed Clerk React packages. Here, Clerk rejected React 19.1.0 while supporting 19.1.4; the mismatch produced an invalid-hook-call error at runtime. Pin compatible versions together and retain Vite's React deduplication.

**Why:** A typecheck can pass even when duplicated or peer-incompatible React runtimes make Clerk fail in the browser.

**How to apply:** When changing either React or Clerk packages, inspect peer warnings and confirm the auth page renders in the preview.
