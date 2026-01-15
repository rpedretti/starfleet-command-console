import { describe, expect, it, vi, beforeEach } from 'vitest'
import { updateShipStatus } from './updateShipStatus'
import { revalidatePath } from 'next/cache'
import { ShipStatus, StarFleetShipClass } from '@/prisma/enums'
import { db } from '@/lib/db'

vi.mock('@/lib/db', () => ({
  db: {
    ship: {
      update: vi.fn()
    }
  }
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

describe('updateShipStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should update ship status to ACTIVE', async () => {
    const mockUpdatedShip = {
      id: 'ship-123',
      registry: 'NCC-1701',
      name: 'USS Enterprise',
      class: StarFleetShipClass.CONSTITUTION,
      status: ShipStatus.ACTIVE,
      createdAt: new Date()
    }

    vi.mocked(db.ship.update).mockResolvedValue(mockUpdatedShip)

    await updateShipStatus('NCC-1701', ShipStatus.ACTIVE)

    expect(db.ship.update).toHaveBeenCalledWith({
      where: { registry: 'NCC-1701' },
      data: { status: ShipStatus.ACTIVE }
    })
    expect(revalidatePath).toHaveBeenCalledWith('/ships/NCC-1701')
    expect(revalidatePath).toHaveBeenCalledWith('/ships')
  })

  it('should update ship status to IN_REPAIR', async () => {
    const mockUpdatedShip = {
      id: 'ship-456',
      registry: 'NCC-1701-D',
      name: 'USS Enterprise',
      class: StarFleetShipClass.GALAXY,
      status: ShipStatus.IN_REPAIR,
      createdAt: new Date()
    }

    vi.mocked(db.ship.update).mockResolvedValue(mockUpdatedShip)

    await updateShipStatus('NCC-1701-D', ShipStatus.IN_REPAIR)

    expect(db.ship.update).toHaveBeenCalledWith({
      where: { registry: 'NCC-1701-D' },
      data: { status: ShipStatus.IN_REPAIR }
    })
    expect(revalidatePath).toHaveBeenCalledWith('/ships/NCC-1701-D')
    expect(revalidatePath).toHaveBeenCalledWith('/ships')
  })

  it('should update ship status to DECOMMISSIONED', async () => {
    const mockUpdatedShip = {
      id: 'ship-789',
      registry: 'NCC-74656',
      name: 'USS Voyager',
      class: StarFleetShipClass.INTREPID,
      status: ShipStatus.DECOMMISSIONED,
      createdAt: new Date()
    }

    vi.mocked(db.ship.update).mockResolvedValue(mockUpdatedShip)

    await updateShipStatus('NCC-74656', ShipStatus.DECOMMISSIONED)

    expect(db.ship.update).toHaveBeenCalledWith({
      where: { registry: 'NCC-74656' },
      data: { status: ShipStatus.DECOMMISSIONED }
    })
    expect(revalidatePath).toHaveBeenCalledWith('/ships/NCC-74656')
    expect(revalidatePath).toHaveBeenCalledWith('/ships')
  })

  it('should update ship status to BUILDING', async () => {
    const mockUpdatedShip = {
      id: 'ship-1001',
      registry: 'NCC-80102',
      name: 'USS Titan',
      class: StarFleetShipClass.LUNA,
      status: ShipStatus.BUILDING,
      createdAt: new Date()
    }

    vi.mocked(db.ship.update).mockResolvedValue(mockUpdatedShip)

    await updateShipStatus('NCC-80102', ShipStatus.BUILDING)

    expect(db.ship.update).toHaveBeenCalledWith({
      where: { registry: 'NCC-80102' },
      data: { status: ShipStatus.BUILDING }
    })
    expect(revalidatePath).toHaveBeenCalledWith('/ships/NCC-80102')
    expect(revalidatePath).toHaveBeenCalledWith('/ships')
  })

  it('should update ship status to DIA', async () => {
    const mockUpdatedShip = {
      id: 'ship-1111',
      registry: 'NCC-1031',
      name: 'USS Discovery',
      class: StarFleetShipClass.AKIRA,
      status: ShipStatus.DIA,
      createdAt: new Date()
    }

    vi.mocked(db.ship.update).mockResolvedValue(mockUpdatedShip)

    await updateShipStatus('NCC-1031', ShipStatus.DIA)

    expect(db.ship.update).toHaveBeenCalledWith({
      where: { registry: 'NCC-1031' },
      data: { status: ShipStatus.DIA }
    })
    expect(revalidatePath).toHaveBeenCalledWith('/ships/NCC-1031')
    expect(revalidatePath).toHaveBeenCalledWith('/ships')
  })

  it('should revalidate both ship detail and ships list pages', async () => {
    const mockUpdatedShip = {
      id: 'ship-123',
      registry: 'NCC-1701',
      name: 'USS Enterprise',
      class: StarFleetShipClass.CONSTITUTION,
      status: ShipStatus.ACTIVE,
      createdAt: new Date()
    }

    vi.mocked(db.ship.update).mockResolvedValue(mockUpdatedShip)

    await updateShipStatus('NCC-1701', ShipStatus.ACTIVE)

    expect(revalidatePath).toHaveBeenCalledTimes(2)
    expect(revalidatePath).toHaveBeenNthCalledWith(1, '/ships/NCC-1701')
    expect(revalidatePath).toHaveBeenNthCalledWith(2, '/ships')
  })

  it('should handle database errors', async () => {
    const dbError = new Error('Ship not found')
    vi.mocked(db.ship.update).mockRejectedValue(dbError)

    await expect(
      updateShipStatus('NCC-9999', ShipStatus.ACTIVE)
    ).rejects.toThrow('Ship not found')

    expect(db.ship.update).toHaveBeenCalledWith({
      where: { registry: 'NCC-9999' },
      data: { status: ShipStatus.ACTIVE }
    })
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('should pass registry and status to database function', async () => {
    const mockUpdatedShip = {
      id: 'ship-2222',
      registry: 'NCC-74205',
      name: 'USS Defiant',
      class: StarFleetShipClass.DEFIANT,
      status: ShipStatus.IN_REPAIR,
      createdAt: new Date()
    }

    vi.mocked(db.ship.update).mockResolvedValue(mockUpdatedShip)

    const registry = 'NCC-74205'
    const status = ShipStatus.IN_REPAIR

    await updateShipStatus(registry, status)

    expect(db.ship.update).toHaveBeenCalledWith({
      where: { registry },
      data: { status }
    })
  })
})
