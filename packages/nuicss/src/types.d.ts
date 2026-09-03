declare module '@unocss/config' {
  export function loadConfig(cwd?: string, configOrPath?: any, extraConfigSources?: any[], defaults?: any): Promise<any>;
}
