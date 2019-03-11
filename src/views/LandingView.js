import React from 'react';
import { View, Text, TouchableHighlight, ActivityIndicator, FlatList, Image } from 'react-native';
import { Header, ListItem, Card } from 'react-native-elements';

import cheerio from 'react-native-cheerio';

import storage from '../storage/CredentialStorage';

export default class LandingView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            name: '',
            imageURL: '',
            studentName: '',
            studentID: '',
            schoolName: ''
        };

        this.cookies = '';

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
    }

    componentDidMount() {
        storage.getCookies()
            .then(cookies => {
                this.cookies = cookies;

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
                    name: /Good [a-zA-z]+, (.+), [0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/g.exec($('#Greeting').text())[1],
                    imageURL: `https://portal.sfusd.edu/${$('.student-photo > img').attr('src')}`,
                    studentName: $('.student-name').text(),
                    studentID: $('.student-id').text(),
                    schoolName: $('.school').text()
                });
            });
    }

    render() {
        return (
            this.state.loaded ? (<View style={ { flex: 1 } }>
                <Header
                    containerStyle={{
                        backgroundColor: '#29a4a4',
                        justifyContent: 'space-around'
                    }}
                    centerComponent={ { text: this.state.name, style: { fontSize: 20, color: '#fff' } } }
                    rightComponent={<TouchableHighlight
                        underlayColor='#29a4a4'
                        onPress={ () => this.props.navigation.replace('Login') }
                    >
                        <Text
                            style={ { fontSize: 20, color: '#fff' } }
                        >Logout</Text>
                    </TouchableHighlight>}
                />
                <Card>
                    <Image
                        style={ { width: 50, height: 50 } }
                        source={ { uri: this.state.imageURL, headers: { Cookie: this.cookies } } }
                    />
                    <Text style={ styles.slightlyPadded }>
                        { this.state.studentName + '\n' }
                        { this.state.studentID + '\n' }
                        { this.state.schoolName }
                    </Text>
                </Card>
                <FlatList
                    scrollEnabled={ false }
                    data={ this.pages }
                    renderItem={ ({ item }) => <TouchableHighlight
                        onPress={ () => {} }
                        underlayColor='#29a4a4'
                    >
                        <ListItem
                            containerStyle={ { padding: 30 } }
                            leftIcon={ item.icon }
                            title={ item.title }
                            chevron
                        />
                    </TouchableHighlight> }
                    keyExtractor={ item => item.title }
                />
            </View>) : <View style={ styles.container }><ActivityIndicator size='large' color={ '#0000ff' }/></View>
        );
    }
}
