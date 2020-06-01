#!/usr/bin/env node

/**
 * Simple script that picks up variables from an index file, 
 * matches with user environment variables 
 * and writes the key/value pairs to an output file.
 * (This was originaly built as a util for Circle-ci to generate a dotenv file)
 *  
 * @description 
 * Matches variables declared in a file `--input=` like in a `.env.example` file 
 * to user environment variables and writes the output 
 * to a file declared in `--output=`
 * 
 * @example
 * `./node envvars-to-dotenv.js --input=.env.example --output=.env`
 * 
 * @author Filipe Prata de Lima<filipe@filipelima.com>
 * 
 * @copyright MIT
 * 
 */

const fs = require('fs');

try {
  // process arguments
  const args = processArgs();

  // read source file variables
  const inputFile = fs.readFileSync(args.input, 'utf8');
  const dataArray = inputFile.split('\n');
  let paramsObj = {};
  dataArray.forEach(line => {
    if (line.length) {
      const lineArr = line.split('=');
      const key = lineArr[0];
      const value = lineArr[1];
      paramsObj[key] = process.env[key] ? process.env[key] : value;
    }
  });

  // map source file variables to system environment variables
  let outputData = '';
  for (let p in paramsObj) {
      outputData += `${p}=${paramsObj[p]}\n`;
  }
  // write to output dotenv file
  const output = fs.writeFileSync(args.output, outputData);

  // success, exit
  console.log('Success');
  return process.exit(0);
} catch(e) {
  console.log(e);
  return process.exit(1);
}

/**
 * Process arguments
 * @param {*} args 
 * 
 * @returns {*} args
 */
function processArgs() {
  const required = ['input', 'output'];

  // process
  const args = {};
  process.argv.slice(2, process.argv.length)
    .forEach(arg => {
      if (arg.slice(0,2) === '--') {
        const longArg = arg.split('=');
        const longArgFlag = longArg[0].slice(2,longArg[0].length);
        const longArgValue = longArg.length > 1 ? longArg[1] : true;
        args[longArgFlag] = longArgValue;
      }
    });

  // --help flag
  if (args.help) {
    console.log(`usage: envvars-to-dotenv.js --input=.env.example --output=.env\n
    arguments:
    --input=[input file with variables to look for]
    --output=[results key/value pairs file to generate]
    `)
    return process.exit(0);
  }

  // check and alert for missing args
  const missing = [];
  required.forEach(req => {
    if(!args[req]) missing.push(req);
  });
  if (missing.length) {
    console.log(`Error: missing arguments: ${missing}\nDeclare as: --argument=value`);
    return process.exit(1)
  }

  return args;
}
