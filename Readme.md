# email-prompt

CLI email prompt featuring autocompletion and validation.
Powers [𝚫now](https://zeit.co/now) `--login`.

![prompt](https://cloud.githubusercontent.com/assets/13041/15456597/36b76246-202a-11e6-99e8-3839514bed57.gif)

## How to use

```js
const prompt = require('email-prompt');
prompt({ /* opts */ })
.then((email) => {
  console.log('\n> Hello ' + val);
))
.catch(() => {
  console.log('\n> Aborted!');
})
```

To run the demo, clone the project and run:

```bash
$ npm install
$ node demo
```

### Options

- `start` (`String`): the beginning of the prompt. Defaults to `> Enter your email: `
- `domains` (`Set`): domain names to autocomplete (as `String`). Defaults to:
  - `aol.com`
  - `gmail.com`
  - `google.com`
  - `yahoo.com`
  - `ymail.com`
  - `hotmail.com`
  - `live.com`
  - `outlook.com`
  - `inbox.com`
  - `mail.com`
  - `gmx.com`
- `forceLowerCase` (`Boolean`): converts all input to lowercase. Defaults to `true`.
- `suggestionColor` (`String`): a [chalk](https://github.com/chalk/chalk) color. Defaults to `gray`
- `autocompleteChars` (`Set`): a set of chars that trigger autocompletion. Defaults to:
  - ↹ Tab
  - ↵ Return (enter)
  - → Right arrow
- `resolveChars` (`Set`): a set of chars that resolve the promise. Defaults to ↵return
- `abortChars` (`Set`): a set of chars that abort the process. Defaults to Ctrl+C
- `allowInvalidChars` (`Boolean`): controls whether non-email chars are accepted. Defaults to `false`

### Notes

Some important implementation details:
- `email-prompt` automatically adapts the mode of `process.stdin` for you.
- The `stdin` stream is `resume`d and `pause`d upon the promise being
  settled.
- When the promise resolves or rejects, the previous stdin mode is restored.
- The `tty` mode is set to `raw`, which means all the caret interactions
  that you come to expect in a regular `stdin` prompt are simulated.
  This gives us fine-grained control over the output and powers the
  validation.
