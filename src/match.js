export const matchedValue = ({
  autoCharacters,
  mask,
  reverse,
  value,
  validExample,
}) => {
  const remaining = validExample.substring(value.length)
  const matched = mask.test(`${value}${remaining}`)
  const complete = mask.test(value)
  let added = ''

  if (matched && !reverse) {
    // Get next character(s)
    added = autoFillCharacters({ autoCharacters, remaining })
  }

  return { matched, value: `${value}${added}`, complete }
}

export const autoFillCharacters = ({ autoCharacters, remaining }) => {
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
