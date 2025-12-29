import { Officer } from '@/prisma/client'
import { officerNameLabel, officerRankLabel } from '@/utils'

export interface OfficersTableProps {
  officers: ReadonlyArray<Officer>
}

function OfficerRow({ officer }: { officer: Officer }) {
  const { race, rank } = officer
  const name = officerNameLabel(officer)

  return (
    <tr>
      <td className='border p-2'>{name}</td>
      <td className='border p-2 capitalize'>{race.toLowerCase()}</td>
      <td className='border p-2'>{officerRankLabel(rank)}</td>
    </tr>
  )
}

export function OfficersTable({ officers }: OfficersTableProps) {
  return (
    <table className='w-full border-collapse'>
      <thead>
        <tr>
          <th className='border p-2 text-left'>Name</th>
          <th className='border p-2 text-left'>Race</th>
          <th className='border p-2 text-left'>Rank</th>
        </tr>
      </thead>
      <tbody>
        {officers.map((officer) => (
          <OfficerRow key={officer.id} officer={officer} />
        ))}
      </tbody>
    </table>
  )
}
