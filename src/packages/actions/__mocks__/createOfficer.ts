import { fn } from 'storybook/test'
import type { OfficerCreateInput } from '@/prisma/models'

export const createOfficer = fn(async (_data: OfficerCreateInput) => {
  await new Promise((resolve) => setTimeout(resolve, 500))
})
