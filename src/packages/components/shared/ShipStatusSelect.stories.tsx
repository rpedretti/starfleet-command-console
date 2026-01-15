import preview from '@/storybook/preview'
import { expect, waitFor } from 'storybook/test'
import { ShipStatusSelect } from './ShipStatusSelect'
import { ShipStatus } from '@/prisma/enums'
import { useState } from 'react'

const meta = preview.meta({
  title: 'Components/Shared/ShipStatusSelect',
  component: ShipStatusSelect
})

export const Required = meta.story({
  render: () => {
    const [status, setStatus] = useState<ShipStatus>(ShipStatus.ACTIVE)
    return (
      <ShipStatusSelect
        allowEmpty={false}
        status={status}
        setStatus={setStatus}
      />
    )
  }
})

Required.test('should display all status options', async ({ canvas }) => {
  const select = await canvas.findByLabelText('Ship status')
  await expect(select).toBeVisible()

  // Check that all options are present
  const options = select.querySelectorAll('option')
  await expect(options.length).toBe(Object.keys(ShipStatus).length)

  // Verify specific options exist
  await expect(await canvas.findByText('Active')).toBeInTheDocument()
  await expect(await canvas.findByText('Building')).toBeInTheDocument()
  await expect(await canvas.findByText('In Repair')).toBeInTheDocument()
  await expect(await canvas.findByText('Decommissioned')).toBeInTheDocument()
  await expect(await canvas.findByText('DIA')).toBeInTheDocument()
})

Required.test(
  'should change status when selected',
  async ({ canvas, userEvent }) => {
    const select = await canvas.findByLabelText('Ship status')

    // Initial value should be ACTIVE
    await expect(select).toHaveValue('ACTIVE')

    // Change to IN_REPAIR
    await userEvent.selectOptions(select, 'IN_REPAIR')

    await waitFor(async () => {
      await expect(select).toHaveValue('IN_REPAIR')
    })
  }
)

export const AllowEmpty = meta.story({
  render: () => {
    const [status, setStatus] = useState<ShipStatus | ''>('')
    return (
      <ShipStatusSelect
        allowEmpty={true}
        status={status}
        setStatus={setStatus}
      />
    )
  }
})

AllowEmpty.test(
  'should show empty option when allowEmpty is true',
  async ({ canvas }) => {
    const select = await canvas.findByLabelText('Ship status')

    // Should show the placeholder option
    await expect(await canvas.findByText('Select Status')).toBeInTheDocument()

    // Initial value should be empty
    await expect(select).toHaveValue('')
  }
)

AllowEmpty.test(
  'should be able to select a status from empty',
  async ({ canvas, userEvent }) => {
    const select = await canvas.findByLabelText('Ship status')

    // Initial value should be empty
    await expect(select).toHaveValue('')

    // Select a status
    await userEvent.selectOptions(select, 'BUILDING')

    await waitFor(async () => {
      await expect(select).toHaveValue('BUILDING')
    })
  }
)
