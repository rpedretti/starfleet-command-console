import { ShipStatusSelect } from '@/components/shared'
import { ShipStatus, StarFleetShipClass } from '@/prisma/enums'

export interface FormFieldsProps {
  name: string
  setName: (name: string) => void
  registry: string
  setRegistry: (registry: string) => void
  shipClass: StarFleetShipClass | ''
  setShipClass: (shipClass: StarFleetShipClass) => void
  status: ShipStatus | ''
  setStatus: (status: ShipStatus | '') => void
  saving: boolean
  saveEnabled: boolean
}

export function FormFields({
  name,
  setName,
  registry,
  setRegistry,
  shipClass,
  setShipClass,
  status,
  setStatus,
  saving,
  saveEnabled
}: Readonly<FormFieldsProps>) {
  return (
    <>
      <input
        type='text'
        name='Ship name'
        placeholder='Ship Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
        className='input rounded max-w-3xl'
        required
        disabled={saving}
      />
      <input
        type='text'
        name='Ship registry'
        placeholder='Registry'
        value={registry}
        onChange={(e) => setRegistry(e.target.value)}
        className='input rounded max-w-3xl'
        required
        disabled={saving}
      />
      <select
        name='Ship class'
        aria-label='Ship class'
        value={shipClass}
        onChange={(e) => setShipClass(e.target.value as StarFleetShipClass)}
        className='select w-min capitalize'
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
        className='btn btn-primary'
        disabled={saving || !saveEnabled}
      >
        {saving && (
          <>
            <span className='loading loading-spinner loading-sm' />
            Saving...
          </>
        )}
        {!saving && 'Create Ship'}
      </button>
    </>
  )
}
