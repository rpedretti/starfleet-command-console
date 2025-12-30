'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import type { ShipCreateInput } from '@/prisma/models'

export async function createShip(data: ShipCreateInput) {
  await db.ship.create({
    data
  })

  // Revalidate the /ships page so the new ship shows immediately
  revalidatePath('/ships')
}
