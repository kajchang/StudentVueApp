import * as React from 'react';
import { Image, KeyboardAvoidingView, View } from 'react-native';

import { NavigationScreenProp } from 'react-navigation';

import styles from '../styles';

import { Login, ThisText } from '../components';

interface ILoginViewProps {
    navigation: NavigationScreenProp<any, any>;
}

const LoginView = (props: ILoginViewProps) => <KeyboardAvoidingView style={ styles.container } behavior="padding">
    <View style={ [styles.control, { flexDirection:'row', flexWrap:'wrap' }] }>
        <Image source={ require('../assets/logo.png') } style={ { width: 50, height: 50 } }/>
        <ThisText style={ styles.header }>StudentVue</ThisText>
    </View>
    <Login
        navigation={ props.navigation }
    />
</KeyboardAvoidingView>;

export default LoginView;
