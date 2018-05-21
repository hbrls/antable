import React from 'react';
import ATable from '../../../src/ATable.jsx';


export default function CompanyTable(props) {
  const columns = [
    {
      title: '公司',
      dataIndex: 'company',
      search: 'string',
      // searchIncludes: ['email'],
      key: 'company',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
  ];

  return <ATable id="Company" columns={columns} rowKey="id" {...props} />;
}
