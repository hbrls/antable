/*! @lattebank/atable v0.0.5 (c) 2017-present */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var Table = _interopDefault(require('antd/lib/table'));
var Popover = _interopDefault(require('antd/lib/popover'));
var Input = _interopDefault(require('antd/lib/input'));

function Query(id, query) {
  if (!query) {
    query = id; // eslint-disable-line no-param-reassign
    id = '_atable';  // eslint-disable-line no-param-reassign
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
  var params = search ? search.split(';') : [];

  var query = {};
  if (params.length > 0) {
    for (var i = 0; i < params.length; i += 1) {
      var ref = params[i].split('|');
      var k = ref[0];
      var v = ref[1];
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
  var query = this.query;
  var qs = [];
  Object.keys(query).forEach(function (field) {
    var value = query[field];
    if (value) {
      qs.push((field + "|" + value));
    }
  });
  return ( obj = {}, obj[this.id] = qs.join(';'), obj );
  var obj;
};

function translate(props) {
  var dataSource = props.dataSource.toJS ? props.dataSource.toJS() : props.dataSource;
  var columns = props.columns;

  var searchColumns = columns.filter(function (c) { return c.search === 'string'; }).map(function (c) { return c; });

  var computedColumns = columns.filter(function (c) { return c.computed; }).map(function (c) { return c; });
  if (computedColumns.length > 0) {
    dataSource.forEach(function (d) {
      computedColumns.forEach(function (c) {
        var key = c.dataIndex;
        d[key] = c.computed(d); // eslint-disable-line no-param-reassign
      });
    });
  }

  var prev = new Query(props.id, props.query);

  var _query = {
    pg: prev.getField('pg'),
    kw: prev.getField('kw'),
    sb: prev.getField('sb'),
  };

  var _filters = Object.assign({}, prev.query);
  delete _filters.pg;
  delete _filters.kw;
  delete _filters.sb;

  var fields = columns.filter(function (c) { return c.form; });

  var sortByField;
  var sortByOrder;
  if (_query.sb) {
    sortByField = _query.sb.substring(0, _query.sb.length - 1);
    sortByOrder = _query.sb.substring(_query.sb.length - 1);
    var SYMBOLS = {
      '↑': 'ascend',
      '↓': 'descend',
    };
    sortByOrder = SYMBOLS[sortByOrder];
  }

  columns = columns.filter(function (c) { return c.key; });

  columns = columns.map(function (c) {
    var col = Object.assign({}, c);
    var key = col.dataIndex;

    if (col.search === 'radio') {
      var values = dataSource.map(function (d) { return d[key]; });
      var unique = Array.from(new Set(values));

      if (!col.filters) {
        col.filters = unique.map(function (u) { return ({ text: u, value: u }); });
      }
      col.filterMultiple = false;
      var filteredValue = _filters[key];
      col.filteredValue = filteredValue ? [filteredValue] : [];
    }

    if (col.sorter) {
      col.sorter = function (a, b) {
        var va = a[key];
        var vb = b[key];
        if (va > vb) {
          return 1;
        } else if (va < vb) {
          return -1;
        } else {
          return 0;
        }
      };

      if (key === sortByField) {
        col.sortOrder = sortByOrder;
      }
    }

    return col;
  });

  var rowKey = props.rowKey;
  var create = props.create;
  var edit = props.edit;
  var remove = props.remove;

  // FIXME:
  if (create && edit && remove) {
    columns.push({
      title: React__default.createElement( 'a', { className: "ant-btn ant-btn-sm ant-btn-primary", onClick: create }, "创建"),
      key: 'operations',
      className: 'text-right',
      render: function (text, record) { return (
        React__default.createElement( 'div', null,
          React__default.createElement( 'a', { className: "ant-btn ant-btn-sm", onClick: function () { return edit(record[rowKey]); } }, "编辑"),
          React__default.createElement( 'span', { className: "ant-divider ant-divider-space-only" }),
          React__default.createElement( Popover, { content: React__default.createElement( 'a', { className: "ant-btn ant-btn-sm", onClick: function () { return remove(record[rowKey]); } }, "删除"), title: "确认删除", trigger: "hover", placement: "right" },
            React__default.createElement( 'a', { className: "ant-btn ant-btn-sm" }, "删除")
          )
        )); },
    });
  }

  return {
    dataSource: dataSource,
    columns: columns,
    searchColumns: searchColumns,
    fields: fields,
    _query: _query,
    _filters: _filters,
  };
}

/* USE AT YOUR OWN RISK */
var CALLER_PRE_POST = /^\s+at |\s+\(.*$|@.*$/ig;
var PREV_FLAG = /handleTableChange$/;
var SELF_FLAG = /handlePageChange/;


function getCaller() {
  var err = new Error('MAGIC GET_CALLER EXCEPTION');
  var stack = err.stack.split('\n');

  stack.unshift('UNSHIFT');

  while (stack.shift()) {
    if (stack.length === 0) {
      return 'MAGIC GET_CALLER PASS';
    }

    var caller = stack[0].replace(CALLER_PRE_POST, '');
    if (PREV_FLAG.test(caller)) {
      var next = stack[1].replace(CALLER_PRE_POST, '');
      if (next === caller || next === '[native code]') {
        stack.shift();
        next = stack[1].replace(CALLER_PRE_POST, '');
      }
      return next;
    } else if (SELF_FLAG.test(caller)) {
      return caller.replace(CALLER_PRE_POST, '');
    }
  }

  throw err;
}

var Search = Input.Search;


function getPrettyPlaceholder(columns) {
  var cols = columns.slice(0);
  var lastCol = cols.pop();
  if (cols.length === 0) {
    return ("按 " + lastCol + " 搜索");
  } else {
    var s = cols.join(', ');
    return ("按 " + s + " 或 " + lastCol + " 搜索");
  }
}


function ClearIcon(props) {
  var style = {
    position: 'absolute',
    top: 8,
    right: 28,
    zIndex: 1,
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.15)',
  };
  return React__default.createElement( 'i', { className: "anticon anticon-close-circle", style: style, onClick: props.onClick }); // eslint-disable-line jsx-a11y/no-static-element-interactions
}


var SearchBar = (function (Component$$1) {
  function SearchBar(props) {
    Component$$1.call(this, props);

    this.state = {
      placeholder: getPrettyPlaceholder(props.columns.map(function (c) { return c.title; })),
      hover: false,
    };

    this.hover = this.hover.bind(this);
    this.clear = this.clear.bind(this);
  }

  if ( Component$$1 ) SearchBar.__proto__ = Component$$1;
  SearchBar.prototype = Object.create( Component$$1 && Component$$1.prototype );
  SearchBar.prototype.constructor = SearchBar;

  SearchBar.prototype.hover = function hover (bool) {
    this.setState({ hover: bool });
  };

  SearchBar.prototype.clear = function clear () {
    var input = this.textInput.input.refs.input;
    input.value = '';
    this.props.search('');
  };

  SearchBar.prototype.render = function render () {
    var this$1 = this;

    var ref = this.state;
    var placeholder = ref.placeholder;

    return (
      React__default.createElement( 'div', { className: "ant-table-searchbar", onMouseEnter: function () { return this$1.hover(true); }, onMouseLeave: function () { return this$1.hover(false); } },
        React__default.createElement( Search, { placeholder: placeholder, defaultValue: this.props.keyword, style: { width: 240 }, onSearch: this.props.search, ref: function (input) { this$1.textInput = input; } }),
        this.state.hover && React__default.createElement( ClearIcon, { onClick: this.clear })
      )
    );
  };

  return SearchBar;
}(React.Component));

var ATable = (function (Component$$1) {
  function ATable(props) {
    Component$$1.call(this, props);

    this.state = translate(props);

    this.handleKeywordChange = this.handleKeywordChange.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.preserve = this.preserve.bind(this);
    this.search = this.search.bind(this);
  }

  if ( Component$$1 ) ATable.__proto__ = Component$$1;
  ATable.prototype = Object.create( Component$$1 && Component$$1.prototype );
  ATable.prototype.constructor = ATable;

  ATable.prototype.componentWillReceiveProps = function componentWillReceiveProps (nextProps) {
    if (nextProps.dataSource !== this.props.dataSource || nextProps.query !== this.props.query) {
      this.setState(translate(nextProps));
    }
  };

  ATable.prototype.getNextQuery = function getNextQuery (delta) {
    if ( delta === void 0 ) delta = {};

    var ref = this.state;
    var _query = ref._query;
    var _filters = ref._filters;

    var next = {
      page: parseInt(_query.pg, 10) || 1,
      keyword: _query.kw,
      filters: _filters,
    };

    if (delta.page) {
      next.page = delta.page;
    }

    if (delta.keyword || delta.keyword === '') {
      next.keyword = delta.keyword;
    }

    if (delta.filters) {
      next.filters = delta.filters;
    } else if (delta.filters === null) {
      next.filters = null;
    }

    if (delta.sorter && delta.sorter.field) {
      var ref$1 = delta.sorter;
      var field = ref$1.field;
      var order = ref$1.order;
      var SYMBOLS = {
        ascend: '↑',
        descend: '↓',
      };
      next.sortBy = "" + field + (SYMBOLS[order]);
    }

    // console.log(next);

    return next;
  };

  ATable.prototype.handleKeywordChange = function handleKeywordChange (keyword) {
    this.preserve({ keyword: keyword, page: 1 });
  };

  ATable.prototype.handleTableChange = function handleTableChange (pagination, filters, sorter) {
    var caller = getCaller();
    // console.log(caller);
    if (caller.indexOf('handlePageChange') > -1) {
      this.preserve({ page: pagination.current });
    } else {
      var flat = {};
      Object.keys(filters).forEach(function (k) {
        var v = filters[k][0]; // search === 'radio'
        if (v) {
          flat[k] = v;
        }
      });
      // console.debug(flat);
      if (Object.keys(flat).length > 0) {
        this.preserve({ page: 1, filters: flat, sorter: sorter });
      } else {
        this.preserve({ page: 1, filters: null, sorter: sorter });
      }
    }
  };

  ATable.prototype.search = function search () {
    var ref = this.props;
    var controlled = ref.controlled;
    var ref$1 = this.state;
    var dataSource = ref$1.dataSource;

    if (!controlled) {
      var ref$2 = this.state;
      var searchColumns = ref$2.searchColumns;
      var ref$3 = this.getNextQuery();
      var keyword = ref$3.keyword;
      var filters = ref$3.filters;

      var sCols = [];
      for (var i = 0; i < searchColumns.length; i += 1) {
        var c = searchColumns[i];
        sCols.push(c.dataIndex);

        if (c.searchIncludes) {
          sCols = sCols.concat(c.searchIncludes);
        }
      }

      if (keyword) {
        dataSource = dataSource.filter(function (d) {
          for (var i = 0; i < sCols.length; i += 1) {
            var name = sCols[i];
            var value = d[name];
            if (value && value.indexOf(keyword) >= 0) {
              return true;
            }
          }

          return false;
        });
      }

      if (filters) {
        Object.keys(filters).forEach(function (key) {
          var value = filters[key];
          dataSource = dataSource.filter(function (d) { return d[key] === value; });
        });
      }

      // // NOTE: if overflow then last page; if zero then 1
      // const pageMax = Math.ceil(dataSource.length / pageSize) || 1;
      // if (pageCurrent > pageMax) {
      //   pageCurrent = pageMax;
      // }
    }

    return dataSource;
  };

  ATable.prototype.preserve = function preserve (delta) {
    var ref = this.getNextQuery(delta);
    var page = ref.page;
    var keyword = ref.keyword;
    var filters = ref.filters;
    var sortBy = ref.sortBy;
    var query = [];

    if (page > 1) {
      query.push(("pg|" + page));
    }

    if (keyword) {
      query.push(("kw|" + keyword));
    }

    if (filters) {
      Object.keys(filters).forEach(function (key) { return query.push((key + "|" + (filters[key]))); });
    }

    if (sortBy) {
      query.push(("sb|" + sortBy));
    }

    this.props.preserve(this.props.id, query.join(';'));
  };

  ATable.prototype.renderSearchBar = function renderSearchBar () {
    if (this.state.searchColumns.length > 0) {
      var ref = this.getNextQuery();
      var keyword = ref.keyword;

      var props = {};
      props.columns = this.state.searchColumns;

      props.search = this.handleKeywordChange;

      props.keyword = keyword;

      return React__default.createElement( SearchBar, props);
    } else {
      return null;
    }
  };

  ATable.prototype.renderTable = function renderTable () {
    var ref = this.state;
    var pageSize = ref.pageSize;
    var columns = ref.columns;
    var ref$1 = this.getNextQuery();
    var page = ref$1.page;

    var props = Object.assign({}, this.props);

    var dataSource = this.search();

    // ** rc-table
    props.dataSource = dataSource;
    props.columns = columns;
    props.className = props.className ? props.className + ' clearfix' : 'clearfix'; // eslint-disable-line prefer-template

    // ** rc-pagination
    if (props.pagination) {
      var pagination = {
        current: page,
        total: props.controlled ? props.controlled.total : dataSource.length,
        pageSize: pageSize,
      };
      props.pagination = pagination;
    }

    props.onChange = this.handleTableChange;

    return React__default.createElement( Table, props);
  };

  ATable.prototype.render = function render () {
    return (
      React__default.createElement( 'div', null,
        this.renderSearchBar(),
        this.renderTable()
      )
    );
  };

  return ATable;
}(React.Component));


ATable.defaultProps = {
  controlled: false,
  pagination: true,
  pageSize: 10,
  size: 'middle',
  id: '_atable',
  query: {},
};


/* shortcut */
ATable.nextQuery = function (form) {
  var sq = new Query();
  sq.merge(form);
  return sq.next();
};

module.exports = ATable;
