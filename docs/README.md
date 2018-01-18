antable
==

another table

Examples
==

1. [Simple](./simple.html)

How To
==

1. columns

    ```javascript
    const columns = [
      {
        title: '姓名',               // <- 显示在搜索框里的文字
        dataIndex: 'name',
        search: 'string',           // <- 会被用来搜索
        searchIncludes: ['email'],  // <- 也会被用来搜索，但不会显示在搜索框里的文字
        sorter: true,  // <- 只有一个 sorter 会生效，遵守 antd 的交互规范
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
        computed: record => record.friends.map(f => f.name).join(', '),  // <- 类似 vue 的 computed，计算结果被用来搜索
        search: 'string',
        key: 'friends',
      },
      {
        title: 'Gender',
        dataIndex: 'gender',
        search: 'radio',  // <- 下拉单选形式的搜索
        key: 'gender',
        filters: [  // <- 如果你不提供 options，会自己从现有数据中总结出来
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
    ```

2. id

    ```
    <ANTable id="User" />  // <- 如果不提供 id，会使用默认的 _antable
    ```

3. query

    ```
    ?Users=pg|2;kw|xu;sb|name↓;gender|male
    // pageSize=10，默认不可改
    // page，当前分页在第 2 页
    // keyword，搜索框中的关键词是 xu
    // sortBy，按 name 降序
    // 剩下的都是 filters
    ```

4. preserve，较复杂，暂时仅提供针对 react-router@3 和 dva@1 的适配
