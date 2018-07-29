_Generated using [docks](http://npm.im/docks)._


### [src/index.js](/src/index.js)

#### [docks](/src/index.js#L47)
Constructor that gives you methods.

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





