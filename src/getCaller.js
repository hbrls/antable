/* USE AT YOUR OWN RISK */
const CALLER_PRE_POST = /^\s+at |\s+\(.*$|@.*$/ig;
const FLAG = /handleTableChange$/;


export default function getCaller() {
  const err = new Error('MAGIC GET_CALLER EXCEPTION');
  const stack = err.stack.split('\n');

  stack.unshift('UNSHIFT');

  while (stack.shift()) {
    const caller = stack[0].replace(CALLER_PRE_POST, '');
    if (FLAG.test(caller)) {
      let next = stack[1].replace(CALLER_PRE_POST, '');
      if (next === caller || next === '[native code]') {
        stack.shift();
        next = stack[1].replace(CALLER_PRE_POST, '');
      }
      return next;
    }
  }

  throw err;
}
