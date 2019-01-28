"use strict";function toArray(e,t){t=t||0;for(var r=e.length-t,n=new Array(r
);r--;)n[r]=e[r+t];return n}function Vue(){return this._events=Object.create(
null),this}Vue.prototype.$on=function(e,t){var r=this;return(r._events[e]||(
r._events[e]=[])).push(t),r},Vue.prototype.$once=function(e,t){var r=this
;function n(){r.$off(e,n),t.apply(r,arguments)}return n.fn=t,r.$on(e,n),r},
Vue.prototype.$off=function(e,t){var r=this;if(!arguments.length
)return r._events=Object.create(null),r;var n,i=r._events[e];if(!i)return r;if(
1===arguments.length)return r._events[e]=null,r;for(var a=i.length;a--;)if((
n=i[a])===t||n.fn===t){i.splice(a,1);break}return r},
Vue.prototype.$emit=function(e){var t=this,r=t._events[e];if(r){
r=1<r.length?toArray(r):r;for(var n=toArray(arguments,1),i=0,a=r.length;i<a;i++
)r[i].apply(t,n)}return t};var $dispatcher=new Vue
;$dispatcher.on=$dispatcher.$on.bind($dispatcher),
$dispatcher.once=$dispatcher.$once.bind($dispatcher),
$dispatcher.off=$dispatcher.$off.bind($dispatcher),
$dispatcher.emit=$dispatcher.$emit.bind($dispatcher);var head=window.head||{}
;head.bus=$dispatcher;
