#!/usr/bin/env node

const program = require('commander');
// const chalk = require('chalk')
const clone = require('git-clone')
const shell = require('shelljs');
const log = require('tracer').colorConsole()
// const xu = require('../src/index');


/**
 * Usage.
 */

program
  .version(require('../package').version, "-v, --version")
  .description('bitor 应用模板工程的 cli')

program
  .command('create')

  .description('quick generate your file')
  .alias('c')
  .action(function (...args) {
    // xu.run(type, name);
    console.log(args)
  });

program
  // .help(function () {

  // })
  .command('clone <tpl> <project>')
  .option('-h, --help', "") //"clone the template"
  .action(function (tpl, project) {
    // if (!!tpl === false) {
    // log.info('目前 bitor 支持以下模板：')
    // log.info('e.g. bitor template myproject')
    // }
    if (tpl && project) {
      let pwd = shell.pwd()
      // log.info(`clone the template here：${pwd}/${project}/ ...`)
      clone(`https://github.com/bitores/${tpl}.git`, pwd + `/${project}`, null, function () {
        shell.rm('-rf', pwd + `/${project}/.git`)
        // log.info('模板工程建立完成')
      })
    } else {
      log.error('e.g. bitor template myproject')
    }
  })

program.parse(process.argv);