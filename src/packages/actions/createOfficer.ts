'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import type { OfficerCreateInput } from '@/prisma/models'

export async function createOfficer(data: OfficerCreateInput) {
  await db.officer.create({
    data
  })

  // Revalidate the /officers page so the new officer shows immediately
  revalidatePath('/officers')
}
