'use client'

import * as React from 'react'
import { createShip } from '@/actions/createShip'
import { ShipStatus, StarFleetShipClass } from '@/prisma/enums'
import { useModalById } from '@/utils'
import { FormFields } from './FormFields'

interface CreateShipFormProps {
  modalId: string
}

export function CreateShipForm({ modalId }: CreateShipFormProps) {
  const [name, setName] = React.useState('')
  const [registry, setRegistry] = React.useState('')
  const [shipClass, setShipClass] = React.useState<StarFleetShipClass | ''>('')
  const [status, setStatus] = React.useState<ShipStatus | ''>('')
  const [saving, setSaving] = React.useState(false)

  const modalInstance = useModalById(modalId)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!shipClass || !status || !name || !registry) return

    setSaving(true)
    void createShip({ name, registry, class: shipClass, status }).then(() => {
      setSaving(false)
      void modalInstance?.close()
    })
  }

  React.useEffect(() => {
    modalInstance?.on('close', () => {
      setName('')
      setRegistry('')
      setShipClass('')
      setStatus('')
    })
  }, [modalInstance])

  const saveEnabled = Boolean(name && registry && shipClass && status)

  return (
    <form
      onSubmit={handleSubmit}
      className={
        modalId
          ? 'space-y-4 flex flex-col'
          : 'space-x-2 space-y-2 flex flex-col sm:flex-row items-start'
      }
    >
      <FormFields
        name={name}
        setName={setName}
        registry={registry}
        setRegistry={setRegistry}
        shipClass={shipClass}
        setShipClass={setShipClass}
        status={status}
        setStatus={setStatus}
        saving={saving}
        saveEnabled={saveEnabled}
      />
    </form>
  )
}
