import preview from '@/storybook/preview'
import { expect } from 'storybook/test'
import NotFound from './not-found'

const meta = preview.meta({
  title: 'App/(Fleet)/Ships/[Registry]/NotFound',
  component: NotFound
})

export const Default = meta.story({})
Default.test('should render not found state', async ({ canvas }) => {
  await expect(await canvas.findByText('Ship Not Found')).toBeVisible()
})
