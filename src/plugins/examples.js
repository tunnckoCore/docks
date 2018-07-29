export default function examplesPlugin() {
  return (comment) => {
    const examples = [];

    const tags = comment.tags
      .map((tag) => {
        if (tag.title !== 'example') {
          return tag;
        }

        const regex = /^(?:```)?(\w+)\n+/;
        const m = regex.exec(tag.description);
        const lang = (m && m[1]) || 'javascript';
        const code = tag.description.replace(regex, '');

        examples.push({
          code: regex.test(tag.description) ? code.replace(/\n?```/, '') : code,
          lang,
        });

        return null;
      })
      .filter(Boolean);

    return { tags, examples };
  };
}
