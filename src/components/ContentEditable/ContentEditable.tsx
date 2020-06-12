import React, {
  forwardRef,
  useEffect,
  useRef,
  Ref,
  useState,
  KeyboardEvent,
  SyntheticEvent,
} from 'react'

type ContentEditableProps = {
  value?: string
  onChange(value: string): void
  [x: string]: any
}

function useCombinedRefs(...refs: Ref<any>[]) {
  const targetRef = React.useRef(null)

  React.useEffect(() => {
    refs.forEach(ref => {
      if (!ref) return

      if (typeof ref === 'function') {
        ref(targetRef.current)
      } else {
        ;(ref as any).current = targetRef.current
      }
    })
  }, [refs])

  return targetRef
}

export const ContentEditable = forwardRef<HTMLDivElement, ContentEditableProps>(
  ({ value, onChange, ...rest }, ref) => {
    const initialized = useRef(false)
    const innerRef = useRef<HTMLDivElement>()
    const combinedRef = useCombinedRefs(ref, innerRef)
    const [current, setCurrent] = useState('')
    const handleChange = (evt: SyntheticEvent) => {
      const target = evt.target as HTMLDivElement
      evt.preventDefault()
      setCurrent(target.textContent || '')
      onChange(target.textContent || '')
    }

    const onKeyPress = (evt: KeyboardEvent) => {
      if (evt.key === 'Enter') evt.preventDefault()
    }

    useEffect(() => {
      if (!initialized.current) {
        initialized.current = true
        return
      }
      let selection = window.getSelection()
      if (!selection || !innerRef.current) return
      let range = document.createRange()
      range.selectNodeContents(innerRef.current)
      selection.removeAllRanges()
      selection.addRange(range)
      range.deleteContents()

      let node = value
        ? document.createTextNode(value)
        : document.createElement('br')
      range.insertNode(node)
      range.collapse()
    }, [value, current])

    return (
      <div
        ref={combinedRef}
        contentEditable
        onInput={handleChange}
        onKeyPress={onKeyPress}
        {...rest}
      />
    )
  },
)
