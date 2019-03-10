import React from 'react';
import { KeyboardAvoidingView, Text, TextInput, TouchableHighlight } from 'react-native';

import cheerio from 'react-native-cheerio';

import styles from '../styles';
import storage from '../storage/CredentialStorage';

export default class LoginView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            error: ''
        };

        this.login = this.login.bind(this);
    }

    componentDidMount() {
        storage.getCredentials()
            .then(credentials => {
                if (credentials !== null) {
                    this.setState(JSON.parse(credentials));
                }
            });
    }

    login() {
        fetch('https://portal.sfusd.edu/PXP2_Login_Student.aspx?regenerateSessionId=True')
            .then(async res => {
                const $ = cheerio.load(await res.text());
                const params = {};
                $('#aspnetForm > input').each(function () {
                    params[$(this).attr('name')] = $(this).attr('value');
                });
                params['ctl00$MainContent$username'] = this.state.username;
                params['ctl00$MainContent$password'] = this.state.password;

                let formBody = [];
                for (const property in params) {
                    const encodedKey = encodeURIComponent(property);
                    const encodedValue = encodeURIComponent(params[property]);
                    formBody.push(encodedKey + '=' + encodedValue);
                }

                storage.setCookies(res.headers.get('set-cookie'));

                return fetch('https://portal.sfusd.edu/PXP2_Login_Student.aspx?Logout=1&regenerateSessionId=True', {
                    method: 'POST',
                    headers: {
                        cookie: res.headers.get('set-cookie'),
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formBody.join('&')
                });
            })
            .then(res => {
                if (res.url !== 'https://portal.sfusd.edu/Home_PXP2.aspx') {
                    throw 'Incorrect Username or Password';
                } else {
                    storage.setCredentials(this.state.username, this.state.password);
                    this.props.navigation.replace('Landing');
                }
            })
            .catch(error => this.setState({ error }));
    }

    render() {
        return (
            <KeyboardAvoidingView style={ styles.container } behavior='padding'>
                <Text style={ styles.header }>StudentVue</Text>
                <TextInput
                    style={ [styles.bordered, styles.textCentered] }
                    placeholder='Username'
                    value={ this.state.username }
                    onChangeText={ (username) => this.setState({ username }) }
                />
                <TextInput
                    style={ [styles.bordered, styles.textCentered] }
                    autoComplete='password'
                    secureTextEntry={ true }
                    placeholder='Password'
                    value={ this.state.password }
                    onChangeText={ (password) => this.setState({ password }) }
                />
                <TouchableHighlight
                    style={ [styles.bordered, { backgroundColor: '#a42929' }] }
                    underlayColor='#8a0f0f'
                    onPress={ this.login }
                >
                    <Text
                        style={ [styles.textCentered, styles.slightlyPadded] }
                    >Submit</Text>
                </TouchableHighlight>
                <Text style={ [styles.slightlyPadded, { color: '#ff0000' }] }>{ this.state.error }</Text>
            </KeyboardAvoidingView>
        );
    }
}
