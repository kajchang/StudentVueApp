import React from 'react';
import { View, Text, TouchableHighlight, ActivityIndicator, FlatList } from 'react-native';
import { Header, ListItem } from 'react-native-elements';

import cheerio from 'react-native-cheerio';

import styles from '../styles';
import storage from '../storage/CredentialStorage';

export default class LandingView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            name: ''
        };

        this.pages = [
            {
                title: 'Messages',
                icon: { name: 'message', size: 30 }
            },
            {
                title: 'Calendar',
                icon: { name: 'calendar', type: 'entypo', size: 30 }
            },
            {
                title: 'Attendance',
                icon: { name: 'notebook', type: 'simple-line-icon', size: 30 }
            },
            {
                title: 'Grades',
                icon: { name: 'grade', size: 30 }
            }
        ];

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
                    loaded: true,
                    name: /Good [a-zA-z]+, (.+), [0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/g.exec($('#Greeting').text())[1]
                });
            });
    }

    render() {
        return (
            this.state.loaded ? (<View style={ { flex: 1 } }>
                <Header
                    containerStyle={{
                        backgroundColor: '#29a4a4',
                        justifyContent: 'space-around',
                    }}
                    centerComponent={{ text: this.state.name, style: { fontSize: 20, color: '#fff' } }}
                />
                <FlatList
                    data={ this.pages }
                    renderItem={ ({ item }) => <ListItem
                        leftIcon={ item.icon }
                        title={ item.title }
                    /> }
                    keyExtractor={ item => item.title }
                />
                <View style={ styles.container }>
                    <TouchableHighlight
                        style={ [styles.bordered, { backgroundColor: '#a42929' }] }
                        underlayColor='#8a0f0f'
                        onPress={ () => this.props.navigation.replace('Login') }
                    >
                        <Text
                            style={ [styles.textCentered, styles.slightlyPadded] }
                        >Logout</Text>
                    </TouchableHighlight>
                </View>
            </View>) : <View style={ styles.container }><ActivityIndicator size='large' color={ '#0000ff' }/></View>
        );
    }
}
