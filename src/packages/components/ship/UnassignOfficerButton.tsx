'use client'

import type { Officer } from '@/prisma/client'
import { unassignOfficer } from '@/actions/unassignOfficer'

export function UnassignOfficerButton({
  officerId,
  registry
}: {
  officerId: Officer['id']
  registry: string
}) {
  const handleUnassign = () => {
    void unassignOfficer(officerId, registry)
  }
  return (
    <button className='text-red-600 hover:underline' onClick={handleUnassign}>
      Unassign
    </button>
  )
}
