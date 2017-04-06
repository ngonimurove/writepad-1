import React from 'react';
import { Button, Modal, Form, Input } from 'antd';
const FormItem = Form.Item;

const CollectionCreateForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Create a new note"
        okText="Create"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="Title">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please input the title of note!' }],
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);

class NotesPage extends React.Component {
  state = {
    visible: false,
  };
  showModal = () => {
    this.setState({ visible: true });
  }
  handleCancel = () => {
    this.setState({ visible: false });
  }
  handleCreate = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);
      form.resetFields();
      this.setState({ visible: false });
    });
  }
  saveFormRef = (form) => {
    this.form = form;
  }
  render() {
    return (
      <div style={{height: '60px', textAlign: 'center'}} >
        <Button style={{margin: '15px 0px' }} type="primary" size="large" onClick={this.showModal}>Create New Note</Button>
        <CollectionCreateForm
          ref={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}

export default NotesPage;