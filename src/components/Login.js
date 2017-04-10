import React from 'react';
import { Form, Icon, Input, Button, Checkbox, Layout } from 'antd';
import { firebase, helpers } from 'redux-react-firebase';
import { connect } from 'react-redux';

const { pathToJS } = helpers;
const FormItem = Form.Item;


@firebase()
@connect(
  ({firebase}) => ({
    authError: pathToJS(firebase, 'authError'),
  })
)
class NormalLoginForm extends React.Component {
  constructor(){
    super()
    this.state = {loading:false}
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const {firebase, authError} = this.props

    const handleSubmit = (e) => {
          e.preventDefault();
          this.props.form.validateFields((err, values) => {
            if (!err) {
              console.log('Received values of form: ', values);

              const credentials = {
                email: values.email,
                password: values.password
              }

              firebase.login(credentials)
              this.setState({
                loading: true
              })
              }
          });
        }

    const error = (authError) ?
                authError.toString()
              : (this.state.loading) ?
                        'loading'
                      : ''

    return (
        <Layout style={{ marginTop: '80px', width: '100%', padding: '0', bottom: '50px', height: '100%' }}>
          <Form onSubmit={handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>Remember me</Checkbox>
              )}
              <a className="login-form-forgot" href="">Forgot password</a>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
              Or <a href="">register now!</a>
            </FormItem>
            <p>{error}</p>
          </Form>
      </Layout >
    );
  }
};

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm;