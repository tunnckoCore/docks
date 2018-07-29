export default function sourcePlugin() {
  return (comment, input) => {
    const { line } = comment.loc.end;
    const lines = input.split('\n');
    const code = lines[line].trim();

    // In case there is empty line after the block comment,
    // we are getting next non-empty line, which is considered
    // to be the actual start of source code for that comment.
    const next = lines[line + 1].trim();
    const { loc } = comment;
    loc.end.line = code.length > 0 ? line + 1 : line;

    return { source: code.length > 0 ? code : next, loc };
  };
}
