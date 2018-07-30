#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const proc = require('process');
const mri = require('mri');
const mkdirp = require('mkdirp');
const fastGlob = require('fast-glob');
const docks = require('./index').default;

const argv = mri(proc.argv.slice(2));
const app = docks();

/* eslint-disable promise/prefer-await-to-callbacks */

fastGlob(argv._, { ...argv, absolute: true })
  .then((files) => app.render(files))
  .then(async (content) => {
    const outfile = argv.outfile
      ? path.resolve(argv.outfile)
      : path.resolve('docs', 'README.md');

    const dirname = path.dirname(outfile);
    await util.promisify(mkdirp)(dirname);

    const promo = '_Generated using [docks](http://npm.im/docks)._';
    return util.promisify(fs.writeFile)(outfile, `${promo}\n${content}`);
  })
  .catch((err) => {
    console.error(err.stack);
    proc.exit(1);
  });
