import React from 'react'
import T from 'prop-types'

import './Input.css'

export const Input = React.forwardRef(({ value, onChange, ...rest }, ref) => (
  <input
    ref={ref}
    type="text"
    value={value}
    onChange={onChange}
    className="input"
    {...rest}
  />
))

Input.displayName = 'Input'

Input.defaultProps = {
  value: '',
}

Input.propTypes = {
  value: T.string,
  onChange: T.func.isRequired,
}
