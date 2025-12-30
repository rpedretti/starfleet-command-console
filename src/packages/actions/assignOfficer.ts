'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function assignOfficerToShip(officerId: string, registry: string) {
  const ship = await db.ship.findUnique({
    where: { registry }
  })

  if (!ship) {
    throw new Error('Ship not found')
  }

  await db.officer.update({
    where: { id: officerId },
    data: { shipId: ship.id }
  })

  revalidatePath(`/ships/${registry}`)
  revalidatePath('/ships')
}
