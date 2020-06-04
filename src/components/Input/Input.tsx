import React, { ChangeEvent } from 'react'
import T from 'prop-types'

import './Input.css'

type InputProps = {
  value?: string
  onChange(evt: ChangeEvent<HTMLInputElement>): void
  [x: string]: any
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChange, ...rest }, ref) => (
    <input
      ref={ref}
      type="text"
      value={value}
      onChange={onChange}
      className="input"
      {...rest}
    />
  ),
)

Input.displayName = 'Input'

Input.defaultProps = {
  value: '',
}

Input.propTypes = {
  value: T.string,
  onChange: T.func.isRequired,
}
