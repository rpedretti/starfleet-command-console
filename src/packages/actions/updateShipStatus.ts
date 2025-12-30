'use server'

import { updateShipStatus as updateShipStatusDb } from '@/lib/db'
import type { ShipStatus } from '@/prisma/enums'
import { revalidatePath } from 'next/cache'

export async function updateShipStatus(registry: string, status: ShipStatus) {
  await updateShipStatusDb(registry, status)

  // Revalidate the ship detail page
  revalidatePath(`/ships/${registry}`)
  // Revalidate ships list (status appears there too)
  revalidatePath('/ships')
}
