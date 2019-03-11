import React from 'react';
import { View, Text, TouchableHighlight, ActivityIndicator, FlatList, Image } from 'react-native';
import { Header, ListItem, Card, Divider } from 'react-native-elements';

import cheerio from 'react-native-cheerio';

import storage from '../storage/CredentialStorage';

export default class LandingView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            name: '',
            studentID: '',
            code: '',
            scheduleMessage: ''
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
                    studentID: /ID: ([0-9]{8})/.exec($('.student-id').text())[1]
                });
            });

        fetch('https://kajchang.github.io/LowellAPI/event_calendar.json')
            .then(async res => {
                const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];

                const eventCalendar = await res.json();
                const today = new Date;

                this.setState({
                    code: eventCalendar[monthNames[today.getMonth()].toUpperCase()]['days'][String(today.getDate())]
                });

                return fetch('https://kajchang.github.io/LowellAPI/bell_schedules.json');
            })
            .then(async res => {
                const bellSchedule = await res.json();
                const today = new Date;

                const minutes = today.getHours() * 60 + today.getMinutes();

                if (this.state.code === 'M' || this.state.code === 'N') {
                    const scheduleType = this.state.code === 'M' ? 'Monday Meeting' : 'Tuesday - Friday';

                    const blocks = Object.keys(bellSchedule[scheduleType]).map(block => new Object({
                        block: block,
                        startMinutes: this.parseTime(bellSchedule[scheduleType][block]['Start Time']),
                        endMinutes: this.parseTime(bellSchedule[scheduleType][block]['End Time'])
                    })).sort((a, b) => a['startMinutes'] - b['startMinutes']);

                    if (minutes < blocks[0].startMinutes) {
                        this.setState({
                            scheduleMessage: `School starts at ${ bellSchedule[scheduleType][blocks[0].block]['Start Time'] } Today!`
                        });
                    } else if (minutes > blocks[blocks.length - 1].endMinutes) {
                        this.setState({
                            scheduleMessage: `School is out for the day!`
                        });
                    }

                    for (const [idx, block] of blocks.entries()) {
                        if (minutes > block.startMinutes && minutes < block.endMinutes) {
                            this.setState({
                                scheduleMessage: `Current Class is Period ${ block.block } which ends at ${ bellSchedule[scheduleType][block.block]['End Time'] }.`
                            });
                            break;
                        } else if (minutes > block.endMinutes && minutes < blocks[idx + 1].startMinutes) {
                            this.setState({
                                scheduleMessage: `Next Class is Period ${blocks[idx + 1].block} which starts at ${bellSchedule[scheduleType][blocks[idx + 1].block]['End Time']}.`
                            });
                            break;
                        }
                    }
                }
            });
    }

    parseTime(time) {
        const parsedTime =  /([0-9]{1,2}):([0-9]{1,2}) ([AP])M/.exec(time);
        return parseInt(parsedTime[1]) * 60 + parseInt(parsedTime[2]) + (parseInt(parsedTime[1]) !== 12 && parsedTime[3] === 'P' ? 12 * 60 : 0);
    }

    render() {
        return (
            this.state.loaded ? (<View>
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
                    <Text style={ { fontSize: 18, padding: 10 } }>
                        Student ID: { this.state.studentID }
                        <Text style={ { fontSize: 10 } }> Generate Barcode</Text>
                    </Text>
                    <Divider/>
                    <Text style={ { fontSize: 18, padding: 10 } }>{ this.state.scheduleMessage }</Text>
                </Card>
                <FlatList
                    scrollEnabled={ false }
                    data={ this.pages }
                    renderItem={ ({ item }) => <TouchableHighlight
                        onPress={ () => {} }
                        underlayColor={ '#29a4a4' }
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
