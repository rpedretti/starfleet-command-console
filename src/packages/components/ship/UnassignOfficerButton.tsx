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
    <button className='link link-error' onClick={handleUnassign}>
      Unassign
    </button>
  )
}
