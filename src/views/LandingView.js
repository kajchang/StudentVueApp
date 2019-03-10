import React from 'react';
import { View, Text, TouchableHighlight, ActivityIndicator, StyleSheet } from 'react-native';

import cheerio from 'react-native-cheerio';

import styles from '../styles';
import storage from '../storage/CredentialStorage';

export default class LandingView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: ''
        };

        storage.getCookies()
            .then(cookies => {
                return fetch('https://portal.sfusd.edu/Home_PXP2.aspx', {
                    method: 'GET',
                    headers: {
                        Cookie: cookies
                    }
                });
            })
            .then(async res => {
                const $ = cheerio.load(await res.text());

                this.setState({
                    name: /Good [a-zA-z]+, (.+), [0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/g.exec($('#Greeting').text())[1]
                });
            });
    }

    render() {
        return (
            this.state.name ? (<View style={ styles.container }>
                <Text style={ styles.header }>
                    Name: { this.state.name }
                </Text>
                <TouchableHighlight
                    style={ [styles.bordered, { backgroundColor: '#a42929' }] }
                    underlayColor='#8a0f0f'
                    onPress={ () => this.props.navigation.replace('Login') }
                >
                    <Text
                        style={ [styles.textCentered, styles.slightlyPadded] }
                    >Logout</Text>
                </TouchableHighlight>
            </View>) : <View style={ styles.container }><ActivityIndicator size='large' color={ '#0000ff' }/></View>
        );
    }
}
