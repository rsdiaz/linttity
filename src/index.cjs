#!/usr/bin/env node
const { Command } = require('commander')
const { VERSION, INTRO, END_MESSAGE } = require('./config/index.cjs')
const nodejs = require('./lib/nodejs/index.cjs')
const nodets = require('./lib/nodets/index.cjs')

const program = new Command()

console.log(INTRO)

program
  .version(VERSION, '-v, --version', 'output the current version')
  .description(
    'Automate eslint configuration and install the necessary packages for Nodejs projects'
  )
  .option(
    '-nodejs, --njs',
    'create a preset eslint configuration and install the necessary packages for Nodejs whit JavaScript projects'
  )
  .option(
    '-nodets, --nts',
    'create a preset eslint configuration and install the necessary packages for Nodejs whit TypeScript projects'
  )
  .parse(process.argv)

const options = program.opts()

if (options.njs) {
  nodejs().finally(() => console.log(END_MESSAGE))
}

if (options.nts) {
  nodets().finally(() => console.log(END_MESSAGE))
}
