'use client'

import * as React from 'react'
import { assignOfficerToShip } from '@/actions/assignOfficer'
import type { Officer } from '@/prisma/browser'
import { officerNameLabel } from '@/utils'

interface Props {
  registry: string
  officers: Officer[]
}

export default function AssignOfficerSelect({ registry, officers }: Props) {
  const [selected, setSelected] = React.useState('')
  const [isPending, startTransition] = React.useTransition()

  function handleAssign() {
    if (!selected) return

    startTransition(async () => {
      await assignOfficerToShip(selected, registry)
      setSelected('')
    })
  }

  return (
    <div className='space-y-2 border p-4 rounded'>
      <h3 className='font-semibold'>Assign Officer</h3>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className='border p-2 rounded w-full'
        disabled={isPending}
      >
        <option value=''>Select an officer</option>
        {officers.map((o) => {
          const name = officerNameLabel(o)
          return (
            <option key={o.id} value={o.id}>
              {name} - <span className='capitalize'>{o.rank}</span>
            </option>
          )
        })}
      </select>

      <button
        onClick={handleAssign}
        disabled={!selected || isPending}
        className='bg-blue-700 text-white px-3 py-1 rounded'
      >
        {isPending ? 'Assigning…' : 'Assign'}
      </button>
    </div>
  )
}
