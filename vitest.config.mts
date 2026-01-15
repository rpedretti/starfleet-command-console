import path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig, coverageConfigDefaults } from 'vitest/config'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

function stubNextAssetImport() {
  return {
    name: 'stub-next-asset-import',
    transform(_code: string, id: string) {
      if (/(jpg|jpeg|png|webp|gif|svg)$/.test(id)) {
        const imgSrc = path.relative(process.cwd(), id)
        return {
          code: `export default { src: '${imgSrc}', height: 1, width: 1 }`
        }
      }
    }
  }
}

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  server: {
    fs: {
      allow: ['.storybook']
    }
  },
  plugins: [
    tsconfigPaths({
      projects: ['./tsconfig.json']
    }),
    stubNextAssetImport()
  ],
  test: {
    reporters: [
      'default',
      ['junit', { outputFile: '.build/test-results/junit.xml' }]
    ],
    coverage: {
      ...coverageConfigDefaults,
      reportsDirectory: '.build/coverage-results',
      reporter: ['lcov', 'text-summary', 'cobertura'],
      provider: 'v8',
      include: [
        'src/packages/**/*.ts',
        'src/packages/**/*.tsx',
        'src/app/**/*.ts',
        'src/app/**/*.tsx'
      ],
      exclude: [
        ...coverageConfigDefaults.exclude,
        'src/test/**',
        '**/__mocks__/**',
        '**/*.story.tsx',
        'node_modules',
        '.build/**',
        'vitest.config.ts'
      ]
    },
    testTimeout: 12000,
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest()
        ],
        test: {
          name: 'ui',
          browser: {
            enabled: true,
            headless: true,
            screenshotFailures: true,
            screenshotDirectory: '.build/test-results',
            provider: playwright({}),
            instances: [{ browser: 'chromium' }]
          }
        }
      },
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/**.test.ts', 'src/**/**.test.tsx']
        }
      }
    ]
  }
})
