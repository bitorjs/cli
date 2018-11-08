#!/usr/bin/env node

const program = require('commander');
// const chalk = require('chalk')
const clone = require('git-clone')
const shell = require('shelljs');
const log = require('tracer').colorConsole()

program
  .version(require('../package').version)
  .option('-v --version', 'print pm2 version')

  program
  .command('start <name|file|ecosystem|id>')
  .option('--watch', 'Watch folder for changes')
  .description('start and daemonize an app')
  .action(function (filename) {
    console.log(filename)
    shell.exec(`node ${require('path').join(__dirname,'../src/master.js')} ${filename}`)
  })

  program
  .command('stop <id|name|all|json|stdin...>')
  .option('--watch', 'Stop watching folder for changes')
  .description('stop a process')
  .action(function (type, a) {
    console.log(type,a)
  })

  program
  .command('install [module...]')
  .option('-g', 'Stop watching folder for changes')
  .option('--save', 'Stop watching folder for changes')
  .option('--save-dev', 'Stop watching folder for changes')
  .action(function(type, a,cmd){

    // const [a,cmd] = modules;
    console.log(type,a,cmd)
    // if (shell.exec(`npm i ${modules}`).code !== 0) {
    //   shell.echo('Error: bitor install failed');
    //   shell.exit(1);
    // }
  })

program
  .command('clone <tpl> <project>')
  .option('-h, --help', "") //"clone the template"
  .action(function (tpl, project) {
    if (tpl && project) {
      let pwd = shell.pwd()
      clone(`https://github.com/bitores/${tpl}.git`, pwd + `/${project}`, null, function () {
        shell.rm('-rf', pwd + `/${project}/.git`)
      })
    } else {
      log.error('e.g. bitor template myproject')
    }
  })

program.parse(process.argv);