import { Rule } from '../types';

export const animationRules: Rule[] = [
  // Keyframes will be generated separately if needed, but standard animations can just be defined as raw CSS
  { pattern: /^animate-none$/, generator: () => 'animation: none;' },
  { pattern: /^animate-spin$/, generator: () => 'animation: spin 1s linear infinite;\n@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }' },
  { pattern: /^animate-ping$/, generator: () => 'animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;\n@keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }' },
  { pattern: /^animate-pulse$/, generator: () => 'animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n@keyframes pulse { 50% { opacity: .5; } }' },
  { pattern: /^animate-bounce$/, generator: () => 'animation: bounce 1s infinite;\n@keyframes bounce { 0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); } 50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); } }' },
  { pattern: /^animate-fade-in$/, generator: () => 'animation: fadeIn 0.3s ease-out forwards;\n@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }' },
  { pattern: /^animate-fade-out$/, generator: () => 'animation: fadeOut 0.3s ease-in forwards;\n@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }' },
  { pattern: /^animate-zoom-in$/, generator: () => 'animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;\n@keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }' },
  { pattern: /^animate-zoom-out$/, generator: () => 'animation: zoomOut 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;\n@keyframes zoomOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.95); } }' },
  { pattern: /^animate-slide-up$/, generator: () => 'animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;\n@keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }' },
  { pattern: /^animate-slide-down$/, generator: () => 'animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;\n@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }' },

  // Transitions
  { pattern: /^transition-none$/, generator: () => 'transition-property: none;' },
  { pattern: /^transition-all$/, generator: () => 'transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;' },
  { pattern: /^transition$/, generator: () => 'transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;' },
  { pattern: /^transition-colors$/, generator: () => 'transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;' },
  { pattern: /^transition-opacity$/, generator: () => 'transition-property: opacity; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;' },
  { pattern: /^transition-shadow$/, generator: () => 'transition-property: box-shadow; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;' },
  { pattern: /^transition-transform$/, generator: () => 'transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;' },

  // Durations
  { pattern: /^duration-(\d+)$/, generator: ({ match }) => `transition-duration: ${match[1]}ms;` },
  
  // Easing
  { pattern: /^ease-linear$/, generator: () => 'transition-timing-function: linear;' },
  { pattern: /^ease-in$/, generator: () => 'transition-timing-function: cubic-bezier(0.4, 0, 1, 1);' },
  { pattern: /^ease-out$/, generator: () => 'transition-timing-function: cubic-bezier(0, 0, 0.2, 1);' },
  { pattern: /^ease-in-out$/, generator: () => 'transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);' },
];
