import preview from '@/storybook/preview'
import { expect } from 'storybook/test'
import Loading from './loading'

const meta = preview.meta({
  title: 'App/(Fleet)/Ships/[Registry]/Loading',
  component: Loading
})

export const Default = meta.story({})

Default.test('should render loading state', async ({ canvas }) => {
  await expect(await canvas.findByText('Loading ship data...')).toBeVisible()
})
