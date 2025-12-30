import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ShipDetails } from '@/components/ship'
import { db } from '@/lib/db'

export const runtime = 'nodejs'

interface ShipPageProps {
  params: Promise<{
    registry: string
  }>
}

export async function generateMetadata({
  params
}: ShipPageProps): Promise<Metadata> {
  const { registry } = await params
  return {
    title: `Starfleet — ${registry}`,
    description: `Starfleet registry record for ${registry}`
  }
}

export default async function ShipPage({ params }: ShipPageProps) {
  const { registry } = await params
  const ship = await db.ship.findUnique({
    where: { registry },
    include: {
      officers: {
        select: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
          rank: true,
          role: true
        }
      }
    }
  })

  const officers = await db.officer.findMany({
    where: { OR: [{ NOT: { shipId: ship?.id } }, { shipId: null }] },
    orderBy: { lastName: 'asc' }
  })

  if (!ship) {
    notFound()
  }

  return <ShipDetails ship={ship} officers={officers} />
}
