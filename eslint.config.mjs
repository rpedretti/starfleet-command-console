import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import parser from '@typescript-eslint/parser'
import tseslint from 'typescript-eslint'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  tseslint.configs.recommendedTypeChecked,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    '**/generated/**'
  ]),
  {
    languageOptions: {
      parser,
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/switch-exhaustiveness-check': 'error'
    }
  }
])

export default eslintConfig
