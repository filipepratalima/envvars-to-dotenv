# envvars-to-dotenv
Simple script that picks up variables from an index file, matches with user environment variables and writes the key/value pairs to an output file.

This was originaly created as as util for `circle-ci` so to generate a project dotenv file from the ci's environment variables.

---
### Description:
Matches variables declared in a file `--input=` like in a `.env.example` file to user environment variables and writes the output to a file declared in `--output=`

### Run:
```
$ node envvars-to-dotenv.js --input=.env.example --output=.env
```