import React from 'react';
import { Layout, Card, Tabs, Form, Button, Input, message, Icon } from 'antd';
import { firebase, helpers } from 'redux-react-firebase';
import { connect } from 'react-redux';

const { dataToJS, pathToJS } = helpers;

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

const cardStyle = {
    margin: '0 auto', 
    width: '90%', 
    backgroundColor: '#fff', 
    border: '1px solid #ccc',
};

@firebase([
  ['users'],
  ['.info']
])
@connect(
  ({ firebase }) => {
      const info = dataToJS(firebase, '.info');

      return ({
          users: dataToJS(firebase, 'users'),
          authError: pathToJS(firebase, 'authError'),
          profile: pathToJS(firebase, 'profile'),
          auth: pathToJS(firebase, 'auth'),
          online: info.connected
        })
   
  }
)
class ProfileForm extends React.Component {

    componentWillMount() {
        const {profile} = this.props

        const userDetails = {
            firstname: {value: profile.firstname},
            lastname: {value: profile.lastname},
            email: {value: profile.email},
        }

        this.props.form.setFields(userDetails);
    }

    handleSubmit() {
        const {firebase, auth, profile} = this.props;

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const successFirstname = () => {
                    message.success('Your first name has been updated.');
                };

                const successLastname = () => {
                    message.success('Your last name has been updated.');
                };
                
                const warningUpdate = () => {
                    message.warning('Nothing to update.');
                };

                if (profile.firstname === values.firstname && profile.lastname === values.lastname) {
                    warningUpdate();
                }
                if (profile.firstname !== values.firstname) {
                    firebase.set(`users/${auth.uid}/firstname`, values.firstname, successFirstname);
                }
                if (profile.lastname !== values.lastname) {
                    firebase.set(`users/${auth.uid}/lastname`, values.lastname, successLastname);
                }
            }
        });
    }

    render () {
        const {authError, profile} = this.props

        const { getFieldDecorator } = this.props.form;
        const error = (authError) ? authError.toString() : '';

        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                span: 6,
                offset: 8,
            },
        };

        return (
            <Form className="profile-form">
                <FormItem
                {...formItemLayout}
                label="First Name" 
                hasFeedback
                >
                {getFieldDecorator('firstname', {
                    rules: [{
                    required: true, message: 'Please input your first name!',
                    }],
                })(
                    <Input />
                )}
                </FormItem>
                <FormItem 
                {...formItemLayout}
                label="Last Name:"
                hasFeedback
                >
                {getFieldDecorator('lastname', {
                    rules: [{
                    required: true, message: 'Please input your last name!',
                    }],
                })(
                    <Input />
                )}
                </FormItem>
                <FormItem 
                {...formItemLayout}
                label="E-mail"
                >
                {getFieldDecorator('email', {
                    rules: [],
                })(
                    <span>{profile.email}</span>
                )}
                </FormItem>
                <FormItem
                {...tailFormItemLayout}>
                <p>{error}</p>
                <Button type="primary" onClick={() => this.handleSubmit()} size="large" className="profile-form-button">Save</Button>
                </FormItem>
            </Form>
        )
    }
}

const WrappedProfileForm = Form.create()(ProfileForm)

const TabStyles = {
    marginTop: '20px',
}

@firebase([
  ['.info']
])
@connect(
  ({ firebase }) => {
      const info = dataToJS(firebase, '.info');

      return ({
          online: info ? info.connected : false,
          profile: pathToJS(firebase, 'profile'),
        })
  }
)
class Settings extends React.Component {

    render () {
        const {online, profile} = this.props;

        return (
            <Layout style={{ marginTop: '80px', width: '100%', padding: '0', bottom: '50px', height: '100%' }}>
                <Card bordered={false} style={cardStyle} >
                    <div className="card-container">
                        <Tabs type="card">
                        <TabPane style={TabStyles} tab="Profile" key="1">
                            {online && profile ? <WrappedProfileForm />  : <div><Icon type="loading" /></div>}
                        </TabPane>
                        <TabPane style={TabStyles} tab="Account" key="2">Account Settings</TabPane>
                        </Tabs>
                    </div>
                </Card>
            </Layout>
        );
    }
}

export default Settings;