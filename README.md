# React-Masked

There are lot of masking libraries out there:
[text-mask](https://text-mask.github.io/text-mask/),
[input-masking](https://github.com/estelle/input-masking),
[cleave.js](https://nosir.github.io/cleave.js/). Some do a little bit more than
they need to and sometimes not as flexible as needed. This is inspired by all of
these great libraries before this.

## Rationale

Instead of add the values in the field for masking, this will make a faux field
underneath the component passed in as a child to the component. It will them
take all styles applied on that field and transfer it to the faux field using
`getComputedStyle`. It will then make the background color of the field passed
in as `transparent`. All of the masking is down on the faux field and the
controlled behavior of the masking is done by the render prop from the
`MaskedInput` component. This makes it really flexible as the user can use
whatever component they want and the component with the passed in ref will be
copied for the masking placeholder. This also means that styling is trivial —
style your own components.

There is no special syntax to how masks are defined. They are pure Regex.
JavaScript lacks an ability to partially match strings to a Regex (I so wish it
could). Instead of trying to do a lot of logic to figure out if each character
is valid against a Regex, the component also expects a `validExample` which is
used to determine if the current `value` plus the remaining characters from the
`validExample` currently pass the Regex test. It's easy enough for a consumer to
define this, so there is no need to add any bloat to this component.

The component takes an array of `autoCharacters`. If after inserting a character
into a field the next character in the `validExamples` is character in this
array, then it will auto insert it. This will obviously fail for optional
letters in the middle of the string. For this reason there is an ability to pass
in a custom matcher function which can be used to handle more complicated cases
like these.

## Usage

In the most basic scenarios, all we need to pass the component a `mask`,
`validExample`, and `placeholder`. Technically, the `placeholder` is not
required, but it's just not great for user experience.

```javascript
import { MaskedInput } from 'react-masked'

const App = () => {
  return (
    <main className="app">
      <MaskedInput
        mask={/^\w{2}-\d{3}$/}
        validExample="AA-000"
        placeholder="AA-DDD"
      >
        {maskedProps => <input type="text" {...maskedProps} />}
      </MaskedInput>
    </main>
  )
}
```

Usually you want an input that you've styled to have this behavior, so you can:

```javascript
import { MaskedInput } from 'react-masked'

const App = () => {
  return (
    <main className="app">
      <MaskedInput
        mask={/^\w{2}-\d{3}$/}
        validExample="AA-000"
        placeholder="AA-DDD"
      >
        {maskedProps => <MyCustomComponent type="text" {...maskedProps} />}
      </MaskedInput>
    </main>
  )
}
```

In this scenario, you'd want to use a `forwardRef` to pass the `ref` in
`maskedProps` to the component that you'd like to clone and place the
placeholder element below. `MaskedInput` will create a placeholder element with
the same styles as that field position it absolutely in its parent.

## Props

| Prop                                         | Description                                                                                                                                                                                                                                                                    |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| autoCharacters                               | An `array` of characters that can be automatically inserted. After ever keypress if there is one of these characters following that input, then `MaskedInput` will automatically insert those characters. This is usually used to delimiters or formatters. This is optional.  |
| children                                     | This component takes a render prop as the children of this component. It is a function that returns a `React.node`/ This is required.                                                                                                                                          |
| mask                                         | A RegExp to determine the valid value for the field. You should start this with `^` to denote the start of string and end with `$` to mark the end of string. This will be used to determine if the next keypress is valid for the current mask. This is required.             |
| placeholder                                  | The placeholder to to display for characters not filled in                                                                                                                                                                                                                     |
| validExample                                 | A valid example that passes a test against the `mask` specified. After characters are entered, the remaining characters from this example will be used to validate the input. JavaScript doesn't have a match partial for RegExp, so this is used to do that check efficiently |
| onChange(value, complete)                    | This function will be called whenever the input changes. It will return the current value and if `mask` is complete or not. This is required.                                                                                                                                  |
| onMatch({ value, mask, remaining, lastKey }) | A matcher function can be passed to handle the matching yourself to handle complex scenarios when there are variable conditions. There examples below to show how this can be utilized.                                                                                        |

### Masked Props

These are the props that are passed by the render prop:

| Prop      | Description                                                                                                                                                                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ref       | The `ref` that should be passed to the field that will be cloned in style to hold the placeholder and will be placed under the field that the `ref` points to. The placeholder must have the same styles so that the characters and spacing match up in both fields. |
| style     | `MaskedInput` will remove the background color of the child field so that it the placeholder can be seen from below field.                                                                                                                                           |
| value     | The current value of the masked input. This should be set on the child component whenever the value changes (controlled).                                                                                                                                            |
| onKeyDown | The event handler for when a key is pressed down                                                                                                                                                                                                                     |
| onChange  | The event handler for when there is a change event in the field.                                                                                                                                                                                                     |
| onPaste   | The event handler for when content is pasted in the field                                                                                                                                                                                                            |
