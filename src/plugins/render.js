/**
 * Externalize as `docks-render` or such.
 */

import fs from 'fs';
import util from 'util';
import path from 'path';
import proc from 'process';

export default function renderPlugin(app) {
  return {
    /**
     * Render single `fp` file to a documentation string.
     *
     * @example
     * const app = docks();
     * const output = app.renderFileSync('path/to/source/file/with/comments');
     * console.log(output);
     *
     * @name .renderFileSync
     * @param {string} fp absolute filepath to file to look for doc comments.
     * @returns {string}
     * @public
     */
    renderFileSync(fp) {
      const comments = app.parse(fs.readFileSync(fp, 'utf8'));

      return createRender(comments, fp);
    },

    /**
     * Render single `fp` file to a documentation string, asynchronously.
     *
     * @example
     * const app = docks();
     * app.renderFile('path/to/source/file/with/comments').then((output) => {
     *   console.log(output);
     * });
     *
     * @name .renderFile
     * @param {string} fp absolute file path to look for doc comments.
     * @returns {Promise<string>}
     * @public
     */
    async renderFile(fp) {
      return util
        .promisify(fs.readFile)(fp, 'utf8')
        .then((content) => {
          const comments = app.parse(content);
          return createRender(comments, fp);
        });
    },

    /**
     * Create a documentation output string from given comments.
     * Use `app.parse` method to generate such list of `Comment` objects.
     *
     * @example
     * const app = docks();
     *
     * const comments = app.parse('some string with block comments');
     * const output = app.renderTextSync(comments);
     * console.log(output);
     *
     * @name .renderTextSync
     * @param {Comment[]} comments
     * @returns {string}
     * @public
     */
    renderTextSync(comments) {
      return createRender(comments);
    },

    /**
     * Create a documentation output string from given comments, asynchronously.
     * Use `app.parse` method to generate such list of `Comment` objects.
     *
     * @example
     * const app = docks();
     *
     * const comments = app.parse('some string with block comments');
     * app.renderText(comments).then((output) => {
     *   console.log(output);
     * });
     *
     * @name .renderText
     * @param {Comment[]} comments
     * @returns {Promise<string>}
     * @public
     */
    async renderText(comments) {
      return createRender(comments);
    },

    /**
     * Render a list of filepaths to a documentation string.
     *
     * @example
     * const proc = require('process');
     * const path = require('path');
     * const app = docks();
     *
     * const files = ['src/index.js', 'src/bar.js'].map((fp) => {
     *   return path.join(proc.cwd(), fp);
     * })
     *
     * const output = app.renderSync(files);
     * console.log(output);
     *
     * @name .renderSync
     * @param {Array<string>} files list of absolute file paths to look for doc comments.
     * @returns {string}
     * @public
     */
    renderSync(files) {
      return files
        .map((fp) => {
          const content = app.renderFileSync(fp);
          return content.length > 0 ? `### ${createLink(fp)}\n${content}` : '';
        })
        .join('\n\n');
    },

    /**
     * Render a list of filepaths to a documentation, asynchronously.
     *
     * @example
     * const proc = require('process');
     * const path = require('path');
     * const app = docks();
     *
     * const files = ['src/index.js', 'src/bar.js'].map((fp) => {
     *   return path.join(proc.cwd(), fp);
     * })
     *
     * app.render(files).then((output) => {
     *   console.log(output);
     * });
     *
     * @name .render
     * @param {Array<string>} files list of absolute file paths to look for doc comments.
     * @returns {Promise<string>}
     * @public
     */
    async render(files) {
      return Promise.all(
        files.map(async (fp) => {
          const content = await app.renderFile(fp);
          return content.length > 0 ? `### ${createLink(fp)}\n${content}` : '';
        }),
      ).then((results) => results.join('\n\n'));
    },
  };
}

function createLink(fp, name, loc) {
  const url = path.relative(proc.cwd(), fp);
  const line = loc ? `#L${loc.end.line}` : '';
  return `[${name || url}](/${url}${line})`;
}

function escape(val) {
  return val.replace('<', '&lt;').replace('>', '&gt;');
}

function createRender(comments, fp) {
  const output = [];
  const link = (c) => (fp ? createLink(fp, c.name, c.loc) : c.name);

  comments.forEach((comment) => {
    output.push('');
    output.push(`#### ${link(comment)}`);
    output.push(comment.description.trim());

    if (comment.params.length > 0) {
      output.push('');
      output.push('**Params**');
      comment.params.forEach((param) => {
        const name = param.isOptional ? `[${param.name}]` : param.name;
        const { type } = param.type;

        let str = param.type.name;
        if (!type.name && type.type === 'UnionType') {
          str = type.elements.map((x) => x.name).join('|');
        }

        output.push(
          `- \`${name}\` **{${escape(str)}}** ${param.description}`.trim(),
        );
      });
    }

    if (comment.return) {
      output.push('');
      output.push('**Returns**');
      output.push(
        `- \`${comment.return.type.name}\` ${
          comment.return.description
        }`.trim(),
      );
    }

    if (comment.examples.length > 0) {
      output.push('');
      output.push('**Examples**');
      comment.examples.forEach((example) => {
        output.push(`\`\`\`${example.lang}`);
        output.push(example.code);
        output.push('```');
      });
    }
  });

  return output.join('\n');
}
