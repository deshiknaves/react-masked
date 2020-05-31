import { matchedValue, autoFillCharacters } from './match'

describe('Match', () => {
  describe(matchedValue.name, () => {
    it("should not match if value doesn't match", () => {
      const { matched } = matchedValue({
        mask: /^\d{2}$/,
        value: 'AB',
        remaining: '',
      })

      expect(matched).toBeFalsy()
    })

    it('should be able to partially match a string', () => {
      const { matched } = matchedValue({
        mask: /^\d{2}$/,
        value: '0',
        remaining: '0',
      })

      expect(matched).toBeTruthy()
    })

    it('should not match if value exceeds the regex', () => {
      const { matched } = matchedValue({
        mask: /^\d{2}$/,
        value: '0000',
        remaining: '',
      })

      expect(matched).toBeFalsy()
    })
  })

  describe(autoFillCharacters.name, () => {
    it('should be able to add characters that are auto fillable', () => {
      const added = autoFillCharacters({
        autoCharacters: ['/'],
        remaining: '/12',
      })

      expect(added).toEqual('/')
    })

    it('should be able to add more than one characters that are auto fillable', () => {
      const added = autoFillCharacters({
        autoCharacters: ['/'],
        remaining: '//12',
      })

      expect(added).toEqual('//')
    })

    it('should be able to add more than one characters that are different that are auto fillable', () => {
      const added = autoFillCharacters({
        autoCharacters: ['/', '_'],
        remaining: '/_12',
      })

      expect(added).toEqual('/_')
    })

    it('should not auto fill characters if they are not the next character', () => {
      const added = autoFillCharacters({
        autoCharacters: ['/'],
        remaining: '0/12',
      })

      expect(added).toEqual('')
    })
  })
})
