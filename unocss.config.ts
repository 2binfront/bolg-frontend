// uno.config.ts
import { defineConfig, presetAttributify, presetIcons, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss';
import { readFile } from 'node:fs/promises';
export default defineConfig({
  // ...UnoCSS options
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  //   preflights: [
  //     {
  //       getCSS: () => readFile('./node_modules/@unocss/reset/tailwind.css', 'utf-8'),
  //       layer: 'preflights',
  //     },
  //   ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  shortcuts: {
    frc: 'flex items-center justify-center',
    frb: 'flex items-center justify-between',
    fcc: 'flex flex-col items-center justify-center',
    full: 'w-full h-full',
    cp: 'cursor-pointer',
    'f-col': 'flex flex-col',
  },
  rules: [
    ['round', { 'border-radius': '50%' }],
    ['btn', { 'background-color': '#41DBAA', padding: '5px 10px', color: '#000' }],
    [
      'btn-l',
      {
        'background-color': '#ffffff',
        padding: '5px 10px',
        color: '#232425',
      },
    ],
  ],
});
