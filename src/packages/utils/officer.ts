import type { Officer } from '@/prisma/client'
import { OfficerRank } from '@/prisma/enums'

export function officerRankLabel(rank: OfficerRank) {
  switch (rank) {
    case OfficerRank.ENSIGN:
      return 'Ensign'
    case OfficerRank.LIEUTENANT:
      return 'Lieutenant'
    case OfficerRank.LIEUTENANT_COMMANDER:
      return 'Lieutenant Commander'
    case OfficerRank.COMMANDER:
      return 'Commander'
    case OfficerRank.CAPTAIN:
      return 'Captain'
    case OfficerRank.ADMIRAL:
      return 'Admiral'
  }
}

export function officerNameLabel(
  officer: Pick<Officer, 'firstName' | 'middleName' | 'lastName'>
) {
  const { firstName, middleName, lastName } = officer
  const middleNameInitials = (middleName ?? '')
    .split(' ')
    .map((n) => `${n.charAt(0)}.`)
    .join(' ')

  return [`${lastName},`, firstName, middleNameInitials]
    .filter(Boolean)
    .join(' ')
}
