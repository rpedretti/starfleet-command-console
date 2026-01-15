import { describe, expect, it, vi, beforeEach } from 'vitest'
import { assignOfficerToShip } from './assignOfficer'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import {
  ShipStatus,
  StarFleetShipClass,
  OfficerRank,
  OfficerRole,
  Race
} from '@/prisma/enums'

vi.mock('@/lib/db', () => ({
  db: {
    ship: {
      findUnique: vi.fn()
    },
    officer: {
      update: vi.fn()
    }
  }
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

describe('assignOfficerToShip', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should assign officer to ship when ship exists', async () => {
    const mockShip = {
      id: 'ship-123',
      registry: 'NCC-1701',
      name: 'USS Enterprise',
      class: StarFleetShipClass.CONSTITUTION,
      status: ShipStatus.ACTIVE,
      createdAt: new Date()
    }

    vi.mocked(db.ship.findUnique).mockResolvedValue(mockShip)
    vi.mocked(db.officer.update).mockResolvedValue({
      id: 'officer-456',
      firstName: 'James',
      middleName: 'T',
      lastName: 'Kirk',
      rank: OfficerRank.CAPTAIN,
      role: OfficerRole.COMMAND,
      race: Race.HUMAN,
      shipId: 'ship-123'
    })

    await assignOfficerToShip('officer-456', 'NCC-1701')

    expect(db.ship.findUnique).toHaveBeenCalledWith({
      where: { registry: 'NCC-1701' }
    })

    expect(db.officer.update).toHaveBeenCalledWith({
      where: { id: 'officer-456' },
      data: { shipId: 'ship-123' }
    })

    expect(revalidatePath).toHaveBeenCalledWith('/ships/NCC-1701')
    expect(revalidatePath).toHaveBeenCalledWith('/ships')
  })

  it('should throw error when ship is not found', async () => {
    vi.mocked(db.ship.findUnique).mockResolvedValue(null)

    await expect(
      assignOfficerToShip('officer-456', 'NCC-9999')
    ).rejects.toThrow('Ship not found')

    expect(db.ship.findUnique).toHaveBeenCalledWith({
      where: { registry: 'NCC-9999' }
    })

    expect(db.officer.update).not.toHaveBeenCalled()
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('should revalidate both ship detail and ships list pages', async () => {
    const mockShip = {
      id: 'ship-123',
      registry: 'NCC-1701-D',
      name: 'USS Enterprise',
      class: StarFleetShipClass.GALAXY,
      status: ShipStatus.ACTIVE,
      createdAt: new Date()
    }

    vi.mocked(db.ship.findUnique).mockResolvedValue(mockShip)
    vi.mocked(db.officer.update).mockResolvedValue({
      id: 'officer-789',
      firstName: 'Jean-Luc',
      middleName: null,
      lastName: 'Picard',
      rank: OfficerRank.CAPTAIN,
      role: OfficerRole.COMMAND,
      race: Race.HUMAN,
      shipId: 'ship-123'
    })

    await assignOfficerToShip('officer-789', 'NCC-1701-D')

    expect(revalidatePath).toHaveBeenCalledTimes(2)
    expect(revalidatePath).toHaveBeenNthCalledWith(1, '/ships/NCC-1701-D')
    expect(revalidatePath).toHaveBeenNthCalledWith(2, '/ships')
  })
})
