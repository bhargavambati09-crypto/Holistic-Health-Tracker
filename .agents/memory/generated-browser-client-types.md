---
name: Generated browser client types
description: TypeScript library requirements for generated browser fetch code.
---

Include the DOM iterable library in the browser API client's TypeScript libs when generated fetch helpers use iterable `Headers` methods such as `entries()`.

**Why:** The DOM declarations alone can omit iterable methods, causing code generation's follow-up typecheck to fail even though the generated client is valid at runtime.

**How to apply:** If the generated API client reports missing methods on `Headers`, check its `lib` compiler option before changing generated code.
