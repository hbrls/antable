import Query from '../model/Query.js';


export default function translate(props) {
  let dataSource = props.dataSource.toJS ? props.dataSource.toJS() : props.dataSource;
  let { columns } = props;

  const searchColumns = columns.filter(c => c.search === 'string').map(c => c);

  const computedColumns = columns.filter(c => c.computed).map(c => c);
  if (computedColumns.length > 0) {
    dataSource.forEach((d) => {
      computedColumns.forEach((c) => {
        const key = c.dataIndex;
        d[key] = c.computed(d); // eslint-disable-line no-param-reassign
      });
    });
  }

  const prev = new Query(props.id, props.location.query);

  const _query = {
    pg: prev.getField('pg'),
    kw: prev.getField('kw'),
    sb: prev.getField('sb'),
  };

  const _filters = Object.assign({}, prev.query);
  delete _filters.pg;
  delete _filters.kw;
  delete _filters.sb;

  const fields = columns.filter(c => c.form);

  let sortByField;
  let sortByOrder;
  if (_query.sb) {
    sortByField = _query.sb.substring(0, _query.sb.length - 1);
    sortByOrder = _query.sb.substring(_query.sb.length - 1);
    const SYMBOLS = {
      '↑': 'ascend',
      '↓': 'descend',
    };
    sortByOrder = SYMBOLS[sortByOrder];
  }

  columns = columns.filter(c => c.key);

  columns = columns.map((c) => {
    let col = Object.assign({}, c);
    const key = col.dataIndex;

    if (col.search === 'radio') {
      const values = dataSource.map(d => d[key]);
      const unique = Array.from(new Set(values));

      if (!col.filters) {
        col.filters = unique.map(u => ({ text: u, value: u }));
      }
      col.filterMultiple = false;
      const filteredValue = _filters[key];
      col.filteredValue = filteredValue ? [filteredValue] : [];
    }

    if (col.sorter) {
      col.sorter = function (a, b) {
        const va = a[key];
        const vb = b[key];
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

  return {
    dataSource,
    columns,
    searchColumns,
    fields,
    _query,
    _filters,
  };
}
