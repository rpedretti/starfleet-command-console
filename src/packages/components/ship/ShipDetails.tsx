import Link from 'next/link'
import ShipStatusForm from './ShipStatusForm'
import type { Officer, Ship } from '@/prisma/client'
import { officerNameLabel } from '@/utils'
import AssignOfficerSelect from './AssignOfficerSelect'
import { UnassignOfficerButton } from './UnassignOfficerButton'

interface ShipDetailsProps {
  ship: Ship & {
    officers: Pick<
      Officer,
      'id' | 'firstName' | 'middleName' | 'lastName' | 'rank' | 'role'
    >[]
  }
  officers: Officer[]
}
export function ShipDetails({ ship, officers }: Readonly<ShipDetailsProps>) {
  return (
    <div className='p-8 space-y-4'>
      <div className='flex items-center gap-4'>
        <div className='rounded-full w-8 h-8 bg-gray-600 flex items-center justify-center pb-1 transition-colors hover:bg-gray-500 group'>
          <Link
            href={'/ships'}
            replace
            className='text-2xl group-hover:text-gray-800 '
            aria-label='Go back'
          >
            ←
          </Link>
        </div>
        <h1 className='text-3xl font-bold'>
          {ship.name} <span className='text-gray-500'>({ship.registry})</span>
        </h1>
      </div>

      <div className='space-y-2'>
        <p className='capitalize'>
          <strong>Class:</strong> {ship.class.toLowerCase()}
        </p>
        <ShipStatusForm registry={ship.registry} initialStatus={ship.status} />
        <p>
          <strong>Commissioned:</strong> {ship.createdAt.toDateString()}
        </p>
      </div>
      <div className='space-y-2'>
        <h2 className='text-xl font-semibold'>Assigned Crew</h2>

        {ship.officers.length === 0 && (
          <p className='text-gray-500'>No officers assigned.</p>
        )}

        <ul className='space-y-1'>
          {ship.officers.map((officer) => {
            const name = officerNameLabel(officer)
            return (
              <li key={officer.id} className='border p-2 rounded'>
                <div className='flex justify-between'>
                  <span>
                    {name} - <span className='capitalize'>{officer.rank}</span>
                  </span>
                  <UnassignOfficerButton
                    officerId={officer.id}
                    registry={ship.registry}
                  />
                </div>
              </li>
            )
          })}
        </ul>
        <AssignOfficerSelect registry={ship.registry} officers={officers} />
      </div>
    </div>
  )
}
