import React from 'react';
import { Layout, Form, Input, Icon, Button } from 'antd';
import { firebase, helpers } from 'redux-react-firebase';
import { connect } from 'react-redux';
import { setContentView } from '../actions';


const { dataToJS, pathToJS } = helpers;

const FormItem = Form.Item;

@firebase([
  ['/user']
])
@connect(
  ({ firebase }) => ({
   user: dataToJS(firebase, '/todos'),
   authError: pathToJS(firebase, 'authError'),
  })
)
class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
  };

  render() {
    const {firebase, authError} = this.props

    const navToLogin = (e) => {
      e.preventDefault();

      this.props.dispatch(setContentView('CONTENT_LOGIN'));
    }

    const handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          
          const credentials = {
            email: values.email,
            password: values.password
          }
          console.log('Received values of form: ', credentials);

          firebase.createUser(credentials, {firstname: values.firstname, lastname: values.lastname});

          this.props.dispatch(setContentView('CONTENT_LOGIN'));          
        }
      });
    }

    const handleConfirmBlur = (e) => {
      const value = e.target.value;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    const checkPassword = (rule, value, callback) => {
      const form = this.props.form;
      if (value && value !== form.getFieldValue('password')) {
        callback('Two passwords that you enter is inconsistent!');
      } else {
        callback();
      }
    }
    const checkConfirm = (rule, value, callback) => {
      const form = this.props.form;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    }

    const { getFieldDecorator } = this.props.form;

    const error = (authError) ? authError.toString() : ''

    return (
     <Layout style={{ marginTop: '180px', width: '100%', padding: '0', bottom: '50px', height: '100%' }}>
      <Form onSubmit={handleSubmit} className="signup-form">
         <FormItem 
          hasFeedback
        >
          {getFieldDecorator('firstname', {
            rules: [{
              required: true, message: 'Please input your first name!',
            }],
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="First Name"/>
          )}
        </FormItem>
        <FormItem 
          hasFeedback
        >
          {getFieldDecorator('lastname', {
            rules: [{
              required: true, message: 'Please input your last name!',
            }],
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Last Name"/>
          )}
        </FormItem>
       <FormItem 
          hasFeedback
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }],
          })(
            <Input prefix={<Icon type="mail" style={{ fontSize: 13 }} />} placeholder="Email"/>
          )}
        </FormItem>
        <FormItem
          hasFeedback
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: 'Please input your password!',
            }, {
              validator: checkConfirm,
            }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem
          hasFeedback
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: 'Please confirm your password!',
            }, {
              validator: checkPassword,
            }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Confirm Password" onBlur={handleConfirmBlur} />
          )}
        </FormItem>
        <FormItem>
          <p>{error}</p>
          <Button type="primary" htmlType="submit" size="large" className="login-form-button">Signup</Button>
          Or <a href="" onClick={navToLogin} >login</a>
        </FormItem>
      </Form>
      </Layout>
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);

export default WrappedRegistrationForm;