import type { Ship } from '@/prisma/client'
import { statusLabel } from '@/utils'
import Link from 'next/link'
import { AddShipButton } from './AddShipButton'

export interface ShipsTableProps {
  ships: Ship[]
}

export function ShipsTable({ ships }: Readonly<ShipsTableProps>) {
  return (
    <div className='flex flex-col gap-2'>
      <AddShipButton />
      <div className='border-base-content w-full overflow-x-auto border rounded-md'>
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Registry</th>
              <th>Class</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {!ships.length && (
              <tr>
                <td colSpan={4} className='text-center'>
                  No ships found.
                </td>
              </tr>
            )}
            {ships.map((ship) => (
              <tr key={ship.id}>
                <td>{ship.name}</td>
                <td>
                  <Link className='link' href={`/ships/${ship.registry}`}>
                    {ship.registry}
                  </Link>
                </td>
                <td className='capitalize'>{ship.class.toLowerCase()}</td>
                <td>{statusLabel(ship.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
