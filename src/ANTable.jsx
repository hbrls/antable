import React, { Component } from 'react';
import Table from 'antd/lib/table';
import translate from './utils/translate.js';
import Query from './model/Query';
import getCaller from './getCaller.js';
import SearchBar from './SearchBar.jsx';


export default class ANTable extends Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, translate(props), {
      pageSize: 10,
      searchColumns: props.columns.filter(c => c.search === 'string').map(c => c),
    });

    this.handleKeywordChange = this.handleKeywordChange.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.preserve = this.preserve.bind(this);
    this.search = this.search.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource !== this.props.dataSource || nextProps.query !== this.props.query) {
      this.setState(translate(nextProps));
    }
  }

  getNextQuery(delta = {}) {
    const { _query, _filters } = this.state;

    const next = {
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
      const { field, order } = delta.sorter;
      const SYMBOLS = {
        ascend: '↑',
        descend: '↓',
      };
      next.sortBy = `${field}${SYMBOLS[order]}`;
    }

    // console.log(next);

    return next;
  }

  handleKeywordChange(keyword) {
    this.preserve({ keyword, page: 1 });
  }

  handleTableChange(pagination, filters, sorter) {
    const caller = getCaller();
    // console.log(caller);
    if (caller.indexOf('handlePageChange') > -1) {
      this.preserve({ page: pagination.current });
    } else {
      let flat = {};
      Object.keys(filters).forEach((k) => {
        const v = filters[k][0]; // search === 'radio'
        if (v) {
          flat[k] = v;
        }
      });
      // console.debug(flat);
      if (Object.keys(flat).length > 0) {
        this.preserve({ page: 1, filters: flat, sorter });
      } else {
        this.preserve({ page: 1, filters: null, sorter });
      }
    }
  }

  search() {
    const { controlled } = this.props;
    let { dataSource } = this.state;

    if (!controlled) {
      const { searchColumns } = this.state;
      const { keyword, filters } = this.getNextQuery();

      let sCols = [];
      for (let i = 0; i < searchColumns.length; i += 1) {
        const c = searchColumns[i];
        sCols.push(c.dataIndex);

        if (c.searchIncludes) {
          sCols = sCols.concat(c.searchIncludes);
        }
      }

      if (keyword) {
        dataSource = dataSource.filter((d) => {
          for (let i = 0; i < sCols.length; i += 1) {
            const name = sCols[i];
            const value = d[name];
            if (value && value.indexOf(keyword) >= 0) {
              return true;
            }
          }

          return false;
        });
      }

      if (filters) {
        Object.keys(filters).forEach((key) => {
          const value = filters[key];
          dataSource = dataSource.filter(d => d[key] === value);
        });
      }

      // // NOTE: if overflow then last page; if zero then 1
      // const pageMax = Math.ceil(dataSource.length / pageSize) || 1;
      // if (pageCurrent > pageMax) {
      //   pageCurrent = pageMax;
      // }
    }

    return dataSource;
  }

  preserve(delta) {
    const { page, keyword, filters, sortBy } = this.getNextQuery(delta);
    let query = [];

    if (page > 1) {
      query.push(`pg|${page}`);
    }

    if (keyword) {
      query.push(`kw|${keyword}`);
    }

    if (filters) {
      Object.keys(filters).forEach(key => query.push(`${key}|${filters[key]}`));
    }

    if (sortBy) {
      query.push(`sb|${sortBy}`);
    }

    this.props.preserve(this.props.id, query.join(';'));
  }

  renderSearchBar() {
    if (this.state.searchColumns.length > 0) {
      const { keyword } = this.getNextQuery();

      let props = {};
      props.columns = this.state.searchColumns;

      props.search = this.handleKeywordChange;

      props.keyword = keyword;

      return <SearchBar {...props} />;
    } else {
      return null;
    }
  }

  renderTable() {
    const { pageSize, columns } = this.state;
    const { page } = this.getNextQuery();

    let props = Object.assign({}, this.props);

    const dataSource = this.search();

    // ** rc-table
    props.dataSource = dataSource;
    props.columns = columns;
    props.className = props.className ? props.className + ' clearfix' : 'clearfix'; // eslint-disable-line prefer-template

    // ** rc-pagination
    if (props.pagination) {
      const pagination = {
        current: page,
        total: props.controlled ? props.controlled.total : dataSource.length,
        pageSize,
      };
      props.pagination = pagination;
    }

    props.onChange = this.handleTableChange;

    return <Table {...props} />;
  }

  render() {
    return (
      <div>
        {this.renderSearchBar()}
        {this.renderTable()}
      </div>
    );
  }
}


ANTable.defaultProps = {
  controlled: false,
  pagination: true,
  size: 'middle',
  id: '_antable',
  query: {},
};


/* shortcut */
ANTable.nextQuery = function (form) {
  const sq = new Query();
  sq.merge(form);
  return sq.next();
};
