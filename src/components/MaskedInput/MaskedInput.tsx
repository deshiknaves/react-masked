import React, {
  useState,
  useEffect,
  useRef,
  MutableRefObject,
  ReactNode,
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  FormEvent,
} from 'react'
import T from 'prop-types'
import { matchedValue, autoFillCharacters } from '../../match'
import { KEYS } from '../../constants'

const excludedStyles = ['color', '-webkit-text-fill-color']

type MaskedInputProps = {
  autoCharacters: string[]
  children(props: {
    onKeyDown(evt: KeyboardEvent): void
    onPaste(evt: ClipboardEvent): void
    onChange(evt: ChangeEvent<any> | FormEvent<any>): void
    value: string
    ref: MutableRefObject<any>
    style: any
  }): ReactNode
  mask: RegExp
  placeholder: string
  placeholderColor: string
  validExample: string
  onChange(value: string, complete: boolean): void
  onMatch(object: {
    value: string
    mask: RegExp
    remaining: string
    lastKey: string
  }): {
    matched: boolean
    complete: boolean
    changed?: boolean
    value: string
    remaining?: string
  }
}

export const MaskedInput = ({
  autoCharacters,
  children,
  mask,
  placeholder,
  placeholderColor,
  validExample,
  onChange,
  onMatch,
}: MaskedInputProps) => {
  const [style, setStyle] = useState({})
  const [value, setValue] = useState('')
  const [remainingPlaceholder, setPlaceholder] = useState(placeholder)
  const inputRef = useRef<any>(null)
  const placeholderRef = useRef<HTMLDivElement>(null)
  let reverse = false

  useEffect(() => {
    if (!inputRef.current || !placeholderRef.current) return
    const styles = getComputedStyle(inputRef.current)
    const target = placeholderRef.current
    Array.from(styles).forEach(key => {
      if (excludedStyles.includes(key)) return
      target.style.setProperty(
        key,
        styles.getPropertyValue(key),
        styles.getPropertyPriority(key),
      )
    })
    target.style.setProperty('position', 'absolute')
    target.style.setProperty('left', '0')
    target.style.setProperty('z-index', '0')
    setStyle({ background: 'transparent', position: 'relative', zIndex: 1 })
  }, [])

  useEffect(() => {
    // When placeholder and mask have changed, auto add characters
    let current = value
    const remaining = validExample.substring(current.length)
    current += autoFillCharacters({
      autoCharacters,
      remaining,
    })
    setValue(current)
    setPlaceholder(placeholder.substring(current.length))
  }, [placeholder, mask])

  const handleOnPaste = (evt: ClipboardEvent) => {
    evt.preventDefault()
    const data = evt.clipboardData?.getData('Text')
    if (!data) return
    const keys = data.split('')
    let inserted = true
    const iterator = keys[Symbol.iterator]()
    let next = iterator.next()
    let current = value
    while (!next.done && inserted) {
      current += next.value
      inserted = insertCharacter(current, value)
      next = iterator.next()
    }
  }

  const handleOnChange = (evt: ChangeEvent) => {
    const target = evt.target as HTMLInputElement | HTMLTextAreaElement
    let current = target.value
    const lastKey = current.substring(current.length - 1)
    const isAutoFillable = autoCharacters.includes(lastKey)

    // Add any keys that can be auto filled
    // then add the last key
    if (!isAutoFillable && !reverse) {
      const add = autoFillCharacters({
        autoCharacters,
        remaining: validExample.substring(value.length),
      })
      current = `${value}${add}${lastKey}`
    }

    insertCharacter(current, lastKey)
  }

  const insertCharacter = (value: string, lastKey: string, paste = false) => {
    let current = value
    // Check if it matches
    const remaining = validExample.substring(current.length)
    const {
      matched,
      complete,
      changed,
      value: updateValue,
      remaining: updatedRemaining,
    } = onMatch({
      value: current,
      mask,
      remaining,
      lastKey,
    })

    if (!matched) return false

    current = updateValue || current
    if (matched && !reverse && !changed && !paste) {
      // Get next character(s)
      current += autoFillCharacters({
        autoCharacters,
        remaining: updatedRemaining || remaining,
      })
    }

    setValue(current)
    setPlaceholder(placeholder.substring(current.length))
    reverse = false
    onChange(current, complete)
    return true
  }

  const onKeyDown = (evt: KeyboardEvent) => {
    if (evt.keyCode !== KEYS.BACKSPACE) return
    reverse = true
  }

  return (
    <div style={{ position: 'relative' }}>
      <div ref={placeholderRef} role="presentation">
        {value}
        <span style={{ color: placeholderColor }}>{remainingPlaceholder}</span>
      </div>
      {children({
        onKeyDown,
        onChange: handleOnChange,
        onPaste: handleOnPaste,
        value,
        ref: inputRef,
        style,
      })}
    </div>
  )
}

MaskedInput.displayName = 'MaskedInput'

MaskedInput.defaultProps = {
  autoCharacters: [],
  placeholder: '',
  placeholderColor: '#c1c1c1',
  onChange: () => {},
  onMatch: matchedValue,
}

MaskedInput.propTypes = {
  autoCharacters: T.arrayOf(T.string),
  children: T.func.isRequired,
  mask: T.object.isRequired,
  placeholder: T.string,
  placeholderColor: T.string,
  validExample: T.string.isRequired,
  onChange: T.func,
  onMatch: T.func,
}
