import { matchedValue, autoFillCharacters } from './match'

describe('Match', () => {
  describe(matchedValue.name, () => {
    const createOptions = (options = {}) => ({
      autoCharacters: [],
      reverse: false,
      ...options,
    })

    it("should not match if value doesn't match", () => {
      const [match, value] = matchedValue(
        createOptions({
          mask: /^\d{2}$/,
          value: 'AB',
          validExample: '00',
        }),
      )

      expect(match).toBeFalsy()
      expect(value).toBe('AB')
    })

    it('should be able to partially match a string', () => {
      const [match, value] = matchedValue(
        createOptions({
          mask: /^\d{2}$/,
          value: '0',
          validExample: '00',
        }),
      )

      expect(match).toBeTruthy()
      expect(value).toBe('0')
    })

    it('should not match if value exceeds the regex', () => {
      const [match, value] = matchedValue(
        createOptions({
          mask: /^\d{2}$/,
          value: '0000',
          validExample: '00',
        }),
      )

      expect(match).toBeFalsy()
      expect(value).toBe('0000')
    })

    it('should autofill characters if it is not in reverse mode', () => {
      const [match, value] = matchedValue(
        createOptions({
          autoCharacters: ['/'],
          mask: /^\d\/\d{2}$/,
          value: '0',
          validExample: '0/00',
        }),
      )

      expect(match).toBeTruthy()
      expect(value).toBe('0/')
    })

    it('should not autofill characters if it is in reverse mode', () => {
      const [match, value] = matchedValue(
        createOptions({
          autoCharacters: ['/'],
          reverse: true,
          mask: /^\d\/\d{2}$/,
          value: '0',
          validExample: '0/00',
        }),
      )

      expect(match).toBeTruthy()
      expect(value).toBe('0')
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
