#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk')
const clone = require('git-clone')
const shell = require('shelljs');
const log = require('tracer').colorConsole()


/**
 * Usage.
 */

program
  .version(require('../package').version, "-v, --version")
  .usage('<cmd> [env]')
  .description('Bitor CLI is a front-end project development tool.')

// proxy  npm 
program
  .command('install <name>')
  .description('proxy npm install command')
  .alias('i')
  .option("-S, --save", "")
  .option("-D, --save-dev", "")
  .option("-g, --global", "")
  .action(function (name) {
    let option = '--save';
    if (this.global) option = '-g';
    if (this.saveDev) option = '-D'

    if (shell.which('npm')) {
      shell.exec(`npm i ${option} ${name}`)
    } else {
      shell.echo('Sorry, this script requires npm');
    }
  });

program
  .command('start')
  .description('proxy npm run command')
  .action(function (script) {
    shell.exec(`npm start`)
  });

program
  .command('run <script>')
  .description('proxy npm run command')
  .action(function (script) {
    shell.exec(`npm run ${script}`)
  });

// proxy git
program
  .command('clone <url>')
  .description('proxy git clone command')
  .alias('cl')
  .action(function (url) {
    shell.exec(`git clone ${url}`)
  });

program
  .command('pull')
  .description('proxy git pull command')
  .alias('pl')
  .action(function () {
    shell.exec(`git pull`)
  });

program
  .command('push')
  .description('proxy git push command')
  .alias('ps')
  .action(function () {
    shell.exec(`git push`)
  });

program
  .command('status')
  .alias('st')
  .description('proxy git status command')
  .action(function () {
    shell.exec(`git status`)
  });

program
  .command('add <path>')
  .description('proxy git add . command')
  .action(function (path) {
    shell.exec(`git add .`)
  });

program
  .command('clean')
  .description('proxy git add . command')
  .option('-d', 'remove whole directories')
  .option('-q, --quiet', '')
  .option('-f, --force', '')
  .allowUnknownOption()
  .action(function (cmd) {
    // fix
    shell.exec(`git clean ${cmd.parent.rawArgs.slice(3).join(' ')}`)
  });

program
  .command('commit <content>')
  .alias("cm")
  .description('proxy git commit -m "content" command')
  .action(function (content) {
    shell.exec(`git commit -m ${content}`)
  });

program
  .command('checkout [branch]')
  .alias('co')
  .description('proxy git checkout command')
  .option("-b", "")
  .action(function (branch) {
    let option = '';
    if (this.b) option = '-b';
    shell.exec(`git checkout ${option} ${branch}`)
  });

program
  .command('branch')
  .alias('br')
  .description('proxy git branch command')
  .option("-a", "")
  .action(function () {
    let option = '';
    if (this.a) option = '-a';
    shell.exec(`git branch ${option}`)
  });

// for bitor
program
  .command('new [project]')
  .alias('n')
  .description("create a project with the vue|react template.")
  .option('-v, --vue', 'vue template')
  .option('-r, --react', 'react template')
  .action(function (project) {
    let tpl = 'vue';
    let pwd = shell.pwd()
    if (this.react) tpl = 'react';

    if (!project) project = `${tpl}-demo`;
    clone(`https://github.com/bitorjs/${tpl}-template.git`, pwd + `/${project}`, null, function () {
      shell.rm('-rf', pwd + `/${project}/.git`)
    })
  })


program
  .command('*', 'Hidden commond', {
    noHelp: true
  })
  .action(function (cmd) {
    console.log(chalk.red(`Not find the command ${cmd}`));
    program.help()
  });

program.parse(process.argv);

if (program.args.length === 0) program.help()