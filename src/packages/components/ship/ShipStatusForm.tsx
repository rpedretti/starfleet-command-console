'use client'

import * as React from 'react'
import cx from 'classnames'
import { updateShipStatus } from '@/actions/updateShipStatus'
import { ShipStatusSelect } from '../shared'
import type { ShipStatus } from '@/prisma/enums'

interface Props {
  registry: string
  initialStatus: ShipStatus
}

export default function ShipStatusForm({ registry, initialStatus }: Props) {
  const [status, setStatus] = React.useState(initialStatus)
  const [isSaving, setIsSaving] = React.useState(false)

  async function handleSave() {
    setIsSaving(true)
    await updateShipStatus(registry, status)
    setIsSaving(false)
  }

  const isDirty = status !== initialStatus

  return (
    <div className='flex gap-1 items-center'>
      <label className='block font-medium'>Status</label>
      <ShipStatusSelect setStatus={setStatus} status={status} />
      {isDirty && (
        <button
          className={cx('bg-blue-700 text-white px-4 py-2 rounded', {
            'opacity-50 cursor-not-allowed': isSaving,
            'cursor-pointer': !isSaving
          })}
          disabled={isSaving}
          onClick={handleSave}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      )}
    </div>
  )
}
