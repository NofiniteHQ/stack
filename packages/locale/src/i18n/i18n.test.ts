import { describe, it, expect } from 'vitest';
import { createTranslator } from './index';

describe('Translation Engine (createTranslator)', () => {
  const messages = {
    'en-US': {
      common: {
        save: 'Save',
        cancel: 'Cancel',
        nested: {
          deep: {
            leaf: 'Deep Leaf Value',
          },
        },
      },
      welcome: 'Welcome, {name}!',
      summary: '{user} invited {count} members to {org}',
      inbox: {
        messages: {
          one: 'You have {count} new message',
          other: 'You have {count} new messages',
        },
      },
      flat_plural: {
        one: '{count} item',
        other: '{count} items',
      },
      simple_string: 'Simple String',
    },
    'fr-FR': {
      common: {
        save: 'Enregistrer',
      },
      welcome: 'Bienvenue, {name} !',
    },
    'ar-EG': {
      cars: {
        zero: 'لا توجد سيارات',
        one: 'سيارة واحدة',
        two: 'سيارتان',
        few: '{count} سيارات',
        many: '{count} سيارة',
        other: '{count} سيارة',
      },
    },
  };

  it('translates nested key paths', () => {
    const translator = createTranslator({ locale: 'en-US', messages });
    expect(translator.t('common.save')).toBe('Save');
    expect(translator.t('common.cancel')).toBe('Cancel');
    expect(translator.t('common.nested.deep.leaf')).toBe('Deep Leaf Value');
  });

  it('interpolates variables into translation strings', () => {
    const translator = createTranslator({ locale: 'en-US', messages });
    expect(translator.t('welcome', { name: 'Alice' })).toBe('Welcome, Alice!');
  });

  it('interpolates multiple variables including numbers and strings', () => {
    const translator = createTranslator({ locale: 'en-US', messages });
    const result = translator.t('summary', {
      user: 'Charlie',
      count: 42,
      org: 'Engineering',
    });
    expect(result).toBe('Charlie invited 42 members to Engineering');
  });

  it('leaves missing placeholders intact if param not provided', () => {
    const translator = createTranslator({ locale: 'en-US', messages });
    expect(translator.t('welcome', {})).toBe('Welcome, {name}!');
    expect(translator.t('welcome')).toBe('Welcome, {name}!');
  });

  it('supports ICU pluralization rules with object structure', () => {
    const translator = createTranslator({ locale: 'en-US', messages });
    expect(translator.t('inbox.messages', { count: 1 })).toBe(
      'You have 1 new message'
    );
    expect(translator.t('inbox.messages', { count: 5 })).toBe(
      'You have 5 new messages'
    );
  });

  it('supports flat plural keys (key.one / key.other)', () => {
    const translator = createTranslator({ locale: 'en-US', messages });
    expect(translator.t('flat_plural', { count: 1 })).toBe('1 item');
    expect(translator.t('flat_plural', { count: 10 })).toBe('10 items');
  });

  it('supports complex multi-form pluralization (Arabic 6 forms)', () => {
    const translator = createTranslator({ locale: 'ar-EG', messages });
    expect(translator.t('cars', { count: 0 })).toBe('لا توجد سيارات');
    expect(translator.t('cars', { count: 1 })).toBe('سيارة واحدة');
    expect(translator.t('cars', { count: 2 })).toBe('سيارتان');
    expect(translator.t('cars', { count: 3 })).toBe('3 سيارات');
    expect(translator.t('cars', { count: 15 })).toBe('15 سيارة');
    expect(translator.t('cars', { count: 100 })).toBe('100 سيارة');
  });

  it('falls back to fallbackLocale when key is missing in target locale', () => {
    const translator = createTranslator({
      locale: 'fr-FR',
      fallbackLocale: 'en-US',
      messages,
    });
    // Present in fr-FR
    expect(translator.t('common.save')).toBe('Enregistrer');
    // Missing in fr-FR, falls back to en-US
    expect(translator.t('common.cancel')).toBe('Cancel');
    expect(translator.t('simple_string')).toBe('Simple String');
  });

  it('returns key when translation cannot be found', () => {
    const translator = createTranslator({ locale: 'en-US', messages });
    expect(translator.t('missing.key.path')).toBe('missing.key.path');
  });

  it('calls missingKeyHandler when configured', () => {
    const translator = createTranslator({
      locale: 'en-US',
      messages,
      missingKeyHandler: (key, loc) => `[MISSING: ${key} (${loc})]`,
    });
    expect(translator.t('non.existent.key')).toBe(
      '[MISSING: non.existent.key (en-US)]'
    );
  });

  it('dynamically switches locale with setLocale() and adds messages', () => {
    const translator = createTranslator({ locale: 'en-US', messages });
    expect(translator.t('common.save')).toBe('Save');

    translator.setLocale('fr-FR');
    expect(translator.locale).toBe('fr-FR');
    expect(translator.t('common.save')).toBe('Enregistrer');

    translator.addMessages('es-ES', { common: { save: 'Guardar' } });
    translator.setLocale('es-ES');
    expect(translator.t('common.save')).toBe('Guardar');
  });

  it('merges new messages into existing locale without overwriting sibling keys', () => {
    const translator = createTranslator({ locale: 'en-US', messages });
    translator.addMessages('en-US', { common: { delete: 'Delete' } });

    expect(translator.t('common.save')).toBe('Save');
    expect(translator.t('common.delete')).toBe('Delete');
  });

  it('safely handles non-string dictionary leaves (returns key or calls missing handler)', () => {
    const translator = createTranslator({
      locale: 'en-US',
      messages: {
        'en-US': {
          bad_leaf: 12345 as unknown as Record<string, unknown>,
          object_leaf: { a: 1 } as unknown as Record<string, unknown>,
        },
      },
    });

    expect(translator.t('bad_leaf')).toBe('bad_leaf');
    expect(translator.t('object_leaf')).toBe('object_leaf');
  });

  it('resists prototype pollution lookups', () => {
    const translator = createTranslator({ locale: 'en-US', messages });
    expect(translator.t('__proto__')).toBe('__proto__');
    expect(translator.t('constructor.prototype')).toBe('constructor.prototype');
    expect(translator.t('toString')).toBe('toString');
  });

  it('initializes with default options when no parameters are provided', () => {
    const translator = createTranslator();
    expect(translator.locale).toBe('en-US');
    expect(translator.t('random.key')).toBe('random.key');
  });
});
