export interface RuleContext {
  match: RegExpExecArray;
  className: string;
  theme?: Record<string, any>;
}

export type RuleGenerator = (ctx: RuleContext) => string | null;

export interface Rule {
  pattern: RegExp;
  generator: RuleGenerator;
  selectorModifier?: string;
}
