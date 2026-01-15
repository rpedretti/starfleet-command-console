import { ShipStatus } from '@/prisma/enums'
import { statusLabel } from '@/utils'

interface ShipRequiredStatusSelectProps {
  allowEmpty?: false
  status: ShipStatus
  setStatus: (status: ShipStatus) => void
}

interface ShipOptionalStatusSelectProps {
  allowEmpty: true
  status: ShipStatus | ''
  setStatus: (status: ShipStatus | '') => void
}

export type ShipStatusSelectProps =
  | ShipRequiredStatusSelectProps
  | ShipOptionalStatusSelectProps

export function ShipStatusSelect({
  allowEmpty,
  status,
  setStatus
}: ShipStatusSelectProps) {
  return (
    <select
      name='Ship status'
      aria-label='Ship status'
      value={status}
      onChange={(e) => setStatus(e.target.value as ShipStatus)}
      className='select w-min capitalize'
      required
    >
      {allowEmpty && (
        <option value='' disabled>
          Select Status
        </option>
      )}
      {Object.values(ShipStatus).map((statusOption) => (
        <option key={statusOption} value={statusOption}>
          {statusLabel(statusOption)}
        </option>
      ))}
    </select>
  )
}
