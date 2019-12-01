


class Parser {
  constructor(parserStateTransformerFn) {
    this.parserStateTransformerFn = parserStateTransformerFn;
  }
  run(targetString) {
    const initialState = {
      targetString,
      index: 0,
      result: null,
      isError: false,
      error: null
    }
    return this.parserStateTransformerFn(initialState);
  }

  map(fn) {
    return new Parser(parserState => {
      const nextState = this.parserStateTransformerFn(parserState);
      if(nextState.isError) return nextState;
      return Parser.updateParserResult(nextState, fn(nextState.result));
    })
  }
  errorMap(fn) {
    return new Parser(parserState => {
      const nextState = this.parserStateTransformerFn(parserState);
      if(!nextState.isError) return nextState;
      return Parser.updateParserError(nextState, fn(nextState.error, nextState.index));
    });
  }

  chain(fn) {
    return new Parser(parserState => {
      const nextState = this.parserStateTransformerFn(parserState);
      if(nextState.isError) return nextState;
      const nextParser = fn(nextState.result);
      return nextParser.parserStateTransformerFn(nextState)
    });
  }

  static updateParserState(state, index, result) {
   return {
     ...state,
      index,
      result
    }
  }
  static updateParserResult(state, result) {
    return {
      ...state,
      result
  }};
  static updateParserError(state, errorMsg) {
    return {
      ...state,
      isError: true,
      error: errorMsg
  }};
}

// Start of letter parser
const letter = new Parser(parserState => {
  const {
    targetString,
    index,
    isError
  } = parserState;

  if(isError) return parserState;
  const slicedTarget = targetString.slice(index);
  if(slicedTarget.length === 0) return Parser.updateParserError(parserState, `letters: Got unexpected end of input`);
  const regexMatch = slicedTarget.match(/^[a-zA-Z]/);
  if(regexMatch) return Parser.updateParserState(parserState, index + regexMatch[0].length, regexMatch[0])
  return Parser.updateParserError(parserState, `letters: Couldn't match letters at ${index}`)
});
// End of letter parser

// Start of digit parser
const digit = new Parser(parserState => {
  const {
    targetString,
    index,
    isError
  } = parserState;

  if(isError) return parserState;
  const slicedTarget = targetString.slice(index);
  if(slicedTarget.length === 0) return Parser.updateParserError(parserState, `digits: Got unexpected end of input`);
  const regexMatch = slicedTarget.match(/^\d/);
  if(regexMatch) return Parser.updateParserState(parserState, index + regexMatch[0].length, regexMatch[0])
  return Parser.updateParserError(parserState, `digits: Couldn't match digits at ${index}`)
});
// End of digit parser

// Start of regexA parser
const regexA = (r, f) => new Parser(parserState => {
  const {
    targetString,
    index,
    isError
  } = parserState;

  if(isError) return parserState;
  const slicedTarget = targetString.slice(index);
  if(slicedTarget.length === 0) return Parser.updateParserError(parserState, `regex: Got unexpected end of input`);
  let regexMatch = slicedTarget.match(new RegExp('^' + r, f));
  if(regexMatch) return Parser.updateParserState(parserState, index + regexMatch[0].length, regexMatch)
  return Parser.updateParserError(parserState, `regex: Couldn't match regex "${'/' + r + '/' + (f ? f : '')}" at ${index}`)
});
// End of regexA parser
// Start of regex parser
const regex = (r, f) => regexA(r, f).map(e => e[0])
// End of regex parser

// Start of error parser
const err = new Parser(parserState => {
  parserState = parserState ? parserState : {
    targetString: '',
    index: 0,
    result: null,
    isError: false,
    error: null
  };
  return Parser.updateParserError(parserState, 'err: An error occured')
})
// End of error parser


// Start of string parser
const str = s => new Parser(parserState => {
  const {targetString, index, isError} = parserState;
  if(isError) return parserState;
  const slicedTarget = targetString.slice(index);
  if(slicedTarget.length === 0) return Parser.updateParserError(parserState, `str: Tried to match "${s}", but got unexpected end of input`)
  if(slicedTarget.startsWith(s)) {
    return Parser.updateParserState(parserState, index + s.length, s);
  }
  return Parser.updateParserError(parserState, `str: Tried to match "${s}", but got "${targetString.slice(index, index + 10)}"`);
});
// End of string parser

// Start of sequenceOf parser
const sequenceOf = parsers => new Parser(parserState => {
  if(parserState.isError) return parserState;
  const results = [];
  let nextState = parserState;

  for(let p of parsers) {
    nextState = p.parserStateTransformerFn(nextState);
    if(nextState.isError) return Parser.updateParserError(Parser.updateParserResult(nextState, results), `sequenceOf: unable to parse at index ${nextState.index}`);
    results.push(nextState.result)
  }
  return Parser.updateParserResult(nextState, results);
});
// End of sequenceOf parser

// Start of choice parser
const choice = parsers => new Parser(parserState => {
  if(parserState.isError) return parserState;
  for(let p of parsers) {
    const nextState = p.parserStateTransformerFn(parserState);
    if(!nextState.isError) return nextState;
  }
  return Parser.updateParserError(parserState, `choice: unable to match with any parser at index ${parserState.index}`)
});
// End of choice parser

// Start of many parser
const many = parser => new Parser(parserState => {
  let nextState = parserState;
  let results = []
  let done = false;
  while(!done) {
    nextState = parser.parserStateTransformerFn(nextState);
    // console.log('nextState: ', nextState);
    if(nextState.result === null) break;
    if(!nextState.isError) results.push(nextState.result);
    else {
      done = true;
    }
  }
  if(typeof(parserState.targetString) == "object") throw new Error("here")
  // if(results.length !== 0) return Parser.updateParserResult({...parserState, index: nextState.index}, results);
  if(results.length !== 0) return Parser.updateParserState(parserState, nextState.index, results);
  return Parser.updateParserError(parserState, `many: unable to match with parser at least once at index ${parserState.index}`);
});
// End of many parser

// Start of optional parser
const optional = parser => new Parser(parserState => {
  let nextState = parser.parserStateTransformerFn(parserState);
  if(nextState.isError) return Parser.updateParserResult(parserState, null)
  return nextState;
})
// End of optional parser

const lazy = parserThunk => new Parser(parserState => {
  const parser = parserThunk();
  return parser.parserStateTransformerFn(parserState);
})

// Start of combination parsers

const letters = many(letter).map(e => e.join(''));
const digits = many(digit).map(e => e.join(''));

// Start of sepBy parser
const sepBy = seperatorParser => valueParser => new Parser(parserState => {
  const results = [];
  let nextState = parserState;

  while(true) {
    const searchedForState = valueParser.parserStateTransformerFn(nextState);
    if(searchedForState.isError) break;
    results.push(searchedForState.result);
    nextState = searchedForState;

    const seperatorState = seperatorParser.parserStateTransformerFn(nextState);
    if(seperatorState.isError) break;
    nextState = seperatorState;
  }
  return Parser.updateParserResult(nextState, results)

})
// End of sepBy parser

// Start of between parser
const between = (left, right) => content => sequenceOf([left, content, right]).map(e => e[1]);
// End of between parser


// End of combination parsers


module.exports = {
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
}
