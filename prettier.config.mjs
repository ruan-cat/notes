import * as prettierPluginOxc from '@prettier/plugin-oxc'

/** @type {import("prettier").Config} */
const config = {
  'plugins': ['prettier-plugin-lint-md'],
  'overrides': [
    {
      files: '**/*.{js,mjs,cjs,jsx}',
      parser: 'oxc',
      plugins: [prettierPluginOxc],
    },
    {
      files: '**/*.{ts,mts,cts,tsx}',
      parser: 'oxc-ts',
      plugins: [prettierPluginOxc],
    },
  ],
  'printWidth': 120,
  'semi': true,
  'singleQuote': false,
  'jsxSingleQuote': true,
  'useTabs': true,
  'tabWidth': 2,
  'endOfLine': 'auto',
  'space-around-alphabet': true,
  'space-around-number': true,
  'no-empty-code-lang': false,
  'no-empty-code': false,
}

export default config
