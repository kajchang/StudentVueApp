import * as React from 'react';
import { Text, TextInput, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';

import { IActionInterface, setCookies } from '../actions';
import CredentialStorage from '../storage/CredentialStorage';
import styles from '../styles';

// @ts-ignore
import RCTNetworking from 'RCTNetworking';
import { default as cheerio } from 'react-native-cheerio';

import { NavigationScreenProp } from 'react-navigation';

interface ILoginProps {
    navigation: NavigationScreenProp<any, any>;
    setCookies: (arg0: string) => null;
}

interface IParameters {
    [value: string]: string;
}

const Login = (props: ILoginProps) => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const [initialized, setInitialized] = React.useState(false);

    React.useEffect(() => {
        if (!initialized) {
            CredentialStorage.getCredentials()
                .then((credentials) => {
                    if (credentials !== null) {
                        setUsername(JSON.parse(credentials).username);
                        setPassword(JSON.parse(credentials).password);
                    }
                });

            setInitialized(true);
        }
    });

    const login = () => {
        RCTNetworking.clearCookies(() => {});

        fetch('https://portal.sfusd.edu/PXP2_Login_Student.aspx?regenerateSessionId=True')
            .then(async (res) => {
                const $ = cheerio.load(await res.text());
                const params: IParameters = {};
                $('#aspnetForm > input').each(function () {
                    params[$(this).attr('name')] = $(this).attr('value');
                });
                params.ctl00$MainContent$username = username;
                params.ctl00$MainContent$password = password;

                const formBody = [];
                for (const property of Object.keys(params)) {
                    const encodedKey = encodeURIComponent(property);
                    const encodedValue = encodeURIComponent(params[property]);
                    formBody.push(`${ encodedKey }=${ encodedValue }`);
                }

                props.setCookies(res.headers.get('set-cookie'));

                return fetch('https://portal.sfusd.edu/PXP2_Login_Student.aspx?Logout=1&regenerateSessionId=True', {
                    body: formBody.join('&'),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        cookie: res.headers.get('set-cookie'),
                    },
                    method: 'POST',
                });
            })
            .then((res) => {
                if (res.url !== 'https://portal.sfusd.edu/Home_PXP2.aspx') {
                    throw new Error('Incorrect Username or Password');
                } else {
                    CredentialStorage.setCredentials(username, password);
                    props.navigation.replace('Landing');
                }
            })
            .catch(loginError => setError(loginError.toString()));
    };

    return (
        <React.Fragment>
            <TextInput
                style={ [styles.bordered, styles.item, styles.textCentered] }
                placeholder={ 'Username' }
                value={ username }
                onChangeText={ setUsername }
            />
            <TextInput
                style={ [styles.bordered, styles.item, styles.textCentered] }
                secureTextEntry={ true }
                placeholder={ 'Password' }
                value={ password }
                onChangeText={ setPassword }
            />
            <TouchableHighlight
                style={ [styles.bordered, styles.item, { backgroundColor: '#29a4a4' }] }
                underlayColor={ '#29a4a4' }
                onPress={ login }
            >
                <Text
                    style={ [styles.textCentered, styles.control] }
                >Submit</Text>
            </TouchableHighlight>
            <Text style={ [styles.control, { color: '#ff0000' }] }>{ error }</Text>
        </React.Fragment>
    );
};

const mapDispatchToProps = (dispatch: (arg0: IActionInterface) => null) => ({
    setCookies: (cookies: string) => dispatch(setCookies(cookies)),
});

export default connect(null, mapDispatchToProps)(Login);
