'use client'

import { useState } from 'react'
import { createShip } from '@/actions/createShip'
import { ShipStatus, StarFleetShipClass } from '@/prisma/enums'
import { ShipStatusSelect } from '@/components/shared'

export function CreateShipForm() {
  const [name, setName] = useState('')
  const [registry, setRegistry] = useState('')
  const [shipClass, setShipClass] = useState<StarFleetShipClass | ''>('')
  const [status, setStatus] = useState<ShipStatus | ''>('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!shipClass || !status) return

    setSaving(true)
    await createShip({ name, registry, class: shipClass, status })

    setSaving(false)
    setName('')
    setRegistry('')
    setShipClass('')
    setStatus('')
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className='space-x-2 space-y-2 flex flex-col sm:flex-row items-start'
    >
      <input
        type='text'
        placeholder='Ship Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
        className='border p-2 rounded'
        required
        disabled={saving}
      />
      <input
        type='text'
        placeholder='Registry'
        value={registry}
        onChange={(e) => setRegistry(e.target.value)}
        className='border p-2 rounded'
        required
        disabled={saving}
      />
      <select
        value={shipClass}
        onChange={(e) => setShipClass(e.target.value as StarFleetShipClass)}
        className='border p-2 rounded capitalize'
        required
        disabled={saving}
      >
        <option value='' disabled>
          Select Class
        </option>
        {Object.values(StarFleetShipClass).map((shipClassOption) => (
          <option key={shipClassOption} value={shipClassOption}>
            {shipClassOption.toLowerCase()}
          </option>
        ))}
      </select>
      <ShipStatusSelect setStatus={setStatus} status={status} allowEmpty />
      <button
        type='submit'
        className='bg-blue-700 text-white px-4 py-2 rounded'
        disabled={saving}
      >
        Create Ship
      </button>
    </form>
  )
}
