import * as React from 'react';
import { Text, TouchableHighlight } from 'react-native';
import { Header } from 'react-native-elements';
import { connect } from 'react-redux';

import { clearStudentInfo, IActionInterface } from '../actions';

import { NavigationScreenProp } from 'react-navigation';

interface IHeaderProps {
    navigation: NavigationScreenProp<any, any>;
    name: string;
    back?: string;
    clearStudentInfo: () => void;
}

const _Header = (props: IHeaderProps) => <Header
    containerStyle={{
        backgroundColor: '#29a4a4',
        justifyContent: 'space-around',
    }}
    leftComponent={ props.back ? <TouchableHighlight
        underlayColor={ '#29a4a4' }
        onPress={ () => props.navigation.replace(props.back as string) }
    >
        <Text
            style={ { fontSize: 20, color: '#fff' } }
        >Back</Text>
    </TouchableHighlight> : undefined }
    centerComponent={ { text: props.name, style: { fontSize: 20, color: '#fff' } } }
    rightComponent={ <TouchableHighlight
        underlayColor={ '#29a4a4' }
        onPress={ () => {
            props.clearStudentInfo();
            props.navigation.replace('Login');
        } }
    >
        <Text
            style={ { fontSize: 20, color: '#fff' } }
        >Logout</Text>
    </TouchableHighlight> }
/>;

const mapDispatchToProps = (dispatch: (arg0: IActionInterface) => null) => ({
    clearStudentInfo: () => dispatch(clearStudentInfo()),
});

export default connect(null, mapDispatchToProps)(_Header);
