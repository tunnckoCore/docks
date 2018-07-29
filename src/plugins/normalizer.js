export default function normalizerPlugin() {
  return (comment) => {
    let name = null;

    comment.tags.forEach((tag) => {
      if (tag.title === 'name') {
        name = tag.name
          .trim()
          .replace(/^null/, '')
          .trim();
      }
    });

    return { name };
  };
}
