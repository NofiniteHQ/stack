import { generateCSS, generateVariables } from './engine/generator';

interface NuicssWindow extends Window {
  nuicssConfig?: {
    theme?: Record<string, any>;
    components?: Record<string, string[]>;
    prefix?: string;
  };
}

declare const window: NuicssWindow;

let config = { theme: {}, components: {}, prefix: '' };
if (typeof window !== 'undefined' && window.nuicssConfig) {
  config = { ...config, ...window.nuicssConfig };
}

let styleTag: HTMLStyleElement | null = null;
const classSet = new Set<string>();

const updateCSS = () => {
  if (!styleTag && typeof document !== 'undefined') {
    styleTag = document.createElement('style');
    styleTag.id = 'nuicss-cdn';
    document.head.appendChild(styleTag);
  }
  if (styleTag) {
    const css = generateCSS(Array.from(classSet), config);
    const vars = generateVariables(config.theme);
    styleTag.innerHTML = `${vars}\n${css}`;
  }
};

const scanElement = (el: Element) => {
  if (el.className && typeof el.className === 'string') {
    el.className.split(/\s+/).forEach((c: string) => classSet.add(c.trim()));
  }
  el.querySelectorAll('*').forEach((child: Element) => {
    if (child.className && typeof child.className === 'string') {
      child.className.split(/\s+/).forEach((c: string) => classSet.add(c.trim()));
    }
  });
};

if (typeof document !== 'undefined') {
  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    let changed = false;
    mutations.forEach((m: MutationRecord) => {
      if (m.type === 'attributes' && m.attributeName === 'class') {
        const target = m.target as Element;
        if (target.className && typeof target.className === 'string') {
          target.className.split(/\s+/).forEach((c: string) => {
            const trimmed = c.trim();
            if (trimmed && !classSet.has(trimmed)) {
              classSet.add(trimmed);
              changed = true;
            }
          });
        }
      } else if (m.type === 'childList') {
        m.addedNodes.forEach((node: Node) => {
          if (node.nodeType === 1) { // ELEMENT_NODE
            scanElement(node as Element);
            changed = true;
          }
        });
      }
    });
    if (changed) updateCSS();
  });

  const init = () => {
    scanElement(document.body);
    updateCSS();
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
