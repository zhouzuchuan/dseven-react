#!/usr/bin/env node
'use strict'

import commander from 'commander'

const program = new commander.Command()

program.usage('<command> [options]').on('--help', printHelp).parse(process.argv)

function printHelp() {
  console.log('  Commands:')
  console.log()
  console.log('    hooks         init a new application')
  console.log()
}

if (program.args[0] === 'hooks') {
  import('./hooks').then(({ start }) => {
    start()
  })
} else {
  program.help()
}

// chmod +x "$(npm bin)/builder"
