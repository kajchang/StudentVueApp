import * as React from 'react';
import { KeyboardAvoidingView, Text } from 'react-native';

import { NavigationScreenProp } from 'react-navigation';

import styles from '../styles';

import { Login } from '../components';

interface LoginViewProps {
    navigation: NavigationScreenProp<any, any>
}

const LoginView = (props: LoginViewProps) => <KeyboardAvoidingView style={ styles.container } behavior='padding'>
    <Text style={ styles.header }>StudentVue</Text>
    <Login
        navigation={ props.navigation }
    />
</KeyboardAvoidingView>;

export default LoginView;
