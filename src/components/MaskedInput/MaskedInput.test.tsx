import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import user from '@testing-library/user-event'
import { MaskedInput } from './MaskedInput'
import { Input } from '../Input'

describe(MaskedInput.name, () => {
  const mockOnChange = jest.fn()
  const renderComponent = (props = {}) =>
    render(
      <MaskedInput
        autoCharacters={['-']}
        mask={/^\w{2}-\d{3}$/}
        validExample="AA-000"
        placeholder="AA-DDD"
        placeholderColor="#c1c1c1"
        onChange={mockOnChange}
        {...props}
      >
        {({ style, ...maskedProps }) => (
          <Input
            style={{ ...style, border: '1px solid red' }}
            {...maskedProps}
            data-testid="input"
          />
        )}
      </MaskedInput>,
    )

  beforeEach(() => {
    mockOnChange.mockReset()
  })

  it('should be able to copy styles from the passed in component', () => {
    renderComponent()

    const placeholder = screen.getByRole('presentation')
    const input = screen.getByTestId('input')

    expect(placeholder).toHaveStyle({
      border: '1px solid red',
    })
    expect(input).toHaveStyle({
      background: 'transparent',
    })
  })

  it('should be able to add handle changes in the input', () => {
    renderComponent()

    const placeholder = screen.getByRole('presentation')
    const input = screen.getByTestId('input')

    user.type(input, '0')
    expect(placeholder.textContent).toMatchInlineSnapshot(`"0A-DDD"`)
  })

  it('should not be able to type characters that do not match the mask', () => {
    renderComponent({ mask: /^\d{2}$/, placeholder: 'DD', validExample: '00' })

    const placeholder = screen.getByRole('presentation')
    const input = screen.getByTestId('input')

    user.type(input, 'A')
    expect(placeholder.textContent).toMatchInlineSnapshot(`"DD"`)
  })

  it('should be able to auto add characters', () => {
    renderComponent()

    const placeholder = screen.getByRole('presentation')
    const input = screen.getByTestId('input')

    user.type(input, '00')
    expect(placeholder.childNodes[0].textContent).toMatchInlineSnapshot(`"00-"`)
    expect(placeholder.textContent).toMatchInlineSnapshot(`"00-DDD"`)
  })

  it('should not auto add characters when deleting', () => {
    renderComponent()

    const placeholder = screen.getByRole('presentation')
    const input = screen.getByTestId('input')

    user.type(input, '00')
    fireEvent.keyDown(input, { keyCode: 8 })
    fireEvent.change(input, { target: { value: '00' } })
    expect(placeholder.childNodes[0].textContent).toMatchInlineSnapshot(`"00"`)
  })

  it('should add any autofillable characters if the next key is not an autofillable character', () => {
    renderComponent()

    const placeholder = screen.getByRole('presentation')
    const input = screen.getByTestId('input')

    user.type(input, 'AA')
    fireEvent.keyDown(input, { keyCode: 8 })
    fireEvent.change(input, { target: { value: 'AA' } })

    user.type(input, '0')

    expect(placeholder.childNodes[0].textContent).toMatchInlineSnapshot(
      `"AA-0"`,
    )
  })

  it('should notify that the input is complete when it matches the mask', () => {
    renderComponent({ mask: /^\d{2}$/, placeholder: 'DD', validExample: '00' })

    const input = screen.getByTestId('input')

    user.type(input, '1')
    user.type(input, '2')

    expect(mockOnChange).toHaveBeenCalledWith('1', false)
    expect(mockOnChange).toHaveBeenCalledWith('12', true)
    expect(mockOnChange).toHaveBeenCalledTimes(2)
  })

  it('should be able to use a custom matcher to change the placeholder and valid example', () => {
    const customMatcher = ({
      value,
      mask,
      remaining,
    }: {
      mask: RegExp
      value: string
      remaining: string
    }) => {
      let changed = false
      const matched = mask.test(`${value}${remaining}`)
      if (value.length === 4) {
        const lastKey = value.substring(value.length - 1)
        changed = lastKey === 'A'
      }

      const complete = mask.test(value)
      return { matched, value, complete, changed }
    }
    const { rerender } = render(
      <MaskedInput
        autoCharacters={['-']}
        mask={/^\w{2}-(A|B)-\d{3}$/}
        validExample="AA-A-000"
        placeholder="AA-DDD"
        onChange={mockOnChange}
        onMatch={customMatcher}
      >
        {({ style, ...maskedProps }) => (
          <Input
            style={{ ...style, border: '1px solid red' }}
            {...maskedProps}
            data-testid="input"
          />
        )}
      </MaskedInput>,
    )

    const input = screen.getByTestId('input') as HTMLInputElement
    user.type(input, 'A')
    user.type(input, 'A')
    user.type(input, 'A')

    rerender(
      <MaskedInput
        autoCharacters={['-']}
        mask={/^\w{2}-A\d--\d{3}$/}
        validExample="AA-A0--000"
        placeholder="AA-A0--DDD"
        onChange={mockOnChange}
      >
        {({ style, ...maskedProps }) => (
          <Input
            style={{ ...style, border: '1px solid red' }}
            {...maskedProps}
            data-testid="input"
          />
        )}
      </MaskedInput>,
    )

    user.type(input, '0')

    const placeholder = screen.getByRole('presentation')
    expect(input.value).toMatchInlineSnapshot(`"AA-A0--"`)
    expect(placeholder.childNodes[0].textContent).toMatchInlineSnapshot(
      `"AA-A0--"`,
    )
  })

  it('should be able to paste an entire matching value', () => {
    renderComponent()

    const input = screen.getByTestId('input') as HTMLInputElement
    const placeholder = screen.getByRole('presentation')

    const event = new Event('paste', {
      bubbles: true,
      cancelable: true,
      composed: true,
    })

    const clipboardEvent = event as ClipboardEvent

    // @ts-ignore
    clipboardEvent['clipboardData'] = {
      getData: () => 'AA-000',
    }

    input.dispatchEvent(clipboardEvent)

    expect(placeholder.childNodes[0].textContent).toMatchInlineSnapshot(
      `"AA-000"`,
    )
  })

  it('should be able to paste all matching characters', () => {
    renderComponent()

    const input = screen.getByTestId('input') as HTMLInputElement
    const placeholder = screen.getByRole('presentation')

    const event = new Event('paste', {
      bubbles: true,
      cancelable: true,
      composed: true,
    })

    const clipboardEvent = event as ClipboardEvent

    // @ts-ignore
    clipboardEvent['clipboardData'] = {
      getData: () => 'AA-A',
    }

    input.dispatchEvent(clipboardEvent)

    expect(placeholder.childNodes[0].textContent).toMatchInlineSnapshot(`"AA-"`)
  })

  it('should be able to paste all matching characters with characters already present', () => {
    renderComponent()

    const input = screen.getByTestId('input') as HTMLInputElement
    const placeholder = screen.getByRole('presentation')

    user.type(input, '0')

    const event = new Event('paste', {
      bubbles: true,
      cancelable: true,
      composed: true,
    })

    const clipboardEvent = event as ClipboardEvent

    // @ts-ignore
    clipboardEvent['clipboardData'] = {
      getData: () => 'A-A',
    }

    input.dispatchEvent(clipboardEvent)

    expect(placeholder.childNodes[0].textContent).toMatchInlineSnapshot(`"0A-"`)
  })
})
