export default function getPreserve(page) {
  return function preserve(id, next) {
    const { pathname, query } = page.props.location;

    if (next) {
      query[id] = next;
    } else {
      delete query[id];
    }

    const location = { pathname: pathname, query: query };

    page.context.router.push(location)
  };
}
