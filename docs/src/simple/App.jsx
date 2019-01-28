import React, { Component } from 'react';
import axios from 'axios'; // eslint-disable-line import/no-extraneous-dependencies
import Immutable from 'immutable';
// import getQuery from '../common/getQuery';
import UserTable from './UserTable';
// import CompanyTable from './CompanyTable';


export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      users: Immutable.fromJS([]),
      companies: Immutable.fromJS([]),
      trigger: 0,
    };
  }

  componentDidMount() {
    head.bus.on('trigger', () => {
      this.setState({ trigger: this.state.trigger + 1 });
    });

    axios.get('./api/users.json').then(({ data: { users } }) => this.setState({
      users: Immutable.fromJS(users),
      // companies: Immutable.fromJS(users),
      loading: false,
    }));
  }

  render() {
    const { store, router } = this.props;
    // console.log(store, router);

    const { loading } = this.state;
    const { users } = this.state;

    // const query = getQuery(this.props.router.getRoute(0), 'queryKey');
    // console.log(query);

    return (
      <div className={`trigger-${this.state.trigger}`}>
        <UserTable store={store} router={router} dataSource={users} loading={loading} />
      </div>
    );
  }
}
