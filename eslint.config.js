import babelParser from '@babel/eslint-parser'
import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'

export default [
  // js files
  js.configs.recommended,
  // prettier
  prettier,
  // import
  importPlugin.flatConfigs.recommended,
  {
    ignores: ['.config/*', 'node_modules/*', 'dist/*'],
  },

  {
    languageOptions: {
      parser: babelParser,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        requireConfigFile: false,
      },
    },
    rules: {
      'import/no-unresolved': [
        'error',
        {
          ignore: ['\\?raw'],
        },
      ],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'parent', 'sibling', 'index', 'object', 'type'],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
          },
          'newlines-between': 'always',
        },
      ],
    },
  },
]
