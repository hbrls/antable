import React from 'react';
import ANTable from '../../../src/ANTable';


export default function UserTable(props) {
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      search: 'string',
      searchIncludes: ['email'],
      sorter: true,
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '好友',
      dataIndex: 'friends',
      computed: record => record.friends.map(f => f.name).join(', '),
      search: 'string',
      key: 'friends',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      search: 'radio',
      key: 'gender',
      filters: [
        { text: '男', value: 'male' },
        { text: '女', value: 'female' },
      ],
    },
    {
      title: 'Eye Color',
      dataIndex: 'eyeColor',
      search: 'radio',
      key: 'eyeColor',
    },
  ];

  return <ANTable id="User" columns={columns} rowKey="id" {...props} />;
}
