import React from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableHighlight } from 'react-native';

import cheerio from 'react-native-cheerio';

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

    login() {
        fetch('https://portal.sfusd.edu/PXP2_Login_Student.aspx?regenerateSessionId=True')
            .then(res => res.text())
            .then(html => {
                const $ = cheerio.load(html);
                const params = {};
                $('#aspnetForm > input').each(function () {
                    params[$(this).attr('name')] = $(this).attr('value');
                });
                params['ctl00$MainContent$username'] = this.state.username;
                params['ctl00$MainContent$password'] = this.state.password;

                this.setState({
                    username: '',
                    password: ''
                });

                let formBody = [];
                for (const property in params) {
                    const encodedKey = encodeURIComponent(property);
                    const encodedValue = encodeURIComponent(params[property]);
                    formBody.push(encodedKey + "=" + encodedValue);
                }

                return fetch('https://portal.sfusd.edu/PXP2_Login_Student.aspx?Logout=1&regenerateSessionId=True', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: formBody.join('&')
                });
            })
            .then(res => {
                if (res.url !== 'https://portal.sfusd.edu/PXP2_Login.aspx') {
                    throw 'Incorrect Username or Password';
                }
            })
            .catch((error) => this.setState({ error }));
    }

    render() {
        return (
            <KeyboardAvoidingView style={ styles.container } behavior='padding'>
                <Text style={ styles.header }>StudentVue</Text>
                <TextInput
                    style={ styles.input }
                    placeholder='Username'
                    value={ this.state.username }
                    onChangeText={ (username) => this.setState({ username }) }
                />
                <TextInput
                    style={ styles.input }
                    autoComplete='password'
                    secureTextEntry={ true }
                    placeholder='Password'
                    value={ this.state.password }
                    onChangeText={ (password) => this.setState({ password }) }
                />
                <TouchableHighlight
                    style={ styles.button }
                    underlayColor='#8a0f0f'
                    onPress={ this.login }
                >
                    <Text
                        style={ styles.buttonText }
                    >Submit</Text>
                </TouchableHighlight>
                <Text style={ styles.error }>{ this.state.error }</Text>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        fontSize: 36,
        padding: 25
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        width: '75%',
        height: 50,
        margin: 2.5,
        textAlign: 'center',
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da'
    },
    button: {
        width: '75%',
        height: 50,
        margin: 2.5,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        backgroundColor:'#a42929'
    },
    buttonText: {
        textAlign: 'center',
        paddingTop: 15,
        paddingBottom: 15
    },
    error: {
        color: '#ff0000',
        paddingTop: 15,
        paddingBottom: 15
    }
});
