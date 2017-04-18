import React from 'react';
import { Form, Icon, Input, Button, Layout } from 'antd';
import { firebase, helpers } from 'redux-react-firebase';
import { connect } from 'react-redux';
import { setContentView } from '../actions'

const { pathToJS } = helpers;
const FormItem = Form.Item;


@firebase()
@connect(
  ({firebase, contentView}) => ({
    authError: pathToJS(firebase, 'authError'),
    contentView: contentView
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

    const navToSignup = (e) => {
      e.preventDefault();

      this.props.dispatch(setContentView('CONTENT_SIGNUP'))
    }

    const handleSubmit = (e) => {
          e.preventDefault();
          this.props.form.validateFields((err, values) => {
            if (!err) {
              console.log('Received values of form: ', values);

              const credentials = {
                email: values.email,
                password: values.password
              }

              console.log(credentials);

              firebase.login(credentials).catch((error) => { console.log(error)});
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
              {getFieldDecorator('email', {
                rules: [{ required: true, message: 'Please input your email!' }],
              })(
                <Input prefix={<Icon type="mail" style={{ fontSize: 13 }} />} placeholder="Email" />
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
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
              Or <a href="" onClick={navToSignup} >signup now!</a>
            </FormItem>
            <p>{error}</p>
          </Form>
      </Layout >
    );
  }
};

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm;