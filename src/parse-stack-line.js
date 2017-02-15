const la = require('lazy-ass')
const is = require('check-more-types')

// function isNotEmpty (s) {
//   return s
// }

// s is like (/src/index.js:4:13)
function parseAt (s, fullLine) {
  const parts = s.replace(/\(/, '')
    .replace(/\)/, '')
    .trim()
    .split(':')
  la(parts.length === 3, 'invalid number of parts', s, 'full line', fullLine)
  return {
    filename: parts[0],
    line: parts[1],
    column: parts[2]
  }
}

function parseStackLine (line) {
  la(is.unemptyString(line), 'invalid line', line)
  try {
    const inRound = /(\(.*\))/
    const match = inRound.exec(line)

    const parts = line.split(' ').filter(is.unemptyString)
    const functionName = parts[1]

    const at = parseAt(match[0], line)
    return {
      functionName: functionName,
      filename: at.filename,
      line: Number(at.line),
      column: Number(at.column)
    }
  } catch (err) {
    const msg = 'Could not parse stack line "' + line + '"\n' + err.message
    throw new Error(msg)
  }
}

module.exports = parseStackLine
