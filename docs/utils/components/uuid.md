# UUID Utilities

Utilities for generating and working with **UUID v7**, including helpers for
binary storage (`Buffer`) and conversions.

These helpers are designed for **databases, performance-sensitive systems,
and ordering guarantees**, where UUID v7 is preferred over older versions.

---

## Usage

### Generate UUID (string)

```ts
import { generateUuid } from '@nofinite/utils';

const id = generateUuid();
// → "018f1c7e-3c1e-7b92-9c6d-9a3c1a6b2f44"
```

---

### Generate UUID as Buffer

Useful when storing UUIDs in binary form (e.g. `BINARY(16)` in MySQL).

```ts
import { generateUuidBuffer } from '@nofinite/utils';

const buffer = generateUuidBuffer();
// → <Buffer 01 8f 1c 7e 3c 1e 7b 92 9c 6d 9a 3c 1a 6b 2f 44>
```

---

### Convert Buffer to UUID

```ts
import { binaryToUuid } from '@nofinite/utils';

const uuid = binaryToUuid(buffer);
// → "018f1c7e-3c1e-7b92-9c6d-9a3c1a6b2f44"
```

---

### Convert UUID to Buffer

```ts
import { uuidToBuffer } from '@nofinite/utils';

const buffer = uuidToBuffer('018f1c7e-3c1e-7b92-9c6d-9a3c1a6b2f44');
```

---

## API

### `generateUuid`

Generates a UUID v7 string.

```ts
function generateUuid(): string;
```

---

### `generateUuidBuffer`

Generates a UUID v7 and returns it as a binary buffer (16 bytes).

```ts
function generateUuidBuffer(): Buffer;
```

---

### `binaryToUuid`

Converts a binary UUID buffer back into a UUID string.

```ts
function binaryToUuid(buffer: Buffer): string;
```

---

### `uuidToBuffer`

Converts a UUID string into a binary buffer.

```ts
function uuidToBuffer(uuid: string): Buffer;
```

---

## Why UUID v7?

- Time-ordered (better index performance than v4)
- Globally unique
- Sortable by creation time

Ideal for:

- Databases
- Distributed systems
- Event-based architectures

---

## Notes

- This library intentionally supports **only UUID v7**
- No v4 or v1 helpers are exposed to avoid accidental misuse
- If you need random UUIDs, use a dedicated UUID library directly

---

## Best Practices

### Do

- Use `generateUuidBuffer()` for database storage
- Convert back to string only at API boundaries
- Index UUID columns when using binary storage

### Don’t

- Mix UUID versions in the same column
- Use UUID strings when binary storage is available
- Generate UUIDs on the client if ordering matters
