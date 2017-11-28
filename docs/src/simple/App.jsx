import React, { Component } from 'react';
import axios from 'axios'; // eslint-disable-line import/no-extraneous-dependencies
import Immutable from 'immutable';
import getPreserve from '../common/getPreserve';
import getQuery from '../common/getQuery';
import UserTable from './UserTable';
import CompanyTable from './CompanyTable';


export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      users: Immutable.fromJS([]),
      companies: Immutable.fromJS([]),
      trigger: 0,
    };

    this.preserve = getPreserve().bind(this);
  }

  componentDidMount() {
    axios.get('/api/users.json').then(({ data: { users } }) => this.setState({
      users: Immutable.fromJS(users),
      companies: Immutable.fromJS(users),
      loading: false,
    }));
  }

  preserve() {
    console.log(this);
  }

  render() {
    const { loading } = this.state;
    const { users, companies } = this.state;

    const query = getQuery(this.props.router.getRoute(0), 'queryKey');
    // console.log(query);

    return (
      <div>
        <UserTable dataSource={users} query={query} preserve={this.preserve} loading={loading} />
        <CompanyTable dataSource={companies} query={query} preserve={this.preserve} loading={loading} />
      </div>
    );
  }
}
