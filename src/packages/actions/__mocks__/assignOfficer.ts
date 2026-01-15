import { fn } from 'storybook/test'

export const assignOfficerToShip = fn(
  async (_officerId: string, _registry: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
)
