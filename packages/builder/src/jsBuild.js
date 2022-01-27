const shell = require('shelljs')
const path = require('path')

const babelLibConfigPath = path.join(__dirname, '../babel-lib.config.js')
const babelEsmConfigPath = path.join(__dirname, '../babel-esm.config.js')

module.exports = {
  start() {
    shell.exec(`tsc --emitDeclarationOnly --declarationDir types`)
    shell.exec(
      `babel src --no-babelrc  --out-dir esm --extensions \".ts,.tsx\"  --config-file ${babelEsmConfigPath}`
    )
    shell.exec(
      `babel src --no-babelrc  --out-dir lib --extensions \".ts,.tsx\"  --config-file ${babelLibConfigPath}`
    )
  },
}
