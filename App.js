import React from 'react';
import { StyleSheet, Text, TouchableHighlight, TextInput, KeyboardAvoidingView } from 'react-native';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        };
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
                    onPress={ () => { this.setState({
                        username: '',
                        password: ''
                    }) } }
                >
                    <Text
                        style={ styles.buttonText }
                    >Submit</Text>
                </TouchableHighlight>
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
    }
});
