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
array, then it will auto insert it.

## Usage

```javascript
import { MaskedInput } from 'react-masked'

const App = () => {
  return (
    <main className="app">
      <MaskedInput
        autoCharacters={['-']}
        mask={/^\w{2}-\d{3}$/}
        validExample="AA-000"
        placeholder="AA-DDD"
        placeholderColor="#c1c1c1"
      >
        {maskedProps => <YouCustomComponent {...maskedProps} />}
      </MaskedInput>
    </main>
  )
}
```
