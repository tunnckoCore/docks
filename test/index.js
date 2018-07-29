import test from 'asia';
import docks from '../src';

const app = docks();

test('foo bar', (t) => {
  const cmts = app.parse('str');
  console.log(cmts.length);
  t.ok(true);
});
