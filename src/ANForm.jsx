import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import Modal from 'antd/lib/modal';
import Spin from 'antd/lib/spin';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Select from 'antd/lib/select';


const FormItem = Form.Item;
const Option = Select.Option;


class ANForm extends Component {
  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
  }

  submit() {
    const { rowKey, columns, dataSource, form } = this.props;
    const defaults = dataSource.toJS ? dataSource.toJS() : dataSource;

    let command = {};
    columns.filter(c => c.form && c.form !== 'readonly' && c.form !== 'hidden').forEach((c) => {
      command[c.dataIndex] = form.getFieldValue(c.dataIndex);
    });
    command.id = defaults[rowKey];
    command[rowKey] = defaults[rowKey];
    // this.setState({ disabled: true });
    this.props.submit(command);
  }

  render() {
    const { rowKey, columns, dataSource, loading } = this.props;

    if (dataSource) {
      const defaults = dataSource.toJS ? dataSource.toJS() : dataSource;
      const id = defaults[rowKey];

      const { getFieldDecorator } = this.props.form;

      const itemLayout = {
        labelCol: {
          xs: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 14 },
        },
      };

      const tailLayout = {
        wrapperCol: {
          xs: { span: 14, offset: 6 },
        },
      };

      const items = columns.map((c) => {
        let props = Object.assign({}, itemLayout, {
          label: c.title,
          key: c.dataIndex,
        });

        if (c.form === 'readonly') {
          return (
            <FormItem {...props}>
              <Input value={defaults[c.dataIndex]} readOnly tabIndex="-1" />
            </FormItem>
          );
        } else if (c.form === 'radio') {
          const initialValue = defaults[c.dataIndex] || ' '; // MAGIC
          return (
            <FormItem {...props}>
              {getFieldDecorator(c.dataIndex, { initialValue, rules: [{ required: true, message: `${c.title} 必填`, whitespace: true }] })(
                <Select>
                  {c.options.map(t => <Option value={t} key={t}>{t}</Option>)}
                </Select>)}
            </FormItem>
          );
        } else if (c.form === 'hidden') {
          return null;
        } else if (c.form) {
          props.hasFeedback = true;
          return (
            <FormItem {...props}>
              {getFieldDecorator(c.dataIndex, { initialValue: defaults[c.dataIndex], rules: [{ required: true, message: `${c.title} 必填`, whitespace: true }] })(<Input />)}
            </FormItem>
          );
        }
      });

      return (
        <Modal title={id ? '修改' : '创建'} visible onOk={this.submit} okText="提交" onCancel={() => history.go(-1)}>
          <Spin spinning={loading}>
            <Form>
              {items}
            </Form>
          </Spin>
        </Modal>
      );
    } else {
      return null;
    }
  }
}


const Wrapped = Form.create()(ANForm);


export default Wrapped;
