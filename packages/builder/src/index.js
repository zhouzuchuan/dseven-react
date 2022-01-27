#!/usr/bin/env node
'use strict'

const commander = require('commander')
const program = new commander.Command()

program.usage('<command> [options]').on('--help', printHelp).parse(process.argv)

function printHelp() {
  console.log('  Commands:')
  console.log()
  console.log('    js         init a new application')
  console.log('    css         init a new application')
  console.log()
}

const arg = program.args[0]

if (arg === 'js') {
  require('./jsBuild').start()
} else {
  program.help()
}

// chmod +x "$(npm bin)/builder"
