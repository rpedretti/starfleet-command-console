import { defineMain } from '@storybook/nextjs-vite/node'

export default defineMain({
  stories: ['../src/**/*.stories.tsx'],
  features: {
    experimentalTestSyntax: true,
    experimentalRSC: true
  },
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs'
  ],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {
      nextConfigPath: './next.config.mjs'
    }
  },
  staticDirs: ['../public']
})
