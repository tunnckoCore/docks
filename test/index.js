import path from 'path';
import proc from 'process';
import test from 'asia';
import docks from '../src';

const app = docks();

test('todo tests', async (t) => {
  const filepath = path.join(proc.cwd(), 'src', 'plugins', 'render.js');
  const text = await app.renderFile(filepath);
  // console.log(text)
  t.ok(text);
});
