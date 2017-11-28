/*! @lattebank/antable v0.0.2 (c) 2017 */
'use strict';

function getPreserve(page) {
  return function preserve(id, next) {
    var ref = page.props.location;
    var pathname = ref.pathname;
    var query = ref.query;

    if (next) {
      query[id] = next;
    } else {
      delete query[id];
    }

    var location = { pathname: pathname, query: query };

    page.context.router.push(location);
  };
}

function antable(page) {
  var props = {};

  props.preserve = getPreserve(page);

  props.query = page.props.location.query;

  return props;
}

module.exports = antable;
