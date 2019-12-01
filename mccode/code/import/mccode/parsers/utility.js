const {
  Parser,
  lazy,
  letter,
  digit,
  regex,
  regexA,
  letters,
  digits,
  err,
  str,
  sequenceOf,
  choice,
  many,
  optional,
  between,
  sepBy,
} = require('./parsers.js')

const whitespaceParser = regex("\\s+");
const newLineParser = choice([str("\n"), str("\r\n")]);
const manyNewLineParser = many(newLineParser).map(e => e.join(""));


module.exports = {
  whitespaceParser: whitespaceParser,
  newLineParser: newLineParser,
  manyNewLineParser: manyNewLineParser,
}
