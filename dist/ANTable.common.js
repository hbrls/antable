/*! @lattebank/antable v0.0.2 (c) 2017 */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

var ANTable = (function (Component$$1) {
  function ANTable(props) {
    Component$$1.call(this, props);

    this.state = {};
  }

  if ( Component$$1 ) ANTable.__proto__ = Component$$1;
  ANTable.prototype = Object.create( Component$$1 && Component$$1.prototype );
  ANTable.prototype.constructor = ANTable;

  ANTable.prototype.render = function render () {
    return React__default.createElement( 'h1', null, "Hello ANTable" );
  };

  return ANTable;
}(React.Component));

module.exports = ANTable;
