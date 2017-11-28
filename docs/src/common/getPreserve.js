import getQuery from './getQuery';


export default function getPreserve() {
  return function preserve(id, next) {
    const { router } = this.props;

    const query = getQuery(router.getRoute(0), 'queryKey');
    query[id] = next;

    const qs = Object.keys(query).filter(k => k && query[k]).map(k => `${k}=${query[k]}`);

    if (qs.length > 0) {
      router.setRoute(`/?${qs.join('&')}`);
    } else {
      router.setRoute('/');
    }

    const trigger = this.state.trigger + 1;
    this.setState({ trigger });
  };
}
