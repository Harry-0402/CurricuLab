console.log("Starting script...");
const ts = require('typescript');
console.log("Loaded typescript.");

const configFile = ts.readConfigFile('tsconfig.json', ts.sys.readFile);
console.log("Read config file.");
const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, './');
console.log(`Parsed config. Found ${parsed.fileNames.length} files.`);
parsed.fileNames.forEach((f, i) => console.log(`${i}: ${f}`));

try {
  console.log("Creating program...");
  const program = ts.createProgram(parsed.fileNames, parsed.options);
  console.log("Created program.");
  
  console.log("Getting diagnostics...");
  const allDiagnostics = ts.getPreEmitDiagnostics(program);
  console.log(`Found ${allDiagnostics.length} diagnostics.`);
  allDiagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
      let { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
      let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    } else {
      console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
    }
  });
} catch (err) {
  console.error("Caught error:", err);
}
