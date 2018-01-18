/*! @lattebank/antable v0.0.3 (c) 2017 */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var Modal = _interopDefault(require('antd/lib/modal'));
var Spin = _interopDefault(require('antd/lib/spin'));
var Form = _interopDefault(require('antd/lib/form'));
var Input = _interopDefault(require('antd/lib/input'));
var button = _interopDefault(require('antd/lib/button'));
var Select = _interopDefault(require('antd/lib/select'));

var FormItem = Form.Item;
var Option = Select.Option;


var ANForm = (function (Component$$1) {
  function ANForm(props) {
    Component$$1.call(this, props);

    this.submit = this.submit.bind(this);
  }

  if ( Component$$1 ) ANForm.__proto__ = Component$$1;
  ANForm.prototype = Object.create( Component$$1 && Component$$1.prototype );
  ANForm.prototype.constructor = ANForm;

  ANForm.prototype.submit = function submit () {
    var ref = this.props;
    var rowKey = ref.rowKey;
    var columns = ref.columns;
    var dataSource = ref.dataSource;
    var form = ref.form;
    var defaults = dataSource.toJS ? dataSource.toJS() : dataSource;

    var command = {};
    columns.filter(function (c) { return c.form && c.form !== 'readonly' && c.form !== 'hidden'; }).forEach(function (c) {
      command[c.dataIndex] = form.getFieldValue(c.dataIndex);
    });
    command.id = defaults[rowKey];
    command[rowKey] = defaults[rowKey];
    // this.setState({ disabled: true });
    this.props.submit(command);
  };

  ANForm.prototype.render = function render () {
    var ref = this.props;
    var rowKey = ref.rowKey;
    var columns = ref.columns;
    var dataSource = ref.dataSource;
    var loading = ref.loading;

    if (dataSource) {
      var defaults = dataSource.toJS ? dataSource.toJS() : dataSource;
      var id = defaults[rowKey];

      var ref$1 = this.props.form;
      var getFieldDecorator = ref$1.getFieldDecorator;

      var itemLayout = {
        labelCol: {
          xs: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 14 },
        },
      };

      var items = columns.map(function (c) {
        var props = Object.assign({}, itemLayout, {
          label: c.title,
          key: c.dataIndex,
        });

        if (c.form === 'readonly') {
          return (
            React__default.createElement( FormItem, props,
              React__default.createElement( Input, { value: defaults[c.dataIndex], readOnly: true, tabIndex: "-1" })
            )
          );
        } else if (c.form === 'radio') {
          var initialValue = defaults[c.dataIndex] || ' '; // MAGIC
          return (
            React__default.createElement( FormItem, props,
              getFieldDecorator(c.dataIndex, { initialValue: initialValue, rules: [{ required: true, message: ((c.title) + " 必填"), whitespace: true }] })(
                React__default.createElement( Select, null,
                  c.options.map(function (t) { return React__default.createElement( Option, { value: t, key: t }, t); })
                ))
            )
          );
        } else if (c.form === 'hidden') {
          return null;
        } else if (c.form) {
          props.hasFeedback = true;
          return (
            React__default.createElement( FormItem, props,
              getFieldDecorator(c.dataIndex, { initialValue: defaults[c.dataIndex], rules: [{ required: true, message: ((c.title) + " 必填"), whitespace: true }] })(React__default.createElement( Input, null ))
            )
          );
        }
      });

      return (
        React__default.createElement( Modal, { title: id ? '修改' : '创建', visible: true, onOk: this.submit, okText: "提交", onCancel: function () { return history.go(-1); } },
          React__default.createElement( Spin, { spinning: loading },
            React__default.createElement( Form, null,
              items
            )
          )
        )
      );
    } else {
      return null;
    }
  };

  return ANForm;
}(React.Component));


var Wrapped = Form.create()(ANForm);

module.exports = Wrapped;
