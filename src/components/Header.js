import React from 'react';
import { Text, TouchableHighlight } from 'react-native';
import { Header } from 'react-native-elements';

const Header_ = ({ name, navigation }) => <Header
    containerStyle={{
        backgroundColor: '#29a4a4',
        justifyContent: 'space-around'
    }}
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

export default Header_;
