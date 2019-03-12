import * as React from 'react';
import { Text, TextInput, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';

import { ActionInterface, setCookies } from '../actions';
import styles from '../styles';
import storage from '../storage/CredentialStorage';

// @ts-ignore
import cheerio from 'react-native-cheerio';
// @ts-ignore
import RCTNetworking from 'RCTNetworking';

import { NavigationScreenProp } from 'react-navigation';

interface LoginProps {
    navigation: NavigationScreenProp<any, any>;
    setCookies: (arg0: string) => null;
}

interface Parameters {
    [value: string]: string
}

const Login = (props: LoginProps) => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const [initialized, setInitialized] = React.useState(false);

    React.useEffect(() => {
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
                const params: Parameters = {};
                $('#aspnetForm > input').each(function () {
                    // @ts-ignore
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

                props.setCookies(res.headers.get('set-cookie') as string);

                // @ts-ignore
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
        <React.Fragment>
            <TextInput
                style={ [styles.bordered, styles.textCentered] }
                placeholder='Username'
                value={ username }
                onChangeText={ setUsername }
            />
            <TextInput
                style={ [styles.bordered, styles.textCentered] }
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
        </React.Fragment>
    );
};

const mapDispatchToProps = (dispatch: (arg0: ActionInterface) => null) => ({
    setCookies: (cookies: string) => dispatch(setCookies(cookies))
});

export default connect(null, mapDispatchToProps)(Login);
