/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocaleProvider, useLocale, useTranslation } from './LocaleProvider';

describe('LocaleProvider & React Hooks', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('lang');
    document.documentElement.removeAttribute('dir');
  });

  const SampleConsumer: React.FC = () => {
    const {
      locale,
      direction,
      setLocale,
      formatDate,
      formatDateRange,
      formatCurrency,
      formatRelativeTime,
      formatNumber,
      formatList,
      getPluralCategory,
      t,
    } = useLocale();

    const d1 = new Date(2026, 10, 1);
    const d2 = new Date(2026, 10, 5);

    return (
      <div>
        <span data-testid="locale">{locale}</span>
        <span data-testid="direction">{direction}</span>
        <span data-testid="date">
          {formatDate(d1, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <span data-testid="date-range">
          {formatDateRange(d1, d2, { month: 'short', day: 'numeric' })}
        </span>
        <span data-testid="currency">{formatCurrency(19.99, 'USD')}</span>
        <span data-testid="relative">{formatRelativeTime(-2, 'day')}</span>
        <span data-testid="number">{formatNumber(12500)}</span>
        <span data-testid="list">{formatList(['Alpha', 'Beta', 'Gamma'])}</span>
        <span data-testid="plural">{getPluralCategory(1)}</span>
        <span data-testid="greeting">
          {t('common.greeting', { name: 'Alice' })}
        </span>
        <span data-testid="plural-item">{t('items', { count: 3 })}</span>
        <button data-testid="switch-to-ar" onClick={() => setLocale('ar-EG')}>
          Switch to Arabic
        </button>
        <button data-testid="switch-to-fr" onClick={() => setLocale('fr-FR')}>
          Switch to French
        </button>
      </div>
    );
  };

  it('renders with default en-US locale and provides formatters', () => {
    render(
      <LocaleProvider
        messages={{
          'en-US': {
            'common.greeting': 'Hello, {name}!',
            items: {
              one: '1 item',
              other: '{count} items',
            },
          },
        }}
      >
        <SampleConsumer />
      </LocaleProvider>
    );

    expect(screen.getByTestId('locale').textContent).toBe('en-US');
    expect(screen.getByTestId('direction').textContent).toBe('ltr');
    expect(screen.getByTestId('currency').textContent).toBe('$19.99');
    expect(screen.getByTestId('greeting').textContent).toBe('Hello, Alice!');
    expect(screen.getByTestId('plural-item').textContent).toBe('3 items');
    expect(screen.getByTestId('list').textContent).toBe(
      'Alpha, Beta, and Gamma'
    );
    expect(screen.getByTestId('plural').textContent).toBe('one');
  });

  it('switches locale and direction dynamically on setLocale', async () => {
    const user = userEvent.setup();

    render(
      <LocaleProvider
        messages={{
          'en-US': { 'common.greeting': 'Hello, {name}!' },
          'ar-EG': { 'common.greeting': 'مرحبا {name}!' },
        }}
      >
        <SampleConsumer />
      </LocaleProvider>
    );

    expect(screen.getByTestId('locale').textContent).toBe('en-US');
    expect(screen.getByTestId('direction').textContent).toBe('ltr');

    await user.click(screen.getByTestId('switch-to-ar'));

    expect(screen.getByTestId('locale').textContent).toBe('ar-EG');
    expect(screen.getByTestId('direction').textContent).toBe('rtl');
    expect(screen.getByTestId('greeting').textContent).toBe('مرحبا Alice!');
  });

  it('synchronizes HTML lang and dir attributes when syncDom is true', async () => {
    const user = userEvent.setup();

    render(
      <LocaleProvider locale="en-US" syncDom={true}>
        <SampleConsumer />
      </LocaleProvider>
    );

    expect(document.documentElement.getAttribute('lang')).toBe('en-US');
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');

    await user.click(screen.getByTestId('switch-to-ar'));

    expect(document.documentElement.getAttribute('lang')).toBe('ar-EG');
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
  });

  it('respects controlled locale prop update', () => {
    const { rerender } = render(
      <LocaleProvider locale="en-US">
        <SampleConsumer />
      </LocaleProvider>
    );

    expect(screen.getByTestId('locale').textContent).toBe('en-US');
    expect(screen.getByTestId('direction').textContent).toBe('ltr');

    rerender(
      <LocaleProvider locale="he-IL">
        <SampleConsumer />
      </LocaleProvider>
    );

    expect(screen.getByTestId('locale').textContent).toBe('he-IL');
    expect(screen.getByTestId('direction').textContent).toBe('rtl');
  });

  it('supports nested LocaleProvider where child overrides parent', () => {
    render(
      <LocaleProvider locale="en-US">
        <div data-testid="outer-wrapper">
          <LocaleProvider locale="ar-EG">
            <SampleConsumer />
          </LocaleProvider>
        </div>
      </LocaleProvider>
    );

    expect(screen.getByTestId('locale').textContent).toBe('ar-EG');
    expect(screen.getByTestId('direction').textContent).toBe('rtl');
  });

  it('falls back to defaultLocale for missing translation keys', () => {
    render(
      <LocaleProvider
        locale="fr-FR"
        defaultLocale="en-US"
        messages={{
          'en-US': {
            'common.greeting': 'Fallback Greeting, {name}!',
          },
          'fr-FR': {},
        }}
      >
        <SampleConsumer />
      </LocaleProvider>
    );

    expect(screen.getByTestId('greeting').textContent).toBe(
      'Fallback Greeting, Alice!'
    );
  });

  describe('useTranslation hook', () => {
    const TranslationConsumer: React.FC<{ ns?: string }> = ({ ns }) => {
      const { t, locale, direction } = useTranslation(ns);
      return (
        <div>
          <span data-testid="ns-locale">{locale}</span>
          <span data-testid="ns-dir">{direction}</span>
          <span data-testid="ns-msg">{t('welcome', { app: 'Nofinite' })}</span>
          <span data-testid="ns-deep">{t('sub.action')}</span>
          <span data-testid="ns-fallback">{t('missing.key')}</span>
        </div>
      );
    };

    it('works with namespace prefixing and nested sub-keys', () => {
      render(
        <LocaleProvider
          locale="en-US"
          messages={{
            'en-US': {
              auth: {
                welcome: 'Welcome to {app}!',
                sub: {
                  action: 'Click Here',
                },
              },
            },
          }}
        >
          <TranslationConsumer ns="auth" />
        </LocaleProvider>
      );

      expect(screen.getByTestId('ns-msg').textContent).toBe(
        'Welcome to Nofinite!'
      );
      expect(screen.getByTestId('ns-deep').textContent).toBe('Click Here');
      expect(screen.getByTestId('ns-fallback').textContent).toBe(
        'auth.missing.key'
      );
    });

    it('works without namespace', () => {
      render(
        <LocaleProvider
          locale="en-US"
          messages={{
            'en-US': {
              welcome: 'Welcome!',
              'sub.action': 'Direct Sub Action',
            },
          }}
        >
          <TranslationConsumer />
        </LocaleProvider>
      );

      expect(screen.getByTestId('ns-msg').textContent).toBe('Welcome!');
      expect(screen.getByTestId('ns-deep').textContent).toBe(
        'Direct Sub Action'
      );
      expect(screen.getByTestId('ns-fallback').textContent).toBe('missing.key');
    });

    it('reflects updated translation when locale is switched', async () => {
      const user = userEvent.setup();

      const DynamicConsumer = () => {
        const { t, locale } = useTranslation('nav');
        const { setLocale } = useLocale();

        return (
          <div>
            <span data-testid="nav-loc">{locale}</span>
            <span data-testid="nav-home">{t('home')}</span>
            <button data-testid="to-de" onClick={() => setLocale('de-DE')}>
              German
            </button>
          </div>
        );
      };

      render(
        <LocaleProvider
          locale="en-US"
          messages={{
            'en-US': { nav: { home: 'Home' } },
            'de-DE': { nav: { home: 'Startseite' } },
          }}
        >
          <DynamicConsumer />
        </LocaleProvider>
      );

      expect(screen.getByTestId('nav-home').textContent).toBe('Home');

      await user.click(screen.getByTestId('to-de'));

      expect(screen.getByTestId('nav-loc').textContent).toBe('de-DE');
      expect(screen.getByTestId('nav-home').textContent).toBe('Startseite');
    });
  });

  describe('Graceful unprovided fallback', () => {
    const BareConsumer: React.FC = () => {
      const {
        locale,
        direction,
        formatCurrency,
        formatDate,
        formatDateRange,
        formatNumber,
        formatList,
        getPluralCategory,
        t,
      } = useLocale();

      const d = new Date(2026, 0, 1);

      return (
        <div>
          <span data-testid="bare-locale">{locale}</span>
          <span data-testid="bare-dir">{direction}</span>
          <span data-testid="bare-curr">{formatCurrency(42, 'USD')}</span>
          <span data-testid="bare-date">{formatDate(d)}</span>
          <span data-testid="bare-range">{formatDateRange(d, d)}</span>
          <span data-testid="bare-num">{formatNumber(100)}</span>
          <span data-testid="bare-list">{formatList(['X', 'Y'])}</span>
          <span data-testid="bare-plural">{getPluralCategory(2)}</span>
          <span data-testid="bare-t">{t('hello {user}', { user: 'Bob' })}</span>
        </div>
      );
    };

    it('safely provides default values without crashing outside provider', () => {
      render(<BareConsumer />);
      expect(screen.getByTestId('bare-locale').textContent).toBeTruthy();
      expect(screen.getByTestId('bare-dir').textContent).toBe('ltr');
      expect(screen.getByTestId('bare-curr').textContent).toBe('$42.00');
      expect(screen.getByTestId('bare-date').textContent).toContain('2026');
      expect(screen.getByTestId('bare-num').textContent).toBe('100');
      expect(screen.getByTestId('bare-list').textContent).toBe('X and Y');
      expect(screen.getByTestId('bare-t').textContent).toBe('hello Bob');
    });
  });
});
