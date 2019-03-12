import React, { Fragment, useState, useEffect } from 'react';
import { Text, TextInput, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';

import { setCookies } from '../actions';
import styles from '../styles';
import storage from '../storage/CredentialStorage';

import cheerio from 'react-native-cheerio';
import RCTNetworking from 'RCTNetworking';

const Login = props => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!initialized) {
            storage.getCredentials()
                .then(credentials => {
                    if (credentials !== null) {
                        setUsername(JSON.parse(credentials)['username']);
                        setPassword(JSON.parse(credentials)['password']);
                    }
                });

            setInitialized(true);
        }
    });


    const login = () => {
        RCTNetworking.clearCookies(() => {});

        fetch('https://portal.sfusd.edu/PXP2_Login_Student.aspx?regenerateSessionId=True')
            .then(async res => {
                const $ = cheerio.load(await res.text());
                const params = {};
                $('#aspnetForm > input').each(function () {
                    params[$(this).attr('name')] = $(this).attr('value');
                });
                params['ctl00$MainContent$username'] = username;
                params['ctl00$MainContent$password'] = password;

                let formBody = [];
                for (const property in params) {
                    const encodedKey = encodeURIComponent(property);
                    const encodedValue = encodeURIComponent(params[property]);
                    formBody.push(encodedKey + '=' + encodedValue);
                }

                props.setCookies(res.headers.get('set-cookie'));

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
                    storage.setCredentials(username, password);
                    props.navigation.replace('Landing');
                }
            })
            .catch(error => setError(error));
    };


    return (
        <Fragment>
            <TextInput
                style={ [styles.bordered, styles.textCentered] }
                placeholder='Username'
                value={ username }
                onChangeText={ setUsername }
            />
            <TextInput
                style={ [styles.bordered, styles.textCentered] }
                autoComplete='password'
                secureTextEntry={ true }
                placeholder='Password'
                value={ password }
                onChangeText={ setPassword }
            />
            <TouchableHighlight
                style={ [styles.bordered, { backgroundColor: '#a42929' }] }
                underlayColor={ '#8a0f0f' }
                onPress={ login }
            >
                <Text
                    style={ [styles.textCentered, styles.slightlyPadded] }
                >Submit</Text>
            </TouchableHighlight>
            <Text style={ [styles.slightlyPadded, { color: '#ff0000' }] }>{ error }</Text>
        </Fragment>
    );
};

const mapDispatchToProps = dispatch => ({
    setCookies: cookies => dispatch(setCookies(cookies))
});

export default connect(null, mapDispatchToProps)(Login);
