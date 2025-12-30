import type { ShipStatus } from '@/prisma/enums'

export function statusLabel(status: ShipStatus) {
  switch (status) {
    case 'BUILDING':
      return 'Building'
    case 'ACTIVE':
      return 'Active'
    case 'IN_REPAIR':
      return 'In Repair'
    case 'DECOMMISSIONED':
      return 'Decommissioned'
    case 'DIA':
      return 'DIA'
    default:
      return status
  }
}
