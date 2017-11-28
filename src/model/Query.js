export default function Query(id, query) {
  if (!query) {
    query = id; // eslint-disable-line no-param-reassign
    id = '_antable';  // eslint-disable-line no-param-reassign
  }

  this.id = id;
  this.query = {};

  if (typeof query === 'undefined') {
    return; // eslint-disable-line no-useless-return
  } else if (typeof query === 'string') {
    this.parse(query);
  } else {
    this.parse(query[id]);
  }
}


// ?Users=pg|2;kw|xu;authorized|false
Query.prototype.parse = function (search) {
  const params = search ? search.split(';') : [];

  const query = {};
  if (params.length > 0) {
    for (let i = 0; i < params.length; i += 1) {
      const [k, v] = params[i].split('|');
      query[k] = v;
    }
  }

  this.query = query;
};


Query.prototype.merge = function (next) {
  this.query = Object.assign({}, this.query, next);
};


Query.prototype.getField = function (field) {
  return this.query[field];
};


Query.prototype.setField = function (field, value) {
  this.query[field] = value;
};


Query.prototype.next = function () {
  const query = this.query;
  const qs = [];
  Object.keys(query).forEach((field) => {
    const value = query[field];
    if (value) {
      qs.push(`${field}|${value}`);
    }
  });
  return { [this.id]: qs.join(';') };
};
