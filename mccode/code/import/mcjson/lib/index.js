const fs = require('fs');
const path = require('path');

const consoleStyles = require('./consoleStyles.js');
const nodeList = require('./nodeList.js');

module.exports.compile = (args) => {
  const inputPath = args[0] || './';

  fs.access(inputPath, err => {
    if(err) return console.log(consoleStyles.FgRed + 'Target does not exist' + consoleStyles.Reset);

    let inputFiles = [];
    let outputFiles = [];
    let count = 0;
    readDir(inputPath, () => {
      console.log(consoleStyles.FgGreen + 'Read ' + inputFiles.length + ' files\n' + consoleStyles.Reset);
      for(let file of inputFiles) {
        // const instancePath = path.join(inputPath, 'functions', path.basename(file, 'json') + 'mcfunction')
        fs.readFile(file, 'utf8', (err, raw) => {
          if(err) return console.error(err);
          let data;
          try {
            data = JSON.parse(raw);
          } catch(e) {
            return console.log(consoleStyles.FgRed + 'ERR\t\t' + consoleStyles.FgYellow + 'Invalid JSON: ' + consoleStyles.Reset + file + ' ' + e.toString().match(/(?<=Unexpected string in JSON )at position \d+/));
          }
          for(i in data) {
            const newFile = file.replace(new RegExp(path.extname(file) + '$'), '.mcfunction');
            data[i].type = data[i].type || 'mcfunction'
            if(data[i].path) {
              data[i].path = path.join(newFile.replace(new RegExp(path.basename(newFile) + '$'), ''), data[i].path)
            } else {
              data[i].path = newFile;
            }

            let fileData = generate(data[i], file);
            if(!fileData) continue;
            fs.mkdir(path.dirname(fileData.path), {recursive: true}, err => {
              if(err) return console.log(consoleStyles.FgRed + 'Error while creating folder ' + path.dirname(fileData.path) + consoleStyles.Reset);

              fs.writeFile('./' + fileData.path, fileData.content, err => {
                if(err) return console.log(consoleStyles.FgRed + 'Error while creating file:  ' + fileData.path + consoleStyles.Reset);
                console.log(consoleStyles.FgCyan + 'Generated\t\t\t' + consoleStyles.FgYellow + fileData.path + consoleStyles.Reset);
                outputFiles.push(fileData.path)
              });
            });

          }
        });
      }
    });

    function readDir(p, callback) {
      count++;
      fs.readdir(p, (err, files) => {
        if(err) return console.error(err);
        for(let file of files) {
          if(path.extname(file) == '.json') {
            inputFiles.push(path.join(p,file));
          } else if(path.extname(file) == '') {
            readDir(path.join(p, file), callback)
          }
        }
        count--
        if(count === 0) callback();
      });
    }

  });
}

module.exports.generate = generate;

function generate(data, file, options = {fullError: false}) {
  const {fullError} = options;
  if(typeof(data) != 'object' || Array.isArray(data)) {
    return console.log(consoleStyles.FgRed + 'Wrong input data' + consoleStyles.Reset);
  }
  // console.log('data: ', data);
  file = file ? file : '';
  let content = "";
  switch (data.type.toLowerCase()) {
    case "mcfunction":
      if(!/.mcfunction$/.test(data.path)) {
        data.path += '.mcfunction'
      }
      data.path = data.path.replace(/\\mcjson\\/, '\\functions\\')
      if(data.nodes) {
        if(!Array.isArray(data.nodes)) data.nodes = [data.nodes];
        for(let node of data.nodes) {
          if(typeof(node) == 'string') node = {"type": "command", "args": node};
          handleMcfunctionNodes(node, '', file);
        }
      }
      break;
    default:
      return console.log(consoleStyles.FgRed + 'Unknown file type: ' + data.type + consoleStyles.Reset);
  }

  return {
    "path": data.path,
    "content": content
  }

  function handleMcfunctionNodes(node, prefix, file) {
    prefix = prefix ? prefix : '';
    if(!node.type) return console.log('\n' + consoleStyles.FgRed + 'No Node type specified: ' + file + consoleStyles.Reset + '\n');
    const nodeType = nodeList.mcfunction.find(e => e.type == node.type.toLowerCase());
    if(nodeType) {
      if(/^(?:#|(?:\/\/))/.test(node.args) || node.type.toLowerCase() == 'newline') {
        if(/^#/.test(node.args)) content += node.args + '\n';
        if(node.type.toLowerCase() == 'newline') content += '\n'
      } else {
        if(nodeType.run) {
          const newPrefix = nodeType.run(node.args);

          if(typeof(newPrefix) == 'string') {
            if(typeof(prefix) == 'string') {
              prefix += newPrefix ? newPrefix : prefix;
              prefix = prefix;
            } else if(Array.isArray(prefix)) {
              for(let i in prefix) {
                prefix[i] += newPrefix;
              }
            }
          } else if(Array.isArray(newPrefix)) {
            if(typeof(prefix) == 'string') {
              for(let i in newPrefix) {
                newPrefix[i] = prefix + newPrefix[i];
              }
              prefix = newPrefix;
            } else if(Array.isArray(prefix)) {
              let combinedPrefix = [];
              for(let i in prefix) {
                for(let ii in newPrefix) {
                  combinedPrefix.push(prefix[i] + newPrefix[ii])
                }
              }
              prefix = combinedPrefix;
            }
          }
        }
        if(node.nodes && nodeType.last != true) {
          if(!Array.isArray(node.nodes)) node.nodes = [node.nodes];
          for(let i in node.nodes) {
            if(typeof(node.nodes[i]) == 'string') node.nodes[i] = {"type": "command", "args": node.nodes[i]};
            handleMcfunctionNodes(node.nodes[i], prefix, file);
          }
        }
        if(nodeType.last == true) {
          if(typeof(prefix) == 'string') content += (prefix + node.args + '\n').replace(/run execute /g, '');
          if(Array.isArray(prefix)) {
            content += prefix.map(e => e + node.args + '\n').join('').replace(/run execute /g, '');
          }
        }
      }
    } else {
      return console.log('\n' + consoleStyles.FgRed + 'Unknown node type: ' + node.type + consoleStyles.Reset + '\n');
    }
  }
}
