import { fn } from 'storybook/test'
import type { ShipCreateInput } from '@/prisma/models'

export const createShip = fn(async (_data: ShipCreateInput) => {
  await new Promise((resolve) => setTimeout(resolve, 500))
})
