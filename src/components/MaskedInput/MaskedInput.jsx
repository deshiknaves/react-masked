import React, { useState, useEffect, useRef, memo } from 'react'
import T from 'prop-types'
import './MaskedInput.css'
import { matchedValue } from '../../match'
import { KEYS } from '../../constants'

const excludedStyles = ['color', '-webkit-text-fill-color']

export const MaskedInput = memo(
  ({
    autoCharacters,
    children,
    mask,
    placeholder,
    placeholderColor,
    validExample,
    onChange,
  }) => {
    const [style, setStyle] = useState({})
    const [value, setValue] = useState('')
    const [remainingPlaceholder, setPlaceholder] = useState(placeholder)
    const inputRef = useRef()
    const placeholderRef = useRef()
    let reverse = false

    useEffect(() => {
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
      target.style.setProperty('left', 0)
      target.style.setProperty('z-index', 0)
      setStyle({ background: 'transparent', position: 'relative', zIndex: 1 })
    }, [])

    const handleOnChange = evt => {
      const { matched, value, complete } = matchedValue({
        autoCharacters,
        value: evt.target.value,
        mask,
        validExample,
        reverse,
      })
      if (!matched) return
      setValue(value)
      setPlaceholder(placeholder.substring(value.length))
      reverse = false
      onChange(value, complete)
    }

    const onKeyDown = evt => {
      if (evt.keyCode !== KEYS.BACKSPACE) return
      reverse = true
    }

    return (
      <div style={{ position: 'relative' }}>
        <div ref={placeholderRef} role="presentation">
          {value}
          <span style={{ color: placeholderColor }}>
            {remainingPlaceholder}
          </span>
        </div>
        {children({
          onKeyDown,
          onChange: handleOnChange,
          value,
          ref: inputRef,
          style,
        })}
      </div>
    )
  },
)

MaskedInput.displayName = 'MaskedInput'

MaskedInput.defaultProps = {
  autoCharacters: [],
  placeholderColor: '#c1c1c1',
  onChange: () => {},
}

MaskedInput.propTypes = {
  autoCharacters: T.arrayOf(T.string),
  children: T.func.isRequired,
  mask: T.object.isRequired,
  placeholder: T.string.isRequired,
  placeholderColor: T.string,
  validExample: T.string.isRequired,
  onChange: T.func,
}
