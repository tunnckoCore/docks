export default function tagsPlugin() {
  return (comment) => {
    const tags = [];

    comment.tags.forEach((tag) => {
      if (tag.title !== 'name') {
        tags.push(tag);
      }
    });

    return { tags };
  };
}
