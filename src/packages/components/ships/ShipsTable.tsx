import type { Ship } from '@/prisma/client'
import { statusLabel } from '@/utils'
import Link from 'next/link'

export interface ShipsTableProps {
  ships: Ship[]
}

export function ShipsTable({ ships }: Readonly<ShipsTableProps>) {
  return (
    <table className='w-full border-collapse'>
      <thead>
        <tr>
          <th className='border p-2 text-left'>Name</th>
          <th className='border p-2 text-left'>Registry</th>
          <th className='border p-2 text-left'>Class</th>
          <th className='border p-2 text-left'>Status</th>
        </tr>
      </thead>
      <tbody>
        {ships.map((ship) => (
          <tr key={ship.id}>
            <td className='border p-2'>{ship.name}</td>
            <td className='border p-2'>
              <Link
                className='underline text-blue-600 hover:text-blue-800 visited:text-purple-600'
                href={`/ships/${ship.registry}`}
              >
                {ship.registry}
              </Link>
            </td>
            <td className='border p-2 capitalize'>
              {ship.class.toLowerCase()}
            </td>
            <td className='border p-2'>{statusLabel(ship.status)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
