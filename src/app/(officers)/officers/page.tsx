import { CreateOfficerForm, OfficersTable } from '@/components/officers'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function OfficersPage() {
  const officers = await db.officer.findMany({
    orderBy: { lastName: 'asc' }
  })

  return (
    <div className='p-8 space-y-6'>
      <h1 className='text-3xl font-bold'>Starfleet Ships</h1>

      <CreateOfficerForm />
      <OfficersTable officers={officers} />
    </div>
  )
}
