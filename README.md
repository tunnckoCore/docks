# docks [![npm version][npmv-img]][npmv-url] [![github release][ghrelease-img]][ghrelease-url] [![License][license-img]][license-url]

<!-- When logo is needed
<p align="center">
  <a href="https://github.com/username/repo">
    <img src="./logo.png">
  </a>
</p>
<br>
-->

> Extensible system for parsing and generating documentation. It just freaking works!

<div id="thetop"></div>

[![XAXA code style][codestyle-img]][codestyle-url]
[![CircleCI linux build][linuxbuild-img]][linuxbuild-url]
[![CodeCov coverage status][codecoverage-img]][codecoverage-url]
[![DavidDM dependency status][dependencies-img]][dependencies-url]
[![Renovate App Status][renovateapp-img]][renovateapp-url]
[![Make A Pull Request][prs-welcome-img]][prs-welcome-url]
[![Semantically Released][new-release-img]][new-release-url]

If you have any _how-to_ kind of questions, please read the [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md) documents.  
For bugs reports and feature requests, [please create an issue][open-issue-url] or ping [@tunnckoCore](https://twitter.com/tunnckoCore) at Twitter.

[![Conventional Commits][ccommits-img]][ccommits-url]
[![PayPal Author Support][paypal-donate-img]][paypal-donate-url]
[![Share Love Tweet][shareb]][shareu]
[![NPM Downloads Weekly][downloads-weekly-img]][npmv-url]
[![NPM Downloads Monthly][downloads-monthly-img]][npmv-url]
[![NPM Downloads Total][downloads-total-img]][npmv-url]

Project is [semantically](https://semver.org) & automatically released on [CircleCI][codecoverage-url] with [new-release][] and its [New Release](https://github.com/apps/new-release) GitHub App.

## Table of Contents
- [Install](#install)
- [API](#api)
  * [src/index.js](#srcindexjs)
    + [docks](#docks)
    + [.use](#use)
    + [.parse](#parse)
  * [src/plugins/render.js](#srcpluginsrenderjs)
    + [.renderFileSync](#renderfilesync)
    + [.renderFile](#renderfile)
    + [.renderTextSync](#rendertextsync)
    + [.renderText](#rendertext)
    + [.renderSync](#rendersync)
    + [.render](#render)
- [Related Projects](#related-projects)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [Users](#users)
- [License](#license)

## Install
This project requires [**Node.js**](https://nodejs.org) **^8.9.0 || ^10.6.0**. Install it using [**yarn**](https://yarnpkg.com) or [**npm**](https://npmjs.com).  
_We highly recommend to use Yarn when you think to contribute to this project._

```bash
$ yarn add docks
```

## API
_Generated using [docks](http://npm.im/docks)._

### [src/index.js](/src/index.js)

#### [docks](/src/index.js#L47)
> Constructor that gives you methods.

**Returns**
- `Object` instance of `Docks`

#### [.use](/src/index.js#L80)
A plugin is a function that may extend the core functionality,
or if it returns another function it is called for each block comment.

Look at [src/plugins/](/tree/master/src/plugins/) folder to see
the built-in ones.

**Params**
- `plugin` **{Function}** with signature like `(docks) => (comment) => {}`

**Returns**
- `Object` instance of `Docks`

**Examples**
```javascript
import docks from 'docks';

const app = docks();

// extending the core
app.use((self) => {
  self.foobar = 123
});

console.log(app.foobar); // => 123

// Or plugin that will be called on each block comment
app.use(() => (comment) => {
  comment.hoho = 'okey'
});
```

#### [.parse](/src/index.js#L113)
Parses given `input` using `@babel/parser` and passes
all block comments to `doctrine` which is JSDoc parser.
It also applies all the "Smart Plugins". Smart plugin is the function
that is returned from each function passed to the `app.use` method.

**Params**
- `input` **{string}** file content which contains document block comments

**Returns**
- `Array<Comment>` an array with `Comment` objects.

**Examples**
```javascript
const app = docks();

const smartPlugin = (comment) => {
  // do some stuff witht he Comment object.
};

app.use((self) => smartPlugin);

const cmts = app.parse('some cool stuff with block comments');
console.log(cmts);
```

### [src/plugins/render.js](/src/plugins/render.js)

#### [.renderFileSync](/src/plugins/render.js#L50)
Render single `fp` file to a documentation string.

**Params**
- `fp` **{string}** absolute filepath to file to look for doc comments.

**Returns**
- `string`

**Examples**
```javascript
const app = docks();
const output = app.renderFileSync('path/to/source/file/with/comments');
console.log(output);
```

#### [.renderFile](/src/plugins/render.js#L70)
Render single `fp` file to a documentation string, asynchronously.

**Params**
- `fp` **{string}** absolute file path to look for doc comments.

**Returns**
- `Promise<string>`

**Examples**
```javascript
const app = docks();
app.renderFile('path/to/source/file/with/comments').then((output) => {
  console.log(output);
});
```

#### [.renderTextSync](/src/plugins/render.js#L95)
Create a documentation output string from given comments.
Use `app.parse` method to generate such list of `Comment` objects.

**Params**
- `comments` **{Array&lt;Comment&gt;}**

**Returns**
- `string`

**Examples**
```javascript
const app = docks();

const comments = app.parse('some string with block comments');
const output = app.renderTextSync(comments);
console.log(output);
```

#### [.renderText](/src/plugins/render.js#L116)
Create a documentation output string from given comments, asynchronously.
Use `app.parse` method to generate such list of `Comment` objects.

**Params**
- `comments` **{Array&lt;Comment&gt;}**

**Returns**
- `Promise<string>`

**Examples**
```javascript
const app = docks();

const comments = app.parse('some string with block comments');
app.renderText(comments).then((output) => {
  console.log(output);
});
```

#### [.renderSync](/src/plugins/render.js#L140)
Render a list of filepaths to a documentation string.

**Params**
- `files` **{Array&lt;string&gt;}** list of absolute file paths to look for doc comments.

**Returns**
- `string`

**Examples**
```javascript
const proc = require('process');
const path = require('path');
const app = docks();

const files = ['src/index.js', 'src/bar.js'].map((fp) => {
  return path.join(proc.cwd(), fp);
})

const output = app.renderSync(files);
console.log(output);
```

#### [.render](/src/plugins/render.js#L170)
Render a list of filepaths to a documentation, asynchronously.

**Params**
- `files` **{Array&lt;string&gt;}** list of absolute file paths to look for doc comments.

**Returns**
- `Promise<string>`

**Examples**
```javascript
const proc = require('process');
const path = require('path');
const app = docks();

const files = ['src/index.js', 'src/bar.js'].map((fp) => {
  return path.join(proc.cwd(), fp);
})

app.render(files).then((output) => {
  console.log(output);
});
```

**[back to top](#thetop)**

## Related Projects
Some of these projects are used here or were inspiration for this one, others are just related. So, thanks for your existance!
- [asia](https://www.npmjs.com/package/asia): Blazingly fast, magical and minimalist testing framework, for Today and Tomorrow | [homepage](https://github.com/olstenlarck/asia#readme "Blazingly fast, magical and minimalist testing framework, for Today and Tomorrow")
- [charlike](https://www.npmjs.com/package/charlike): Small, fast, simple and streaming project scaffolder for myself, but not… [more](https://github.com/tunnckoCore/charlike) | [homepage](https://github.com/tunnckoCore/charlike "Small, fast, simple and streaming project scaffolder for myself, but not only. Supports hundreds of template engines through the @JSTransformers API or if you want custom `render` function passed through options")
- [gitcommit](https://www.npmjs.com/package/gitcommit): Lightweight and joyful `git commit` replacement. Conventional Commits compliant. | [homepage](https://github.com/tunnckoCore/gitcommit "Lightweight and joyful `git commit` replacement. Conventional Commits compliant.")
- [new-release](https://www.npmjs.com/package/new-release): A stable alternative to [semantic-release][]. Only handles NPM publishing and nothing… [more](https://github.com/tunnckoCore/new-release#readme) | [homepage](https://github.com/tunnckoCore/new-release#readme "A stable alternative to [semantic-release][]. Only handles NPM publishing and nothing more. For creating GitHub releases use the Semantic Release GitHub App")
- [xaxa](https://www.npmjs.com/package/xaxa): Zero-config linting, powered by few amazing unicorns, AirBnB & Prettier. | [homepage](https://github.com/olstenlarck/xaxa "Zero-config linting, powered by few amazing unicorns, AirBnB & Prettier.")

**[back to top](#thetop)**

## Contributing
Please read the [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md) documents for advices.  
For bugs reports and feature requests, [please create an issue][open-issue-url] or ping [@tunnckoCore](https://twitter.com/tunnckoCore) at Twitter.

## Contributors
Thanks to the hard work of [these wonderful people](./CONTRIBUTORS.md) this project is alive and it also follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification.  
[Pull requests](https://github.com/tunnckoCore/contributing#opening-a-pull-request), stars and all kind of [contributions](https://opensource.guide/how-to-contribute/#what-it-means-to-contribute) are always welcome. :stars:

## Users
You can see who uses `docks` in the [USERS.md](./USERS.md) file. Please feel free adding this file if it not exists.  
If you or your organization are using this project, consider adding yourself to the list of users.  
**Thank You!** :heart:

## License
Copyright (c) 2018-present, [Charlike Mike Reagent][author-link] `<olsten.larck@gmail.com>`.  
Released under the [Apache-2.0 License][license-url].

---

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.7.0, on July 30, 2018._

<!-- Heading badges -->
[npmv-url]: https://www.npmjs.com/package/docks
[npmv-img]: https://badgen.net/npm/v/docks?label=npm%20version

[ghrelease-url]: https://github.com/olstenlarck/docks/releases/latest
[ghrelease-img]: https://badgen.net/github/release/olstenlarck/docks?label=github%20release

[license-url]: https://github.com/olstenlarck/docks/blob/master/LICENSE
[license-img]: https://badgen.net/npm/license/docks

<!-- Front line badges -->

[codestyle-url]: https://github.com/olstenlarck/xaxa
[codestyle-img]: https://badgen.net/badge/code%20style/xaxa/green

[linuxbuild-url]: https://circleci.com/gh/olstenlarck/docks/tree/master
[linuxbuild-img]: https://badgen.net/circleci/github/olstenlarck/docks/master

[codecoverage-url]: https://codecov.io/gh/olstenlarck/docks
[codecoverage-img]: https://codecov.io/gh/olstenlarck/docks/branch/master/graph/badge.svg

[dependencies-url]: https://david-dm.org/olstenlarck/docks
[dependencies-img]: https://badgen.net/david/dep/olstenlarck/docks

[ccommits-url]: https://conventionalcommits.org/
[ccommits-img]: https://badgen.net/badge/conventional%20commits/v1.0.0/dfb317

[new-release-url]: https://github.com/tunnckoCore/new-release
[new-release-img]: https://badgen.net/badge/semantically/released/05c5ff

[downloads-weekly-img]: https://badgen.net/npm/dw/docks
[downloads-monthly-img]: https://badgen.net/npm/dm/docks
[downloads-total-img]: https://badgen.net/npm/dt/docks

[renovateapp-url]: https://renovatebot.com
[renovateapp-img]: https://badgen.net/badge/renovate/enabled/green

[prs-welcome-img]: https://badgen.net/badge/PRs/welcome/green
[prs-welcome-url]: http://makeapullrequest.com

[paypal-donate-url]: https://paypal.me/tunnckoCore/10
[paypal-donate-img]: https://badgen.net/badge/$/support/purple

[shareu]: https://twitter.com/intent/tweet?text=https://github.com/olstenlarck/docks&via=tunnckoCore
[shareb]: https://badgen.net/badge/twitter/share/1da1f2
[open-issue-url]: https://github.com/olstenlarck/docks/issues/new
[author-link]: https://i.am.charlike.online

[new-release]: https://github.com/tunnckoCore/new-release
[semantic-release]: https://github.com/semantic-release/semantic-release