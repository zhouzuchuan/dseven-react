"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = void 0;

var _shelljs = _interopRequireDefault(require("shelljs"));

var _path = _interopRequireDefault(require("path"));

var babelLibConfigPath = _path["default"].join(__dirname, '../babel-lib.config.js');

var babelEsmConfigPath = _path["default"].join(__dirname, '../babel-es.config.js');

var start = function start() {
  //   shell.exec(
  //     `tsc --emitDeclarationOnly && yarn run cross-env NODE_ENV=lib babel src  --out-dir lib --extensions \".ts,.tsx\"  --source-maps --presets=@babel/preset-env  --presets=@babel/preset-typescript --plugins=@babel/plugin-transform-runtime`
  //   )
  _shelljs["default"].exec("tsc --emitDeclarationOnly --declarationDir esm  && babel src --no-babelrc  --out-dir esm --extensions \".ts,.tsx\"  --config-file ".concat(babelEsmConfigPath));

  _shelljs["default"].exec("tsc --emitDeclarationOnly  && babel src --no-babelrc  --out-dir lib --extensions \".ts,.tsx\"  --config-file ".concat(babelLibConfigPath));
};

exports.start = start;