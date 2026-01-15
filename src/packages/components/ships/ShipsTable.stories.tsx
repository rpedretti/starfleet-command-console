import preview from '@/storybook/preview'
import { expect } from 'storybook/test'
import { ShipsTable } from './ShipsTable'
import type { Ship } from '@/prisma/client'
import { ShipStatus, StarFleetShipClass } from '@/prisma/enums'

const mockShips: Ship[] = [
  {
    id: '1',
    name: 'USS Enterprise',
    registry: 'NCC-1701',
    class: StarFleetShipClass.CONSTITUTION,
    status: ShipStatus.ACTIVE,
    createdAt: new Date('2023-01-01')
  },
  {
    id: '2',
    name: 'USS Defiant',
    registry: 'NX-74205',
    class: StarFleetShipClass.DEFIANT,
    status: ShipStatus.ACTIVE,
    createdAt: new Date('2023-01-02')
  },
  {
    id: '3',
    name: 'USS Voyager',
    registry: 'NCC-74656',
    class: StarFleetShipClass.INTREPID,
    status: ShipStatus.IN_REPAIR,
    createdAt: new Date('2023-01-03')
  }
]

const meta = preview.meta({
  title: 'Components/Ships/ShipsTable',
  component: ShipsTable
})

export const WithShips = meta.story({
  args: {
    ships: mockShips
  }
})

WithShips.test('should display all ships in the table', async ({ canvas }) => {
  await expect(await canvas.findByText('USS Enterprise')).toBeVisible()
  await expect(await canvas.findByText('NCC-1701')).toBeVisible()
  await expect(await canvas.findByText('USS Defiant')).toBeVisible()
  await expect(await canvas.findByText('NX-74205')).toBeVisible()
  await expect(await canvas.findByText('USS Voyager')).toBeVisible()
  await expect(await canvas.findByText('NCC-74656')).toBeVisible()
})

WithShips.test('should display ship statuses correctly', async ({ canvas }) => {
  const activeElements = await canvas.findAllByRole('cell', {
    name: 'Active'
  })
  await expect(activeElements.length).toBe(2)

  await expect(
    await canvas.findByRole('cell', { name: 'In Repair' })
  ).toBeVisible()
})

WithShips.test('should have clickable registry links', async ({ canvas }) => {
  const enterpriseLink = await canvas.findByRole('link', { name: 'NCC-1701' })
  await expect(enterpriseLink).toBeVisible()
  await expect(enterpriseLink).toHaveAttribute('href', '/ships/NCC-1701')

  const defiantLink = await canvas.findByRole('link', { name: 'NX-74205' })
  await expect(defiantLink).toHaveAttribute('href', '/ships/NX-74205')
})

export const EmptyState = meta.story({
  args: {
    ships: []
  }
})

EmptyState.test('should display empty state message', async ({ canvas }) => {
  await expect(await canvas.findByText('No ships found.')).toBeVisible()
})

EmptyState.test(
  'should still show the add ship button when empty',
  async ({ canvas }) => {
    await expect(
      await canvas.findByRole('button', { name: 'Add ship' })
    ).toBeVisible()
  }
)
