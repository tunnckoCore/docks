export default function paramsPlugin() {
  return (comment) => {
    const params = [];

    const tags = comment.tags
      .map((tag) => {
        if (tag.title !== 'param') {
          return tag;
        }

        tag.isOptional = tag.type.type === 'OptionalType';
        tag.isRequired = !tag.isOptional;

        if (tag.name.includes('.')) {
          tag.isChild = true;
        } else {
          tag.isChild = false;
        }

        tag.description = tag.description || '';

        if (tag.name === 'null') {
          const re = /^`(.+)`\s+/;
          const m = re.exec(tag.description);

          if (m && m[1]) {
            tag = {
              ...tag,
              name: m[1],
              description: tag.description.replace(re, ''),
            };
          }
        }

        if (tag.type.expression && !tag.type.applications) {
          tag.type.name = tag.type.expression.name;
        } else if (tag.type.expression && tag.type.applications) {
          tag.type.name = `${tag.type.expression.name}<${
            tag.type.applications[0].name
          }>`;
        }

        params.push(tag);

        return false;
      })
      .filter(Boolean);

    return { tags, params };
  };
}
