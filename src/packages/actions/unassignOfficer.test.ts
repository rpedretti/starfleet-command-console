import { describe, expect, it, vi, beforeEach } from 'vitest'
import { unassignOfficer } from './unassignOfficer'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { OfficerRank, OfficerRole, Race } from '@/prisma/enums'

vi.mock('@/lib/db', () => ({
  db: {
    officer: {
      update: vi.fn()
    }
  }
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

describe('unassignOfficer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should unassign officer from ship', async () => {
    const mockUpdatedOfficer = {
      id: 'officer-123',
      firstName: 'James',
      middleName: 'T',
      lastName: 'Kirk',
      rank: OfficerRank.CAPTAIN,
      role: OfficerRole.COMMAND,
      race: Race.HUMAN,
      shipId: null
    }

    vi.mocked(db.officer.update).mockResolvedValue(mockUpdatedOfficer)

    await unassignOfficer('officer-123', 'NCC-1701')

    expect(db.officer.update).toHaveBeenCalledWith({
      where: { id: 'officer-123' },
      data: { shipId: null }
    })

    expect(revalidatePath).toHaveBeenCalledWith('/ships/NCC-1701')
  })

  it('should revalidate the ship detail page after unassignment', async () => {
    const mockUpdatedOfficer = {
      id: 'officer-456',
      firstName: 'Spock',
      middleName: null,
      lastName: 'Son of Sarek',
      rank: OfficerRank.COMMANDER,
      role: OfficerRole.SCIENCE,
      race: Race.VULCAN,
      shipId: null
    }

    vi.mocked(db.officer.update).mockResolvedValue(mockUpdatedOfficer)

    await unassignOfficer('officer-456', 'NCC-1701-D')

    expect(revalidatePath).toHaveBeenCalledTimes(1)
    expect(revalidatePath).toHaveBeenCalledWith('/ships/NCC-1701-D')
  })

  it('should handle different registry numbers', async () => {
    const mockUpdatedOfficer = {
      id: 'officer-789',
      firstName: 'Benjamin',
      middleName: 'Lafayette',
      lastName: 'Sisko',
      rank: OfficerRank.CAPTAIN,
      role: OfficerRole.COMMAND,
      race: Race.HUMAN,
      shipId: null
    }

    vi.mocked(db.officer.update).mockResolvedValue(mockUpdatedOfficer)

    await unassignOfficer('officer-789', 'NCC-74656')

    expect(db.officer.update).toHaveBeenCalledWith({
      where: { id: 'officer-789' },
      data: { shipId: null }
    })

    expect(revalidatePath).toHaveBeenCalledWith('/ships/NCC-74656')
  })

  it('should handle database errors', async () => {
    const dbError = new Error('Officer not found')
    vi.mocked(db.officer.update).mockRejectedValue(dbError)

    await expect(unassignOfficer('officer-999', 'NCC-1701')).rejects.toThrow(
      'Officer not found'
    )

    expect(db.officer.update).toHaveBeenCalledWith({
      where: { id: 'officer-999' },
      data: { shipId: null }
    })

    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it('should set shipId to null for officer', async () => {
    const mockUpdatedOfficer = {
      id: 'officer-111',
      firstName: 'Kathryn',
      middleName: null,
      lastName: 'Janeway',
      rank: OfficerRank.CAPTAIN,
      role: OfficerRole.COMMAND,
      race: Race.HUMAN,
      shipId: null
    }

    vi.mocked(db.officer.update).mockResolvedValue(mockUpdatedOfficer)

    await unassignOfficer('officer-111', 'NCC-74656')

    const updateCall = vi.mocked(db.officer.update).mock.calls[0][0]
    expect(updateCall.data).toEqual({ shipId: null })
  })
})
