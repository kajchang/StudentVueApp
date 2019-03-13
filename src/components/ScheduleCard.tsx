import * as React from 'react';
import { Text, TouchableHighlight } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import { connect } from 'react-redux';

import { default as cheerio } from 'react-native-cheerio';

import {
    IBellScheduleInterface,
    IEventCalendarInterface,
    IStudentInfoInterface,
    setBellSchedule,
    setEventCalendar,
    setStudentInfo,
} from '../actions';

import { NavigationScreenProp } from 'react-navigation';

interface IScheduleCardProps {
    navigation: NavigationScreenProp<any, any>;
    cookies: string;
    bellSchedule: IBellScheduleInterface;
    eventCalendar: IEventCalendarInterface;
    studentInfo: IStudentInfoInterface;
    setBellSchedule: (arg0: IBellScheduleInterface) => null;
    setEventCalendar: (arg0: IEventCalendarInterface) => null;
    setStudentInfo: (arg0: IStudentInfoInterface) => null;
}

const parseTime = (time: string) => {
    const parsedTime =  /([0-9]{1,2}):([0-9]{1,2}) ([AP])M/.exec(time);
    return parseInt(parsedTime[1], 10) * 60 +
           parseInt(parsedTime[2], 10) +
          (parseInt(parsedTime[1], 10) !== 12 && parsedTime[3] === 'P' ? 12 * 60 : 0);
};

const ScheduleCard = (props: IScheduleCardProps) => {
    const [scheduleMessage, setScheduleMessage] = React.useState('');
    const [initialized, setInitialized] = React.useState(false);

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
                        name: /Good [a-zA-z]+, (.+), [0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/g.exec(
                            $('#Greeting').text())[1],
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
    });

    if (props.bellSchedule.loaded && props.eventCalendar.loaded && scheduleMessage === '') {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];

        const today = new Date();
        const minutes = today.getHours() * 60 + today.getMinutes();

        const code = props.eventCalendar.data
            [monthNames[today.getMonth()].toUpperCase()].days
            [String(today.getDate())];

        if (code === 'M' || code === 'N') {
            const scheduleType = code === 'M' ? 'Monday Meeting' : 'Tuesday - Friday';

            const blocks = Object.keys(props.bellSchedule.data[scheduleType]).map(block => ({
                block,
                endMinutes: parseTime(props.bellSchedule.data[scheduleType][block]['End Time']),
                startMinutes: parseTime(props.bellSchedule.data[scheduleType][block]['Start Time']),
            })).sort((a, b) => a.startMinutes - b.startMinutes);

            if (minutes < blocks[0].startMinutes) {
                setScheduleMessage(`School starts at ${ props.bellSchedule.data
                    [scheduleType][blocks[0].block]['Start Time'] } Today!`);
            } else if (minutes > blocks[blocks.length - 1].endMinutes) {
                const tomorrow = new Date();
                tomorrow.setDate(today.getDate() + 1);

                let tomorrowMessage;

                const tomorrowCode = props.eventCalendar.data
                    [monthNames[tomorrow.getMonth()].toUpperCase()].days
                    [String(today.getDate())];

                if (tomorrowCode === 'M' || tomorrowCode === 'N') {
                    const tomorrowScheduleType = tomorrowCode === 'M' ?
                        'Monday Meeting' : 'Tuesday - Friday';
                    tomorrowMessage = `School starts at ${ props.bellSchedule.data
                        [tomorrowScheduleType]['1']['Start Time'] } tomorrow.`;
                } else {
                    tomorrowMessage = `Tomorrow is a ${ tomorrowCode } day!`;
                }

                setScheduleMessage(`School is out for the day! ${ tomorrowMessage }`);
            } else {
                for (const [idx, block] of blocks.entries()) {
                    if (minutes > block.startMinutes && minutes < block.endMinutes) {
                        setScheduleMessage(
                            `Current Class is Period ${ block.block } which ends at ${
                                props.bellSchedule.data[scheduleType][block.block]['End Time'] }.`);
                        break;
                    } else if (minutes > block.endMinutes &&
                               minutes < blocks[idx + 1].startMinutes) {
                        setScheduleMessage(
                            `Next Class is Period ${blocks[idx + 1].block} which starts at ${
                            props.bellSchedule.data[scheduleType][blocks[idx + 1].block]['Start Time'] }.`);
                        break;
                    }
                }
            }
        } else {
            setScheduleMessage(`Today is a ${ code } day!`);
        }
    }

    return (
        <Card>
            <Text style={ { fontSize: 18, padding: 10 } }>
                Student ID: { props.studentInfo.studentID }
            </Text>
            <TouchableHighlight
                style={ { paddingLeft: 10, paddingBottom: 10 } }
                onPress={ () => { props.navigation.replace('Barcode'); } }
                underlayColor={ '#fff' }
            >
                <Text style={ { fontSize: 10, color: '#29a4a4' } }> Show Barcode</Text>
            </TouchableHighlight>
            <Divider/>
            <Text style={ { fontSize: 18, padding: 10 } }>{ scheduleMessage }</Text>
        </Card>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleCard);
