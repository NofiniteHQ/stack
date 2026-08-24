/* eslint-disable @nx/enforce-module-boundaries */
import React from 'react';
import 'uno.css';
import '../../nuicss/dist/index.css';
import { NUIProvider } from '../src/components/nuiprovider/NUIProvider';

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story: any, context: any) => {
      // Detect if Storybook's background or theme is set to 'dark'
      const isDark = context.globals.theme === 'dark' || 
                     context.globals.backgrounds?.value === '#333333' || 
                     context.globals.backgrounds?.name === 'dark' ||
                     (context.globals.backgrounds?.value && context.globals.backgrounds?.value.toLowerCase() !== '#f8f8f8' && context.globals.backgrounds?.value.toLowerCase() !== '#ffffff');
      
      React.useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
          root.classList.add('dark');
          root.setAttribute('data-theme', 'dark');
        } else {
          root.classList.remove('dark');
          root.setAttribute('data-theme', 'light');
        }
      }, [isDark]);

      // Force NUIProvider to sync with Storybook's background toggle by updating its localStorage key
      window.localStorage.setItem('nui-theme', isDark ? 'dark' : 'light');

      return React.createElement(
        NUIProvider, 
        { defaultTheme: isDark ? 'dark' : 'light', key: isDark ? 'dark' : 'light' }, 
        React.createElement(
          'div',
          { className: 'bg-page text-default min-h-screen p-8 transition-colors duration-300' },
          React.createElement(Story, null)
        )
      );
    }
  ],
};

export default preview;
