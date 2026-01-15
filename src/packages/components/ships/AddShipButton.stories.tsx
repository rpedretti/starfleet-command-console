import preview from '@/storybook/preview'
import { expect, mocked, waitFor, type UserEventObject } from 'storybook/test'
import { AddShipButton } from './AddShipButton'
import { createShip } from '@/actions/createShip'
import type { Canvas } from 'storybook/internal/types'

const meta = preview.meta({
  title: 'Components/Ships/AddShipButton',
  component: AddShipButton
})

export const Default = meta.story({})

const openModal = async (canvas: Canvas, userEvent: UserEventObject) => {
  await new Promise((r) => setTimeout(r, 100))
  const button = await canvas.findByRole('button', { name: 'Add ship' })
  await userEvent.click(button)
  await waitFor(
    async () =>
      await expect(await canvas.findByText('Add New Ship')).toBeVisible()
  )
  return button
}

Default.test(
  'should open the create ship form when clicked',
  async ({ canvas, userEvent }) => {
    await openModal(canvas, userEvent)
  }
)

Default.test('should require all fields', async ({ canvas, userEvent }) => {
  await openModal(canvas, userEvent)

  const submitButton = await canvas.findByRole('button', {
    name: 'Create Ship'
  })
  await expect(submitButton).toBeDisabled()

  const nameInput = await canvas.findByPlaceholderText('Ship Name')
  const registryInput = await canvas.findByPlaceholderText('Registry')
  const shipClassSelect = await canvas.findByLabelText('Ship class')
  const shipStatusSelect = await canvas.findByLabelText('Ship status')

  // Fill in all fields
  await userEvent.type(nameInput, 'USS Test')
  await expect(submitButton).toBeDisabled()

  await userEvent.type(registryInput, 'NCC-9999')
  await expect(submitButton).toBeDisabled()

  await userEvent.selectOptions(shipClassSelect, 'CONSTELLATION')
  await expect(submitButton).toBeDisabled()

  await userEvent.selectOptions(shipStatusSelect, 'ACTIVE')

  // Now the submit button should be enabled
  await waitFor(async () => await expect(submitButton).toBeEnabled())
})

Default.test(
  'should reset values on modal open',
  async ({ canvas, userEvent }) => {
    const openButton = await openModal(canvas, userEvent)

    const nameInput = await canvas.findByPlaceholderText('Ship Name')
    const registryInput = await canvas.findByPlaceholderText('Registry')
    const shipClassSelect = await canvas.findByLabelText('Ship class')
    const shipStatusSelect = await canvas.findByLabelText('Ship status')

    await userEvent.type(nameInput, 'USS Test')
    await userEvent.type(registryInput, 'NCC-9999')

    await userEvent.selectOptions(shipClassSelect, 'CONSTELLATION')
    await userEvent.selectOptions(shipStatusSelect, 'ACTIVE')

    // Verify values are set
    await expect(nameInput).toHaveValue('USS Test')
    await expect(registryInput).toHaveValue('NCC-9999')
    await expect(shipClassSelect).toHaveValue('CONSTELLATION')
    await expect(shipStatusSelect).toHaveValue('ACTIVE')

    // Close the modal
    const closeButton = await canvas.findByRole('button', { name: 'Close' })
    await userEvent.click(closeButton)

    // Re-open the modal
    await userEvent.click(openButton)

    // Check that the inputs are reset
    await expect(nameInput).toHaveValue('')
    await expect(registryInput).toHaveValue('')
  }
)

Default.test(
  'should create ship with valid data',
  async ({ canvas, userEvent }) => {
    await openModal(canvas, userEvent)

    const nameInput = await canvas.findByPlaceholderText('Ship Name')
    const registryInput = await canvas.findByPlaceholderText('Registry')
    const shipClassSelect = await canvas.findByLabelText('Ship class')
    const shipStatusSelect = await canvas.findByLabelText('Ship status')
    const submitButton = await canvas.findByRole('button', {
      name: 'Create Ship'
    })

    // Fill in all fields
    await userEvent.type(nameInput, 'USS Test')
    await userEvent.type(registryInput, 'NCC-9999')
    await userEvent.selectOptions(shipClassSelect, 'CONSTELLATION')
    await userEvent.selectOptions(shipStatusSelect, 'ACTIVE')

    // Submit the form
    await userEvent.click(submitButton)
    await waitFor(
      async () =>
        await expect(canvas.queryByText('Saving...')).toBeInTheDocument()
    )

    // Wait for the modal to close
    await expect(mocked(createShip)).toHaveBeenCalledWith({
      name: 'USS Test',
      registry: 'NCC-9999',
      class: 'CONSTELLATION',
      status: 'ACTIVE'
    })
  }
)
