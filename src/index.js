import { parse as babylonParse } from '@babel/parser';
import doctrine from 'doctrine';

import descriptionPlugin from './plugins/description';
import examplesPlugin from './plugins/examples';
import normalizerPlugin from './plugins/normalizer';
import paramsPlugin from './plugins/params';
import renderPlugin from './plugins/render';
import sourcePlugin from './plugins/source';
import statesPlugin from './plugins/states';
import tagsPlugin from './plugins/tags';

const plugins = {
  description: descriptionPlugin,
  examples: examplesPlugin,
  normalizer: normalizerPlugin,
  params: paramsPlugin,
  render: renderPlugin,
  source: sourcePlugin,
  states: statesPlugin,
  tags: tagsPlugin,
};

const DEFAULT_OPTIONS = {
  ranges: true,
  tokens: true,
  sourceType: 'module',
  plugins: [
    'jsx',
    'flow',
    'importMeta',
    'dynamicImport',
    'classProperties',
    'classPrivateMethods',
    'classPrivateProperties',
    'objectRestSpread',
  ],
};

/**
 * > Constructor that gives you methods.
 *
 * @name docks
 * @returns {Object} instance of `Docks`
 * @public
 */
export default function docks() {
  const docksPlugins = [];

  const app = {
    /**
     * A plugin is a function that may extend the core functionality,
     * or if it returns another function it is called for each block comment.
     *
     * Look at [src/plugins/](/tree/master/src/plugins/) folder to see
     * the built-in ones.
     *
     * @example
     * import docks from 'docks';
     *
     * const app = docks();
     *
     * // extending the core
     * app.use((self) => {
     *   self.foobar = 123
     * });
     *
     * console.log(app.foobar); // => 123
     *
     * // Or plugin that will be called on each block comment
     * app.use(() => (comment) => {
     *   comment.hoho = 'okey'
     * });
     *
     * @name .use
     * @param {Function} plugin with signature like `(docks) => (comment) => {}`
     * @returns {Object} instance of `Docks`
     * @public
     */
    use(plugin) {
      const res = plugin(app);
      if (typeof res === 'function') {
        docksPlugins.push(res);
      }
      Object.assign(app, res);

      return app;
    },

    /**
     * Parses given `input` using `@babel/parser` and passes
     * all block comments to `doctrine` which is JSDoc parser.
     * It also applies all the "Smart Plugins". Smart plugin is the function
     * that is returned from each function passed to the `app.use` method.
     *
     * @example
     * const app = docks();
     *
     * const smartPlugin = (comment) => {
     *   // do some stuff witht he Comment object.
     * };
     *
     * app.use((self) => smartPlugin);
     *
     * const cmts = app.parse('some cool stuff with block comments');
     * console.log(cmts);
     *
     * @name .parse
     * @param {string} input file content which contains document block comments
     * @returns {Array<Comment>} an array with `Comment` objects.
     * @public
     */
    parse(input) {
      if (input && input.length === 0 && typeof input !== 'string') {
        throw new TypeError('docks: expect an `input` string');
      }
      const codeAST = babylonParse(input, DEFAULT_OPTIONS);
      const comments = getComments(codeAST);
      const docs = comments.map((comment) =>
        docksPlugins.reduce(
          (acc, plugin) => Object.assign({}, acc, plugin(acc, input)),
          comment,
        ),
      );

      return docs;
    },
  };

  // default, built-in plugins
  Object.keys(plugins).forEach((name) => {
    app.use(plugins[name]);
  });

  return app;
}

function getComments(codeAST) {
  const isApi = (tag) => tag.title === 'api' && tag.description === 'public';
  const isPublic = (tag) => tag.title === 'public' || isApi(tag);

  return codeAST.comments
    .filter((comment) => comment.type === 'CommentBlock')
    .map(({ value, start, end, loc }) => {
      const pos = { start, end };
      const { tags } = doctrine.parse(value, { unwrap: true, sloppy: true });
      return { tags, pos, value, loc: { start: loc.start, end: loc.end } };
    })
    .filter((comment) => comment.tags.length)
    .filter((comment) => comment.tags.filter(isPublic).length > 0);
}
