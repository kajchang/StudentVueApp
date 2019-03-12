import React from 'react';
import { KeyboardAvoidingView, Text } from 'react-native';

import styles from '../styles';

import { Login } from '../components';

const LoginView = props => <KeyboardAvoidingView style={ styles.container } behavior='padding'>
    <Text style={ styles.header }>StudentVue</Text>
    <Login
        { ...props }
    />
</KeyboardAvoidingView>;

export default LoginView;
