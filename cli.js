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

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const inputFiles = argv._.length > 0 ? argv._ : 'src/**/*.{js,jsx,ts,tsx}';

fastGlob(inputFiles, { ...argv, absolute: true })
  .then((files) => app.render(files))
  .then(async (apiContent) => {
    const outfile = argv.outfile
      ? path.resolve(argv.outfile)
      : path.resolve('README.md');

    const promo = '_Generated using [docks](http://npm.im/docks)._';
    const docksStart = '<!-- docks-start -->';
    const docksEnd = '<!-- docks-end -->';
    const content = `${docksStart}\n${promo}\n\n${apiContent}\n\n${docksEnd}`;

    if (fs.existsSync(outfile)) {
      const fileContent = await readFile(outfile, 'utf-8');

      if (fileContent.includes(docksStart) && fileContent.includes(docksEnd)) {
        const idxStart = fileContent.indexOf(docksStart);
        const idxEnd = fileContent.indexOf(docksEnd) + docksEnd.length;
        const apiPart = fileContent.substring(idxStart, idxEnd);
        const newContent = fileContent.replace(apiPart, content);
        return writeFile(outfile, newContent);
      }
      const msg = `Outfile should contain placeholders or not exist.`;
      throw new Error(msg);
    } else {
      const dir = path.dirname(outfile);
      await util.promisify(mkdirp)(dir);

      return writeFile(outfile, content);
    }
  })
  .catch((err) => {
    console.error(err.stack);
    proc.exit(1);
  });
