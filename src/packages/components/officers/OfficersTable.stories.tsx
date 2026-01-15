import preview from '@/storybook/preview'
import { expect } from 'storybook/test'
import { OfficersTable } from './OfficersTable'
import type { Officer } from '@/prisma/client'
import { OfficerRank, OfficerRole, Race } from '@/prisma/enums'

const mockOfficers: Officer[] = [
  {
    id: '1',
    firstName: 'James',
    middleName: 'T',
    lastName: 'Kirk',
    rank: OfficerRank.CAPTAIN,
    role: OfficerRole.COMMAND,
    race: Race.HUMAN,
    shipId: null
  },
  {
    id: '2',
    firstName: 'Spock',
    middleName: null,
    lastName: 'Son of Sarek',
    rank: OfficerRank.COMMANDER,
    role: OfficerRole.SCIENCE,
    race: Race.VULCAN,
    shipId: null
  },
  {
    id: '3',
    firstName: 'Leonard',
    middleName: 'Horatio',
    lastName: 'McCoy',
    rank: OfficerRank.LIEUTENANT_COMMANDER,
    role: OfficerRole.MEDICAL,
    race: Race.HUMAN,
    shipId: null
  },
  {
    id: '4',
    firstName: 'Montgomery',
    middleName: null,
    lastName: 'Scott',
    rank: OfficerRank.LIEUTENANT,
    role: OfficerRole.ENGINEERING,
    race: Race.HUMAN,
    shipId: null
  }
]

const meta = preview.meta({
  title: 'Components/Officers/OfficersTable',
  component: OfficersTable
})

export const WithOfficers = meta.story({
  args: {
    officers: mockOfficers
  }
})

WithOfficers.test(
  'should display all officers in the table',
  async ({ canvas }) => {
    // Check for officer names (formatted as "LastName, FirstName MiddleInitial")
    await expect(await canvas.findByText(/Kirk, James T\./)).toBeVisible()
    await expect(await canvas.findByText(/Son of Sarek, Spock/)).toBeVisible()
    await expect(await canvas.findByText(/McCoy, Leonard H\./)).toBeVisible()
    await expect(await canvas.findByText(/Scott, Montgomery/)).toBeVisible()
  }
)

WithOfficers.test(
  'should display officer races correctly',
  async ({ canvas }) => {
    const humanElements = await canvas.findAllByText('human')
    await expect(humanElements.length).toBe(3) // Kirk, McCoy, and Scott

    await expect(await canvas.findByText('vulcan')).toBeVisible()
  }
)

WithOfficers.test(
  'should display officer ranks correctly',
  async ({ canvas }) => {
    await expect(await canvas.findByText('Captain')).toBeVisible()
    await expect(await canvas.findByText('Commander')).toBeVisible()
    await expect(await canvas.findByText('Lieutenant Commander')).toBeVisible()
    await expect(await canvas.findByText('Lieutenant')).toBeVisible()
  }
)

WithOfficers.test('should have proper table structure', async ({ canvas }) => {
  // Check table headers
  await expect(await canvas.findByText('Name')).toBeVisible()
  await expect(await canvas.findByText('Race')).toBeVisible()
  await expect(await canvas.findByText('Rank')).toBeVisible()

  // Check that we have the correct number of rows (excluding header)
  const rows = canvas.getAllByRole('row')
  await expect(rows.length).toBe(5) // 1 header + 4 data rows
})

export const EmptyOfficers = meta.story({
  args: {
    officers: []
  }
})

EmptyOfficers.test(
  'should render empty table without errors',
  async ({ canvas }) => {
    // Check table headers are still visible
    await expect(await canvas.findByText('Name')).toBeVisible()
    await expect(await canvas.findByText('Race')).toBeVisible()
    await expect(await canvas.findByText('Rank')).toBeVisible()

    // Table should have only header row
    const rows = canvas.getAllByRole('row')
    await expect(rows.length).toBe(1) // just header
  }
)

export const SingleOfficer = meta.story({
  args: {
    officers: [mockOfficers[0]]
  }
})

SingleOfficer.test(
  'should display single officer correctly',
  async ({ canvas }) => {
    await expect(await canvas.findByText(/Kirk, James T\./)).toBeVisible()
    await expect(await canvas.findByText('human')).toBeVisible()
    await expect(await canvas.findByText('Captain')).toBeVisible()

    // Should have 2 rows total (header + 1 data row)
    const rows = canvas.getAllByRole('row')
    await expect(rows.length).toBe(2)
  }
)
