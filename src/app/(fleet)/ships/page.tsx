import { ShipsTable } from '@/components/ships'
import { db } from '@/lib/db'

export default async function ShipsPage() {
  const ships = await db.ship.findMany({
    orderBy: { registry: 'asc' }
  })

  return (
    <div className='p-8 space-y-6'>
      <h1 className='text-3xl font-bold'>Starfleet Ships</h1>

      <ShipsTable ships={ships} />
    </div>
  )
}
