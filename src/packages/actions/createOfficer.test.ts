import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createOfficer } from './createOfficer'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import type { OfficerCreateInput } from '@/prisma/models'
import { OfficerRank, OfficerRole, Race } from '@/prisma/enums'

vi.mock('@/lib/db', () => ({
  db: {
    officer: {
      create: vi.fn()
    }
  }
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

describe('createOfficer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a new officer with all fields', async () => {
    const officerData: OfficerCreateInput = {
      firstName: 'James',
      middleName: 'T',
      lastName: 'Kirk',
      rank: OfficerRank.CAPTAIN,
      role: OfficerRole.COMMAND,
      race: Race.HUMAN
    }

    const mockCreatedOfficer = {
      id: 'officer-123',
      firstName: 'James',
      middleName: 'T',
      lastName: 'Kirk',
      rank: OfficerRank.CAPTAIN,
      role: OfficerRole.COMMAND,
      race: Race.HUMAN,
      shipId: null
    }

    vi.mocked(db.officer.create).mockResolvedValue(mockCreatedOfficer)

    await createOfficer(officerData)

    expect(db.officer.create).toHaveBeenCalledWith({
      data: officerData
    })

    expect(revalidatePath).toHaveBeenCalledWith('/officers')
  })

  it('should create officer without middle name', async () => {
    const officerData: OfficerCreateInput = {
      firstName: 'Spock',
      middleName: null,
      lastName: 'Son of Sarek',
      rank: OfficerRank.COMMANDER,
      role: OfficerRole.SCIENCE,
      race: Race.VULCAN
    }

    const mockCreatedOfficer = {
      id: 'officer-456',
      firstName: 'Spock',
      middleName: null,
      lastName: 'Son of Sarek',
      rank: OfficerRank.COMMANDER,
      role: OfficerRole.SCIENCE,
      race: Race.VULCAN,
      shipId: null
    }

    vi.mocked(db.officer.create).mockResolvedValue(mockCreatedOfficer)

    await createOfficer(officerData)

    expect(db.officer.create).toHaveBeenCalledWith({
      data: officerData
    })

    expect(revalidatePath).toHaveBeenCalledWith('/officers')
  })

  it('should revalidate the officers page after creation', async () => {
    const officerData: OfficerCreateInput = {
      firstName: 'Leonard',
      middleName: 'H',
      lastName: 'McCoy',
      rank: OfficerRank.LIEUTENANT_COMMANDER,
      role: OfficerRole.MEDICAL,
      race: Race.HUMAN
    }

    const mockCreatedOfficer = {
      id: 'officer-789',
      firstName: 'Leonard',
      middleName: 'H',
      lastName: 'McCoy',
      rank: OfficerRank.LIEUTENANT_COMMANDER,
      role: OfficerRole.MEDICAL,
      race: Race.HUMAN,
      shipId: null
    }

    vi.mocked(db.officer.create).mockResolvedValue(mockCreatedOfficer)

    await createOfficer(officerData)

    expect(revalidatePath).toHaveBeenCalledTimes(1)
    expect(revalidatePath).toHaveBeenCalledWith('/officers')
  })

  it('should handle database errors', async () => {
    const officerData: OfficerCreateInput = {
      firstName: 'Montgomery',
      middleName: null,
      lastName: 'Scott',
      rank: OfficerRank.LIEUTENANT_COMMANDER,
      role: OfficerRole.ENGINEERING,
      race: Race.HUMAN
    }

    const dbError = new Error('Database connection failed')
    vi.mocked(db.officer.create).mockRejectedValue(dbError)

    await expect(createOfficer(officerData)).rejects.toThrow(
      'Database connection failed'
    )

    expect(db.officer.create).toHaveBeenCalledWith({
      data: officerData
    })

    expect(revalidatePath).not.toHaveBeenCalled()
  })
})
