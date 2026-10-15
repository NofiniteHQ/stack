# Country Lookup API

Retrieve country metadata and dial codes using fast in-memory helpers.

---

## Functions

### `getCountryByCode(iso: string)`

Resolves country details by case-insensitive ISO-2 code (e.g., `'IN'`, `'us'`, `'FR'`).

```ts
import { getCountryByCode } from '@nofinite/locale';

const country = getCountryByCode('IN');
console.log(country);
```

**Returned Object:**

```ts
{
  name: "India",
  iso2: "IN",
  dialCode: "+91"
}
```

---

### `getCountryByDialCode(dialCode: string)`

Resolves country details by telephone dial code (with or without `+` sign).

```ts
import { getCountryByDialCode } from '@nofinite/locale';

const us = getCountryByDialCode('+1');
const uk = getCountryByDialCode('44');
```

---

### All Countries Array (`countries`)

Export the complete list of 250+ country records:

```ts
import { countries } from '@nofinite/locale';

export function CountrySelect() {
  return (
    <select className="select">
      {countries.map((c) => (
        <option key={c.iso2} value={c.iso2}>
          {c.name} ({c.dialCode})
        </option>
      ))}
    </select>
  );
}
```
