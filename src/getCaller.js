/* USE AT YOUR OWN RISK */
const CALLER_PRE_POST = /^\s+at |\s+\(.*$|@.*$/ig;
const PREV_FLAG = /handleTableChange$/;
const SELF_FLAG = /handlePageChange/;


export default function getCaller() {
  const err = new Error('MAGIC GET_CALLER EXCEPTION');
  const stack = err.stack.split('\n');

  stack.unshift('UNSHIFT');

  while (stack.shift()) {
    if (stack.length === 0) {
      return 'MAGIC GET_CALLER PASS';
    }

    const caller = stack[0].replace(CALLER_PRE_POST, '');
    if (PREV_FLAG.test(caller)) {
      let next = stack[1].replace(CALLER_PRE_POST, '');
      if (next === caller || next === '[native code]') {
        stack.shift();
        next = stack[1].replace(CALLER_PRE_POST, '');
      }
      return next;
    } else if (SELF_FLAG.test(caller)) {
      return caller.replace(CALLER_PRE_POST, '');
    }
  }

  throw err;
}
