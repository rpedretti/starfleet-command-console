import { describe, expect, it, vi } from 'vitest'
import Page, { generateMetadata } from './page'
import { db } from '@/lib/db'

type FindUniqueShipProps = {
  where: { registry: string }
  include: {
    officers: {
      select: {
        id: true
        firstName: true
        middleName: true
        lastName: true
        rank: true
        role: true
      }
    }
  }
}
type FindUniqueShip = typeof db.ship.findUnique<FindUniqueShipProps>

const findUniqueShipMock = vi.mocked<FindUniqueShip>(db.ship.findUnique)
const findManyOfficersMock = vi.mocked(db.officer.findMany)

vi.mock('@/lib/db', () => {
  return {
    db: {
      ship: {
        findUnique: vi.fn()
      },
      officer: {
        findMany: vi.fn()
      }
    }
  }
})

describe('ShipPage', () => {
  it('renders ship details when ship is found', async () => {
    findUniqueShipMock.mockResolvedValue({
      id: '1',
      registry: 'NCC-1701',
      name: 'USS Enterprise',
      class: 'CONSTITUTION',
      status: 'ACTIVE',
      createdAt: new Date(),
      officers: []
    })
    findManyOfficersMock.mockResolvedValue([])

    const props = { params: Promise.resolve({ registry: 'NCC-1701' }) }
    const page = await Page(props)

    expect(page).toBeDefined()
    expect(findUniqueShipMock).toHaveBeenCalledWith({
      where: {
        registry: 'NCC-1701'
      },
      include: {
        officers: {
          select: {
            firstName: true,
            id: true,
            lastName: true,
            middleName: true,
            rank: true,
            role: true
          }
        }
      }
    })
    expect(findManyOfficersMock).toHaveBeenCalledWith({
      where: {
        OR: [
          {
            NOT: {
              shipId: '1'
            }
          },
          {
            shipId: null
          }
        ]
      },
      orderBy: {
        lastName: 'asc'
      }
    })
  })

  it('throws notFound when ship is not found', async () => {
    findUniqueShipMock.mockResolvedValueOnce(null)

    const props = { params: Promise.resolve({ registry: 'NCC-1701' }) }

    await expect(Page(props)).rejects.toThrow()
    expect(findUniqueShipMock).toHaveBeenCalledWith({
      where: {
        registry: 'NCC-1701'
      },
      include: {
        officers: {
          select: {
            firstName: true,
            id: true,
            lastName: true,
            middleName: true,
            rank: true,
            role: true
          }
        }
      }
    })
  })

  it('generates correct metadata', async () => {
    const props = { params: Promise.resolve({ registry: 'NCC-1701' }) }
    const metadata = await generateMetadata(props)

    expect(metadata).toEqual({
      title: 'Starfleet — NCC-1701',
      description: 'Starfleet registry record for NCC-1701'
    })
  })
})
