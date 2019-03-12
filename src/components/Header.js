import React from 'react';
import { connect } from 'react-redux';
import { Text, TouchableHighlight } from 'react-native';
import { Header } from 'react-native-elements';

import { clearStudentInfo } from '../actions';

const Header_ = ({ name, navigation, back, clearStudentInfo }) => <Header
    containerStyle={{
        backgroundColor: '#29a4a4',
        justifyContent: 'space-around'
    }}
    leftComponent={ back ? <TouchableHighlight
        underlayColor={ '#29a4a4' }
        onPress={ () => {
            clearStudentInfo();
            navigation.replace(back);
        } }
    >
        <Text
            style={ { fontSize: 20, color: '#fff' } }
        >Back</Text>
    </TouchableHighlight> : null }
    centerComponent={ { text: name, style: { fontSize: 20, color: '#fff' } } }
    rightComponent={ <TouchableHighlight
        underlayColor={ '#29a4a4' }
        onPress={ () => navigation.replace('Login') }
    >
        <Text
            style={ { fontSize: 20, color: '#fff' } }
        >Logout</Text>
    </TouchableHighlight> }
/>;

const mapDispatchToProps = dispatch => ({
    clearStudentInfo: () => dispatch(clearStudentInfo())
});

export default connect(null, mapDispatchToProps)(Header_);
