import { describe, expect, it } from 'vitest'
import { officerRankLabel, officerNameLabel } from './officer'
import { OfficerRank } from '@/prisma/enums'

describe('officerRankLabel', () => {
  it('should return "Ensign" for ENSIGN rank', () => {
    expect(officerRankLabel(OfficerRank.ENSIGN)).toBe('Ensign')
  })

  it('should return "Lieutenant" for LIEUTENANT rank', () => {
    expect(officerRankLabel(OfficerRank.LIEUTENANT)).toBe('Lieutenant')
  })

  it('should return "Lieutenant Commander" for LIEUTENANT_COMMANDER rank', () => {
    expect(officerRankLabel(OfficerRank.LIEUTENANT_COMMANDER)).toBe(
      'Lieutenant Commander'
    )
  })

  it('should return "Commander" for COMMANDER rank', () => {
    expect(officerRankLabel(OfficerRank.COMMANDER)).toBe('Commander')
  })

  it('should return "Captain" for CAPTAIN rank', () => {
    expect(officerRankLabel(OfficerRank.CAPTAIN)).toBe('Captain')
  })

  it('should return "Admiral" for ADMIRAL rank', () => {
    expect(officerRankLabel(OfficerRank.ADMIRAL)).toBe('Admiral')
  })
})

describe('officerNameLabel', () => {
  it('should format officer name with middle name initial', () => {
    const officer = {
      firstName: 'James',
      middleName: 'Tiberius',
      lastName: 'Kirk'
    }

    expect(officerNameLabel(officer)).toBe('Kirk, James T.')
  })

  it('should format officer name without middle name', () => {
    const officer = {
      firstName: 'Spock',
      middleName: null,
      lastName: 'Son of Sarek'
    }

    expect(officerNameLabel(officer)).toBe('Son of Sarek, Spock')
  })

  it('should handle multiple middle names with initials', () => {
    const officer = {
      firstName: 'Jean-Luc',
      middleName: 'Louis Xavier',
      lastName: 'Picard'
    }

    expect(officerNameLabel(officer)).toBe('Picard, Jean-Luc L. X.')
  })

  it('should handle officer with empty string middle name', () => {
    const officer = {
      firstName: 'Benjamin',
      middleName: '',
      lastName: 'Sisko'
    }

    expect(officerNameLabel(officer)).toBe('Sisko, Benjamin')
  })

  it('should handle officer with single character middle name', () => {
    const officer = {
      firstName: 'Kathryn',
      middleName: 'M',
      lastName: 'Janeway'
    }

    expect(officerNameLabel(officer)).toBe('Janeway, Kathryn M.')
  })

  it('should handle hyphenated last names', () => {
    const officer = {
      firstName: 'Miles',
      middleName: 'Edward',
      lastName: "O'Brien"
    }

    expect(officerNameLabel(officer)).toBe("O'Brien, Miles E.")
  })

  it('should handle officer with middle initial already provided', () => {
    const officer = {
      firstName: 'Leonard',
      middleName: 'H',
      lastName: 'McCoy'
    }

    expect(officerNameLabel(officer)).toBe('McCoy, Leonard H.')
  })

  it('should format name correctly when all name parts are present', () => {
    const officer = {
      firstName: 'Montgomery',
      middleName: 'Christopher Jorgenson',
      lastName: 'Scott'
    }

    expect(officerNameLabel(officer)).toBe('Scott, Montgomery C. J.')
  })

  it('should handle unusual spacing in middle name', () => {
    const officer = {
      firstName: 'Hikaru',
      middleName: 'Kato   Sulu',
      lastName: 'Sulu'
    }

    // Should handle extra spaces
    expect(officerNameLabel(officer)).toBe('Sulu, Hikaru K. S.')
  })

  it('should handle null middle name (same as undefined)', () => {
    const officer = {
      firstName: 'Pavel',
      middleName: null,
      lastName: 'Chekov'
    }

    expect(officerNameLabel(officer)).toBe('Chekov, Pavel')
  })
})
