'use client'

import * as React from 'react'
import type { Officer } from '@/prisma/client'
import { OfficerRank, OfficerRole, Race } from '@/prisma/enums'
import { createOfficer } from '@/actions/createOfficer'

export function CreateOfficerForm() {
  const [rank, setRank] = React.useState<Officer['rank'] | ''>('')
  const [firstName, setFirstName] = React.useState('')
  const [middleName, setMiddleName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [role, setRole] = React.useState<Officer['role'] | ''>('')
  const [race, setRace] = React.useState<Officer['race'] | ''>('')
  const [saving, setSaving] = React.useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!rank || !role || !race) return

    setSaving(true)
    await createOfficer({ firstName, lastName, middleName, rank, role, race })

    setSaving(false)
    setFirstName('')
    setMiddleName('')
    setLastName('')
    setRank('')
    setRole('')
    setRace('')
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className='space-x-2 space-y-2 flex flex-col sm:flex-row items-start'
    >
      <input
        type='text'
        name='firstName'
        placeholder='First Name'
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className='border p-2 rounded'
        required
        disabled={saving}
      />
      <input
        type='text'
        name='middleName'
        placeholder='Middle Name'
        value={middleName}
        onChange={(e) => setMiddleName(e.target.value)}
        className='border p-2 rounded'
        disabled={saving}
      />
      <input
        type='text'
        name='lastName'
        placeholder='Last Name'
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className='border p-2 rounded'
        required
        disabled={saving}
      />
      <select
        name='rank'
        aria-label='Rank'
        value={rank}
        onChange={(e) => setRank(e.target.value as Officer['rank'])}
        className='border p-2 rounded capitalize'
        required
        disabled={saving}
      >
        <option value='' disabled>
          Select Rank
        </option>
        {Object.values(OfficerRank).map((rankOption) => (
          <option key={rankOption} value={rankOption}>
            {rankOption.toLowerCase()}
          </option>
        ))}
      </select>
      <select
        name='role'
        aria-label='Role'
        value={role}
        onChange={(e) => setRole(e.target.value as Officer['role'])}
        className='border p-2 rounded capitalize'
        required
        disabled={saving}
      >
        <option value='' disabled>
          Select Role
        </option>
        {Object.values(OfficerRole).map((roleOption) => (
          <option key={roleOption} value={roleOption}>
            {roleOption.toLowerCase()}
          </option>
        ))}
      </select>
      <select
        name='race'
        aria-label='Race'
        value={race}
        onChange={(e) => setRace(e.target.value as Officer['race'])}
        className='border p-2 rounded capitalize'
        required
        disabled={saving}
      >
        <option value='' disabled>
          Select Race
        </option>
        {Object.values(Race).map((raceOption) => (
          <option key={raceOption} value={raceOption}>
            {raceOption.toLowerCase()}
          </option>
        ))}
      </select>
      <button type='submit' className='btn btn-primary' disabled={saving}>
        Create Officer
      </button>
    </form>
  )
}
