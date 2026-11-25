# Internationalization, Formatting & React Provider (`v2.1.0`)

`@nofinite/locale` `2.1.0` provides dedicated zero-dependency subpaths for BCP 47 parsing, `Intl`-backed formatters, lightweight translations, and React context state.

---

## 1. React Provider (`@nofinite/locale/react`)

Wrap your application with `LocaleProvider` and read active locale, text direction, translator, and pre-bound formatters via `useLocale()` or `useTranslation()`:

```tsx
import {
  LocaleProvider,
  useLocale,
  useTranslation,
} from '@nofinite/locale/react';

function OrderCard() {
  const { locale, direction, formatCurrency, formatDate } = useLocale();
  const { t } = useTranslation('checkout');

  return (
    <div dir={direction} data-locale={locale} className="card p-6">
      <h3>{t('title')}</h3>
      <p>{formatCurrency(149.99, 'USD')}</p>
      <span>{formatDate(new Date())}</span>
    </div>
  );
}

export function App() {
  return (
    <LocaleProvider
      defaultLocale="en-US"
      supportedLocales={['en-US', 'fr-FR', 'ar-AE']}
      syncDom
      messages={{
        'en-US': { checkout: { title: 'Order Summary' } },
        'fr-FR': { checkout: { title: 'Récapitulatif' } },
      }}
    >
      <OrderCard />
    </LocaleProvider>
  );
}
```

---

## 2. BCP 47 Tag Parsing & Matching (`@nofinite/locale/bcp47`)

```ts
import { parseLocale, getDirection, matchLocale } from '@nofinite/locale/bcp47';

const parsed = parseLocale('ar-EG');
// { tag: 'ar-EG', language: 'ar', region: 'EG', direction: 'rtl' }

getDirection('he-IL'); // 'rtl'
matchLocale(['fr-CA', 'fr'], ['en-US', 'fr-FR'], 'en-US'); // 'fr-FR'
```

---

## 3. Native `Intl` Formatters (`@nofinite/locale/format`)

All formatters use bounded internal `LruFormatterCache` instances (`clearFormatterCache()` available for test isolation):

```ts
import {
  formatDate,
  formatDateRange,
  formatCurrency,
  formatRelativeTime,
  formatNumber,
  formatList,
  getPluralCategory,
} from '@nofinite/locale/format';

formatDate('2026-10-01', undefined, 'en-US');
formatDateRange('2026-10-01', '2026-10-05', undefined, 'en-US');
formatCurrency(4200.5, 'INR', undefined, 'en-IN');
formatRelativeTime(-2, 'day', undefined, 'en-US');
formatNumber(123456.78, undefined, 'en-US');
formatList(['NUICSS', 'NUI', 'Markon'], undefined, 'en-US');
getPluralCategory(2, undefined, 'en-US'); // 'other'
```

---

## 4. Translator Engine (`@nofinite/locale/i18n`)

```ts
import { createTranslator, type Translator } from '@nofinite/locale/i18n';

const translator: Translator = createTranslator({
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages: {
    'en-US': { greeting: 'Welcome, {name}' },
  },
});

translator.t('greeting', { name: 'Aria' });
```
