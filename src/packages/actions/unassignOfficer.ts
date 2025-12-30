'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function unassignOfficer(officerId: string, registry: string) {
  await db.officer.update({
    where: { id: officerId },
    data: { shipId: null }
  })

  revalidatePath(`/ships/${registry}`)
}
