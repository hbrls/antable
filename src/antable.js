import getPreserve from './preserve/arena';


export default function antable(page) {
  const props = {};

  props.preserve = getPreserve(page);

  props.query = page.props.location.query;

  return props;
}
