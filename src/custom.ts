const daysInMonth = (month: number, year: number) => {
  switch (month) {
    case 1:
      return (year % 4 == 0 && year % 100) || year % 400 == 0 ? 29 : 28
    case 8:
    case 3:
    case 5:
    case 10:
      return 30
    default:
      return 31
  }
}

const isValid = (day: number, month: number, year: number) => {
  return month >= 0 && month < 12 && day > 0 && day <= daysInMonth(month, year)
}

export const matchDate = (format = 'mm/dd/yyyy', divider = '/') => ({
  mask,
  value,
  remaining: originalRemaining,
  lastKey,
}: {
  mask: RegExp
  value: string
  remaining: string
  lastKey: string
}) => {
  let start = 0
  let current = value
  const valueParts = current.split(divider).filter(Boolean)
  const formatParts = format
    .split('/')
    .map((i: string) => i.substring(0, 1).toLowerCase())

  if (valueParts.length && valueParts[valueParts.length - 1].length === 1) {
    const last = valueParts.length - 1
    const lastValue = valueParts[last]

    if (lastKey === divider) {
      valueParts[last] = `0${lastValue}${divider}`
      start = 1
    }

    switch (formatParts[last]) {
      case 'm':
        if (lastValue > '1') {
          valueParts[last] = `0${lastValue}`
          start = 1
        }
        break
      case 'd':
        if (valueParts.length > 1) {
          const monthIndex = formatParts.findIndex(i => i === 'm')
          const month = valueParts[monthIndex]
          if (month && month === '02' && lastValue > '2') {
            valueParts[last] = `0${lastValue}`
            start = 1
          }
        } else if (valueParts[last] > '3') {
          valueParts[last] = `0${lastValue}`
          start = 1
        }
        break
      default:
    }
    current = valueParts.join(divider)
  }

  const remaining = originalRemaining.substring(start)
  const date = `${current}${remaining}`
  const dateParts = date.split(divider)

  const { d, m, y }: { y: number; m: number; d: number } = formatParts.reduce(
    (accum: any, key: string, i: number) => {
      accum[key] = parseInt(dateParts[i], 10)
      return accum
    },
    {},
  )

  const matched = isValid(d, m - 1, y) && mask.test(date)
  const complete = mask.test(current)

  return { matched, value: current, complete, changed: false, remaining }
}
