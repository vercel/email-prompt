const ansi = require('ansi-escapes')
const chalk = require('chalk')

// eslint-disable-next-line no-multi-assign
module.exports = exports.default = function emailPrompt({
  start = '> Enter your email: ',
  domains = new Set([
    'aol.com',
    'gmail.com',
    'google.com',
    'yahoo.com',
    'ymail.com',
    'hotmail.com',
    'live.com',
    'outlook.com',
    'inbox.com',
    'mail.com',
    'gmx.com',
    'icloud.com',
    'zeit.co'
  ]),
  forceLowerCase = true,
  suggestionColor = 'gray',
  autoCompleteChars = new Set([
    '\t' /* tab */,
    '\r' /* return */,
    '\x1b[C' /* right arrow */,
    ' ' /* Spacebar */
  ]),
  resolveChars = new Set(['\r']),
  abortChars = new Set(['\x03']),
  allowInvalidChars = false
} = {}) {
  return new Promise((resolve, reject) => {
    // Some environments (e.g., cygwin) don't provide a tty
    if (!process.stdin.setRawMode) {
      return reject(new Error('stdin lacks setRawMode support'))
    }

    const isRaw = process.stdin.isRaw

    process.stdout.write(start)
    process.stdin.setRawMode(true)
    process.stdin.resume()

    let val = ''
    let suggestion = ''
    let caretOffset = 0

    // To make `for..of` work with buble
    const _domains = Array.from(domains)

    const ondata = v => {
      const s = v.toString()

      // Abort upon ctrl+C
      if (abortChars.has(s)) {
        restore()
        return reject(new Error('User abort'))
      }

      let completion = ''

      // If we have a suggestion *and*
      // the user is at the end of the line *and*
      // the user pressed one of the keys to trigger completion
      if (suggestion !== '' && !caretOffset && autoCompleteChars.has(s)) {
        val += suggestion
        suggestion = ''
      } else {
        if (s === '\x1b[D') {
          if (val.length > Math.abs(caretOffset)) {
            caretOffset--
          }
        } else if (s === '\x1b[C') {
          if (caretOffset < 0) {
            caretOffset++
          }
        } else if (s === '\x08' || s === '\x7f') {
          // Delete key needs splicing according to caret position
          val = val.substr(0, val.length + caretOffset - 1) +
            val.substr(val.length + caretOffset)
        } else {
          if (resolveChars.has(s)) {
            restore()
            return resolve(val)
          }

          if (!allowInvalidChars) {
            // Disallow more than one @
            if (/@/.test(val) && s === '@') {
              return
            }

            if (/[^A-z0-9-+_.@]/.test(s)) {
              return
            }
          }

          const add = forceLowerCase ? s.toLowerCase() : s
          val = val.substr(0, val.length + caretOffset) + add +
            val.substr(val.length + caretOffset)
        }

        const parts = val.split('@')
        if (parts.length === 2 && parts[1].length > 0) {
          const [, _host] = parts
          const host = _host.toLowerCase()
          for (const domain of _domains) {
            if (host === domain) {
              break
            }

            if (host === domain.substr(0, host.length)) {
              suggestion = domain.substr(host.length)
              completion = chalk[suggestionColor](suggestion)
              completion += ansi.cursorBackward(domain.length - host.length)
              break
            }
          }
        }

        if (completion.length < 0) {
          suggestion = ''
        }
      }

      process.stdout.write(ansi.eraseLines(1) + start + val + completion)
      if (caretOffset) {
        process.stdout.write(ansi.cursorBackward(Math.abs(caretOffset)))
      }
    }

    const restore = () => {
      process.stdin.setRawMode(isRaw)
      process.stdin.pause()
      process.stdin.removeListener('data', ondata)
    }

    process.stdin.on('data', ondata)
  })
}
