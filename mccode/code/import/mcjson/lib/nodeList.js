const consoleStyles = require('./consoleStyles.js');

module.exports = {
  mcfunction: [
    {
      type: "command",
      last: true
    },
    {
      type: "comment",
      last: true
    },
    {
      type: "newline",
      last: true
    },
    {
      type: "debugcomment"
    },
    {
      type: "as",
      run: (args) => {
        if(typeof(args) == 'string') return "execute as " + args + " run "
        if(Array.isArray(args)) {
          let returns = [];
          for(let i in args) {
            returns.push("execute as " + args[i] + " run ")
          }
          return returns
        }
      }
    },
    {
      type: "at",
      run: (args) =>{
        if(typeof(args) == 'string') return "execute at " + args + " run "
        if(Array.isArray(args)) {
          let returns = [];
          for(let i in args) {
            returns.push("execute at " + args[i] + " run ")
          }
          return returns
        }}
    },
    {
      type: "asat",
      run: (args) => {
        if(typeof(args) == 'string') return "execute as " + args + " at @s run "
        if(Array.isArray(args)) {
          let returns = [];
          for(let i in args) {
            returns.push("execute as " + args[i] + " at @s run ")
          }
          return returns
        }
      }
    },
    {
      type: "align",
      run: (args) => {
        if(typeof(args) == 'string') return "execute align " + args + " run "
        if(Array.isArray(args)) {
          let returns = [];
          for(let i in args) {
            returns.push("execute align " + args[i] + " run ")
          }
          return returns
        }
      }
    },
    {
      type: "anchored",
      run: (args) => {
        if(typeof(args) == 'string') return "execute anchored " + args + " run "
        if(Array.isArray(args)) {
          let returns = [];
          for(let i in args) {
            returns.push("execute anchored " + args[i] + " run ")
          }
          return returns
        }
      }
    },
    {
      type: "facing",
      run: (args) => {
        if(typeof(args) == 'string') return "execute facing " + args + " run "
        if(Array.isArray(args)) {
          let returns = [];
          for(let i in args) {
            returns.push("execute facing " + args[i] + " run ")
          }
          return returns
        }
      }
    },
    {
      type: "in",
      run: (args) => {
        if(typeof(args) == 'string') return "execute in " + args + " run "
        if(Array.isArray(args)) {
          let returns = [];
          for(let i in args) {
            returns.push("execute in " + args[i] + " run ")
          }
          return returns
        }
      }
    },
    {
      type: "positioned",
      run: (args) => {
        if(typeof(args) == 'string') return "execute positioned " + args + " run "
        if(Array.isArray(args)) {
          let returns = [];
          for(let i in args) {
            returns.push("execute positioned " + args[i] + " run ")
          }
          return returns
        }
      }
    },
    {
      type: "rotated",
      run: (args) => {
        if(typeof(args) == 'string') return "execute rotated " + args + " run "
        if(Array.isArray(args)) {
          let returns = [];
          for(let i in args) {
            returns.push("execute rotated " + args[i] + " run ")
          }
          return returns
        }
      }
    },
    {
      type: "store",
      run: (args) => {
        if(typeof(args) == 'string') return "execute store " + args + " run "
        if(Array.isArray(args)) {
          let returns = [];
          for(let i in args) {
            returns.push("execute store " + args[i] + " run ")
          }
          return returns
        }
      }
    },
    {
      type: "if",
      run: (args) => {
        return handleIf(args);
      }
    }
  ]
}


function handleIf(args) {
  if(typeof(args) == "string") return handleIfString(args, false);

  let results = [];

  if(typeof(args) == "object") {
    results.push(...handleIfLogic(args, false));
  }

  return results;

}

function handleIfString(str, invert = false) {
  if((/^!/.test(str) && invert == false) || (!/^!/.test(str) && invert == true)) return `execute unless ${str.replace(/^!/, '')} run `
  return `execute if ${str.replace(/^!/, '')} run `
}

function handleIfLogic(args, parentInverted = false) {
  let results = []
  args.inverted = args.inverted ? args.inverted : false;
  args.inverted = parentInverted ? !args.inverted : args.inverted;
  if(args.type.toLowerCase() == "or") {
    results.push(...handleIfOr(args.conds, args.inverted));
  }
  if(args.type.toLowerCase() == "and") {
    results.push(...handleIfAnd(args.conds, args.inverted));
  }
  return results;
}

function handleIfOr(conds, invert = false) {
  let results = [];

  for(let cond of conds) {
    if(typeof(cond) == "string") results.push(handleIfString(cond, invert))
    else if(typeof(cond) == "object") results.push(...handleIfLogic(cond, invert))
  }

  return results;
}
function handleIfAnd(conds, invert = false) {
  let results = [""];

  for(let cond of conds) {
    if(typeof(cond) == "string") results = results.map(e => e + handleIfString(cond, invert))
    else if(typeof(cond) == "object")  {
      let returned = handleIfLogic(cond, invert);
      let returns = [];
      for(let i in results) {
        for(let ii in returned) {
          returns.push(results[i] + returned[ii])
        }
      }
      results = returns;
    }
  }
  return results;
}
