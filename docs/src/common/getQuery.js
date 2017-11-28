import parseUri from 'vanilla.js/uri/parseUri'; // eslint-disable-line  import/no-extraneous-dependencies


// http://stackoverflow.com/a/1842787/707580
const REMOVE_K = /&_k(=[^&]*)?|^_k(=[^&]*)?&?/;


export default function getQuery(query, k1, k2) {
  const q = parseUri(query.replace(REMOVE_K, ''));

  if (k1) {
    if (k2) {
      return q[k1][k2];
    } else {
      return q[k1];
    }
  } else {
    return q;
  }
}
