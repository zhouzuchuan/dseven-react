import shell from 'shelljs'
import path from 'path'

const babelLibConfigPath = path.join(__dirname, '../babel-lib.config.js')
const babelEsmConfigPath = path.join(__dirname, '../babel-es.config.js')

export const start = () => {
  //   shell.exec(
  //     `tsc --emitDeclarationOnly && yarn run cross-env NODE_ENV=lib babel src  --out-dir lib --extensions \".ts,.tsx\"  --source-maps --presets=@babel/preset-env  --presets=@babel/preset-typescript --plugins=@babel/plugin-transform-runtime`
  //   )
  shell.exec(
    `tsc --emitDeclarationOnly --declarationDir esm  && babel src --no-babelrc  --out-dir esm --extensions \".ts,.tsx\"  --config-file ${babelEsmConfigPath}`
  )
  shell.exec(
    `tsc --emitDeclarationOnly  && babel src --no-babelrc  --out-dir lib --extensions \".ts,.tsx\"  --config-file ${babelLibConfigPath}`
  )
}
