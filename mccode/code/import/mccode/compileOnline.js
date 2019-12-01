const parse = require('./parse.js');
const mcjson = require('../mcjson/index.js');

module.exports = (mccode, outputContainer) => {
  const parsed = parse(mccode, {
    noCredits: true,
    noWhitelines: true,
    fullError: false
  });
  if (parsed.isError) return alert(parsed.error);

  const outputFiles = [];

  for (let jsonFile of parsed.result) {
    const data = mcjson.generate(jsonFile);
    outputFiles.push({
      path: data.path.replace(/^.\//, ''),
      content: data.content
    });
  }

  return outputFiles;

}
