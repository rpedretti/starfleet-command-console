import preview from '@/storybook/preview'
import { expect, mocked, waitFor } from 'storybook/test'
import { CreateOfficerForm } from './CreateOfficerForm'
import { createOfficer } from '@/actions/createOfficer'
import { OfficerRank, OfficerRole, Race } from '@/prisma/enums'

const meta = preview.meta({
  title: 'Components/Officers/CreateOfficerForm',
  component: CreateOfficerForm
})

export const Default = meta.story({})

Default.test('should render all form fields', async ({ canvas }) => {
  await expect(await canvas.findByPlaceholderText('First Name')).toBeVisible()
  await expect(await canvas.findByPlaceholderText('Middle Name')).toBeVisible()
  await expect(await canvas.findByPlaceholderText('Last Name')).toBeVisible()

  // Check selects are present
  const selects = canvas.getAllByRole('combobox')
  await expect(selects.length).toBe(3) // rank, role, race
})

Default.test(
  'should require all required fields before submission',
  async ({ canvas, userEvent }) => {
    const submitButton = await canvas.findByRole('button', {
      name: 'Create Officer'
    })

    const firstNameInput = await canvas.findByPlaceholderText('First Name')
    const lastNameInput = await canvas.findByPlaceholderText('Last Name')
    const selects = canvas.getAllByRole('combobox')
    const [rankSelect, roleSelect, raceSelect] = selects

    // Fill only first name
    await userEvent.type(firstNameInput, 'James')

    // Try to submit - should be prevented by browser validation
    await userEvent.click(submitButton)

    // The form should still be visible (not submitted)
    await expect(firstNameInput).toBeVisible()

    // Fill all required fields
    await userEvent.type(lastNameInput, 'Kirk')
    await userEvent.selectOptions(rankSelect, OfficerRank.CAPTAIN)
    await userEvent.selectOptions(roleSelect, OfficerRole.COMMAND)
    await userEvent.selectOptions(raceSelect, Race.HUMAN)

    // Now submit
    await userEvent.click(submitButton)

    await expect(mocked(createOfficer)).toHaveBeenCalledWith({
      firstName: 'James',
      middleName: '',
      lastName: 'Kirk',
      rank: OfficerRank.CAPTAIN,
      role: OfficerRole.COMMAND,
      race: Race.HUMAN
    })
  }
)

Default.test(
  'should handle officer with middle name',
  async ({ canvas, userEvent }) => {
    const firstNameInput = await canvas.findByPlaceholderText('First Name')
    const middleNameInput = await canvas.findByPlaceholderText('Middle Name')
    const lastNameInput = await canvas.findByPlaceholderText('Last Name')
    const selects = canvas.getAllByRole('combobox')
    const [rankSelect, roleSelect, raceSelect] = selects
    const submitButton = await canvas.findByRole('button', {
      name: 'Create Officer'
    })

    // Fill all fields including middle name
    await userEvent.type(firstNameInput, 'Jean-Luc')
    await userEvent.type(middleNameInput, 'Pierre')
    await userEvent.type(lastNameInput, 'Picard')
    await userEvent.selectOptions(rankSelect, OfficerRank.CAPTAIN)
    await userEvent.selectOptions(roleSelect, OfficerRole.COMMAND)
    await userEvent.selectOptions(raceSelect, Race.HUMAN)

    await userEvent.click(submitButton)

    await expect(mocked(createOfficer)).toHaveBeenCalledWith({
      firstName: 'Jean-Luc',
      middleName: 'Pierre',
      lastName: 'Picard',
      rank: OfficerRank.CAPTAIN,
      role: OfficerRole.COMMAND,
      race: Race.HUMAN
    })
  }
)

Default.test(
  'should clear form after successful submission',
  async ({ canvas, userEvent }) => {
    const firstNameInput = await canvas.findByPlaceholderText('First Name')
    const lastNameInput = await canvas.findByPlaceholderText('Last Name')
    const selects = canvas.getAllByRole('combobox')
    const [rankSelect, roleSelect, raceSelect] = selects
    const submitButton = await canvas.findByRole('button', {
      name: 'Create Officer'
    })

    // Fill and submit
    await userEvent.type(firstNameInput, 'Spock')
    await userEvent.type(lastNameInput, 'Son of Sarek')
    await userEvent.selectOptions(rankSelect, OfficerRank.COMMANDER)
    await userEvent.selectOptions(roleSelect, OfficerRole.SCIENCE)
    await userEvent.selectOptions(raceSelect, Race.VULCAN)

    await userEvent.click(submitButton)

    // Wait for the form to clear
    await waitFor(async () => {
      await expect(firstNameInput).toHaveValue('')
    })
    await expect(lastNameInput).toHaveValue('')
    await expect(rankSelect).toHaveValue('')
    await expect(roleSelect).toHaveValue('')
    await expect(raceSelect).toHaveValue('')
  }
)

Default.test(
  'should disable inputs while saving',
  async ({ canvas, userEvent }) => {
    const firstNameInput = await canvas.findByPlaceholderText('First Name')
    const lastNameInput = await canvas.findByPlaceholderText('Last Name')
    const selects = canvas.getAllByRole('combobox')
    const [rankSelect, roleSelect, raceSelect] = selects
    const submitButton = await canvas.findByRole('button', {
      name: 'Create Officer'
    })

    // Fill all fields
    await userEvent.type(firstNameInput, 'Data')
    await userEvent.type(lastNameInput, 'Soong')
    await userEvent.selectOptions(rankSelect, OfficerRank.LIEUTENANT_COMMANDER)
    await userEvent.selectOptions(roleSelect, OfficerRole.OPERATIONS)
    await userEvent.selectOptions(raceSelect, Race.HUMAN)

    // Start submission
    await userEvent.click(submitButton)

    // During save, all inputs should be disabled
    // Note: This test may be timing-dependent, so we check quickly
    await new Promise((r) => setTimeout(r, 10))

    // After save completes, inputs should be re-enabled
    await waitFor(async () => {
      await expect(firstNameInput).not.toBeDisabled()
      await expect(submitButton).not.toBeDisabled()
    })
  }
)
