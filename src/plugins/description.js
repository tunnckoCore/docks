export default function descriptionPlugin() {
  return (comment) => {
    let found = 0;

    const description = comment.value
      .split('\n')
      .slice(1, -1)
      .map((x) => x.trim())
      .map((line, idx) => {
        if (found && found < idx) {
          return null;
        }
        if (!found && line.startsWith('* @')) {
          found = idx;
          return null;
        }
        return line;
      })
      .filter(Boolean)
      .map((x) => x.slice(1).replace(/^\s{1}/, ''))
      .join('\n');

    return { description };
  };
}
