import React from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, Switch, TouchableHighlight } from 'react-native';

import cheerio from 'react-native-cheerio';

import storage from '../storage/CredentialStorage';

export default class HomeView extends React.Component {
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
            .then(async (res) => {
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
                    this.setState({
                        username: '',
                        password: ''
                    });

                    throw 'Incorrect Username or Password';
                } else {
                    storage.setCredentials(this.state.username, this.state.password);
                    this.props.navigation.replace('Landing', { cookies: res.headers.get('set-cookie') });
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
        paddingTop: 7.5,
        paddingBottom: 7.5
    }
});
