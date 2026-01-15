import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createShip } from './createShip'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import type { ShipCreateInput } from '@/prisma/models'
import { ShipStatus, StarFleetShipClass } from '@/prisma/enums'

vi.mock('@/lib/db', () => ({
  db: {
    ship: {
      create: vi.fn()
    }
  }
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

describe('createShip', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a new ship with all required fields', async () => {
    const shipData: ShipCreateInput = {
      registry: 'NCC-1701',
      name: 'USS Enterprise',
      class: StarFleetShipClass.CONSTITUTION,
      status: ShipStatus.ACTIVE
    }

    const mockCreatedShip = {
      id: 'ship-123',
      registry: 'NCC-1701',
      name: 'USS Enterprise',
      class: StarFleetShipClass.CONSTITUTION,
      status: ShipStatus.ACTIVE,
      createdAt: new Date()
    }

    vi.mocked(db.ship.create).mockResolvedValue(mockCreatedShip)

    await createShip(shipData)

    expect(db.ship.create).toHaveBeenCalledWith({
      data: shipData
    })

    expect(revalidatePath).toHaveBeenCalledWith('/ships')
  })

  it('should create ship with different status', async () => {
    const shipData: ShipCreateInput = {
      registry: 'NCC-1701-D',
      name: 'USS Enterprise',
      class: StarFleetShipClass.GALAXY,
      status: ShipStatus.IN_REPAIR
    }

    const mockCreatedShip = {
      id: 'ship-456',
      registry: 'NCC-1701-D',
      name: 'USS Enterprise',
      class: StarFleetShipClass.GALAXY,
      status: ShipStatus.IN_REPAIR,
      createdAt: new Date()
    }

    vi.mocked(db.ship.create).mockResolvedValue(mockCreatedShip)

    await createShip(shipData)

    expect(db.ship.create).toHaveBeenCalledWith({
      data: shipData
    })

    expect(revalidatePath).toHaveBeenCalledWith('/ships')
  })

  it('should create ship with different class', async () => {
    const shipData: ShipCreateInput = {
      registry: 'NCC-74656',
      name: 'USS Voyager',
      class: StarFleetShipClass.INTREPID,
      status: ShipStatus.ACTIVE
    }

    const mockCreatedShip = {
      id: 'ship-789',
      registry: 'NCC-74656',
      name: 'USS Voyager',
      class: StarFleetShipClass.INTREPID,
      status: ShipStatus.ACTIVE,
      createdAt: new Date()
    }

    vi.mocked(db.ship.create).mockResolvedValue(mockCreatedShip)

    await createShip(shipData)

    expect(db.ship.create).toHaveBeenCalledWith({
      data: shipData
    })

    expect(revalidatePath).toHaveBeenCalledWith('/ships')
  })

  it('should revalidate the ships page after creation', async () => {
    const shipData: ShipCreateInput = {
      registry: 'NCC-1031',
      name: 'USS Discovery',
      class: StarFleetShipClass.AKIRA,
      status: ShipStatus.ACTIVE
    }

    const mockCreatedShip = {
      id: 'ship-1001',
      registry: 'NCC-1031',
      name: 'USS Discovery',
      class: StarFleetShipClass.AKIRA,
      status: ShipStatus.ACTIVE,
      createdAt: new Date()
    }

    vi.mocked(db.ship.create).mockResolvedValue(mockCreatedShip)

    await createShip(shipData)

    expect(revalidatePath).toHaveBeenCalledTimes(1)
    expect(revalidatePath).toHaveBeenCalledWith('/ships')
  })

  it('should handle database errors', async () => {
    const shipData: ShipCreateInput = {
      registry: 'NCC-74205',
      name: 'USS Defiant',
      class: StarFleetShipClass.DEFIANT,
      status: ShipStatus.ACTIVE
    }

    const dbError = new Error('Duplicate registry number')
    vi.mocked(db.ship.create).mockRejectedValue(dbError)

    await expect(createShip(shipData)).rejects.toThrow('Duplicate registry number')

    expect(db.ship.create).toHaveBeenCalledWith({
      data: shipData
    })

    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('should create ship with BUILDING status', async () => {
    const shipData: ShipCreateInput = {
      registry: 'NCC-80102',
      name: 'USS Titan',
      class: StarFleetShipClass.LUNA,
      status: ShipStatus.BUILDING
    }

    const mockCreatedShip = {
      id: 'ship-1111',
      registry: 'NCC-80102',
      name: 'USS Titan',
      class: StarFleetShipClass.LUNA,
      status: ShipStatus.BUILDING,
      createdAt: new Date()
    }

    vi.mocked(db.ship.create).mockResolvedValue(mockCreatedShip)

    await createShip(shipData)

    expect(db.ship.create).toHaveBeenCalledWith({
      data: shipData
    })

    expect(revalidatePath).toHaveBeenCalledWith('/ships')
  })
})
