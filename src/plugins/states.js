export default function statesPlugin() {
  return (comment) => {
    const cmt = {};

    const tags = comment.tags
      .map((tag) => {
        if (/returns?/.test(tag.title)) {
          const desc = tag.description || '';

          if (tag.type.expression && !tag.type.applications) {
            tag.type.name = tag.type.expression.name;
          } else if (tag.type.expression && tag.type.applications) {
            tag.type.name = `${tag.type.expression.name}<${
              tag.type.applications[0].name
            }>`;
          }

          cmt.return = { description: desc, type: tag.type };
          return null;
        }

        if (['public', 'private', 'protected'].includes(tag.title)) {
          cmt[tag.title] = true;
          return null;
        }

        if (tag.title === 'api') {
          cmt[tag.description] = true;
          return null;
        }

        return tag;
      })
      .filter(Boolean);

    return { ...cmt, tags };
  };
}
