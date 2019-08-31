import * as React from 'react';
import { FlatList, TouchableHighlight } from 'react-native';
import { default as cheerio } from 'react-native-cheerio';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';

import styles from '../styles';

import {
    IBellScheduleInterface,
    IEventCalendarInterface,
    IStudentInfoInterface,
    setBellSchedule,
    setEventCalendar,
    setStudentInfo,
} from '../actions';

import { NavigationScreenProp } from 'react-navigation';

interface IPage {
    title: string;
    page: string;
}

interface IMenuProps {
    navigation: NavigationScreenProp<any, any>;
    pages: IPage[];
    cookies: string;
    bellSchedule: IBellScheduleInterface;
    eventCalendar: IEventCalendarInterface;
    studentInfo: IStudentInfoInterface;
    setBellSchedule: (arg0: IBellScheduleInterface) => null;
    setEventCalendar: (arg0: IEventCalendarInterface) => null;
    setStudentInfo: (arg0: IStudentInfoInterface) => null;
}

const Menu = (props: IMenuProps) => {
    const [initialized, setInitialized] = React.useState(props.bellSchedule.loaded && props.eventCalendar.loaded && props.studentInfo.loaded);

    React.useEffect(() => {
        if (!initialized) {
            fetch('https://portal.sfusd.edu/Home_PXP2.aspx', {
                headers: {
                    Cookie: props.cookies,
                },
                method: 'GET',
            })
                .then(async (res) => {
                    const $ = cheerio.load(await res.text());
                    props.setStudentInfo({
                        name: /Good [a-zA-z]+, (.+), [0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/g.exec($('#Greeting').text())[1],
                        studentID: /ID: ([0-9]{8})/.exec($('.student-id').text())[1],
                    } as IStudentInfoInterface);
                });

            fetch('https://kajchang.github.io/LowellAPI/event_calendar.json')
                .then(async (res) => {
                    props.setEventCalendar(await res.json());
                });

            fetch('https://kajchang.github.io/LowellAPI/bell_schedules.json')
                .then(async (res) => {
                    props.setBellSchedule(await res.json());
                });

            setInitialized(true);
        }
    },              []);

    return <FlatList
        style={ { paddingVertical: 15, paddingHorizontal: 15 } }
        scrollEnabled={ false }
        data={ props.pages }
        renderItem={ ({ item }) => <TouchableHighlight
            onPress={ () => props.navigation.replace(item.page) }
            underlayColor={ '#fff' }
        >
            <ListItem
                containerStyle={ [styles.bordered, styles.control, { margin: 10 }] }
                titleStyle={ [styles.header] }
                title={ item.title }
            />
        </TouchableHighlight> }
        keyExtractor={ item => item.title }
    />;
};

const mapStateToProps = state => ({
    bellSchedule: state.bellSchedule,
    cookies: state.cookies,
    eventCalendar: state.eventCalendar,
    studentInfo: state.studentInfo,
});

const mapDispatchToProps = dispatch => ({
    setBellSchedule: bellSchedule => dispatch(setBellSchedule(bellSchedule)),
    setEventCalendar: eventCalendar => dispatch(setEventCalendar(eventCalendar)),
    setStudentInfo: studentInfo => dispatch(setStudentInfo(studentInfo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
