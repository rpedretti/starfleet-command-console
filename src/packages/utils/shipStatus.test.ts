import { describe, expect, it } from 'vitest'
import { statusLabel } from './shipStatus'
import { ShipStatus } from '@/prisma/enums'

describe('statusLabel', () => {
  it('should return "Building" for BUILDING status', () => {
    expect(statusLabel(ShipStatus.BUILDING)).toBe('Building')
  })

  it('should return "Active" for ACTIVE status', () => {
    expect(statusLabel(ShipStatus.ACTIVE)).toBe('Active')
  })

  it('should return "In Repair" for IN_REPAIR status', () => {
    expect(statusLabel(ShipStatus.IN_REPAIR)).toBe('In Repair')
  })

  it('should return "Decommissioned" for DECOMMISSIONED status', () => {
    expect(statusLabel(ShipStatus.DECOMMISSIONED)).toBe('Decommissioned')
  })

  it('should return "DIA" for DIA status', () => {
    expect(statusLabel(ShipStatus.DIA)).toBe('DIA')
  })

  it('should handle all ShipStatus enum values', () => {
    const statuses = [
      { enum: ShipStatus.BUILDING, label: 'Building' },
      { enum: ShipStatus.ACTIVE, label: 'Active' },
      { enum: ShipStatus.IN_REPAIR, label: 'In Repair' },
      { enum: ShipStatus.DECOMMISSIONED, label: 'Decommissioned' },
      { enum: ShipStatus.DIA, label: 'DIA' }
    ]

    statuses.forEach(({ enum: status, label }) => {
      expect(statusLabel(status)).toBe(label)
    })
  })
})
