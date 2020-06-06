export const matchedValue = ({
  mask,
  value,
  remaining,
}: {
  mask: RegExp
  value: string
  remaining: string
}) => {
  const matched = mask.test(`${value}${remaining}`)
  const complete = mask.test(value)

  return { matched, complete, value, changed: false, remaining }
}

export const autoFillCharacters = ({
  autoCharacters,
  remaining,
}: {
  autoCharacters: string[]
  remaining: string
}) => {
  let added = ''
  let filled = false
  const characters = remaining.split('')
  const iterator = characters[Symbol.iterator]()
  let next = iterator.next()
  while (!next.done && !filled) {
    const fill = autoCharacters.includes(next.value)
    if (fill) {
      added += next.value
      next = iterator.next()
    }

    filled = !fill
  }

  return added
}
