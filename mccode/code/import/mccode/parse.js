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
} = require('./parsers/parsers.js');

const {
  whitespaceParser,
  newLineParser,
  manyNewLineParser,
} = require('./parsers/utility.js');

const mcfunctionParser = require('./parsers/mcfunction.js');

module.exports = (mccode, options = {fullError: false, noWhitelines: false}) => {
  const {fullError, noWhitelines} = options;


  const unknownTypeReturn = e => new Parser(parserState => {
    return Parser.updateParserResult(parserState, [e])
  });


  const fileParser = sequenceOf([
    sequenceOf([
      str("!file:"),
      optional(whitespaceParser),
      regex(".+"),
    ]).map(e => e[2]),
    optional(manyNewLineParser),
    optional(sequenceOf([
      str("!type:"),
      optional(whitespaceParser),
      regex(".+"),
    ]).map(e => e[2])).chain(e => {
      if(e == null || e.toLowerCase() == "mcfunction") return mcfunctionParser(options);



      else return unknownTypeReturn(e);
    }),
  ])

  const mainParser = many(sequenceOf([
    optional(manyNewLineParser),
    fileParser,
  ])).map(e => {
    let result = [];

    for(let ee of e) {
      let file = {};

      file.path = ee[1][0];
      file.type = ee[1][2][0];
      file.nodes = ee[1][2][2] ? ee[1][2][2] : [];


      result.push(file)
    }

    return result;
  }).errorMap(e => {
    if(e == 'many: unable to match with parser at least once at index 0') return 'No file path specified'
    return e;
  })

  return mainParser.run(mccode)

}
