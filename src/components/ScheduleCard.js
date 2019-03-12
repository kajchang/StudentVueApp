import React, { useState, useEffect } from 'react'
import { Text, TouchableHighlight } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import { connect } from 'react-redux'

import { setBellSchedule, setEventCalendar, setStudentInfo } from '../actions'

import cheerio from 'react-native-cheerio';

const parseTime = time => {
    const parsedTime =  /([0-9]{1,2}):([0-9]{1,2}) ([AP])M/.exec(time);
    return parseInt(parsedTime[1]) * 60 + parseInt(parsedTime[2]) + (parseInt(parsedTime[1]) !== 12 && parsedTime[3] === 'P' ? 12 * 60 : 0);
};

const ScheduleCard = props => {
    const [scheduleMessage, setScheduleMessage] = useState('');
    const [initialized, setInitialized] = useState(props.bellSchedule.loaded && props.eventCalendar.loaded && props.studentInfo.loaded);

    useEffect(() => {
        if (!initialized) {
            fetch('https://portal.sfusd.edu/Home_PXP2.aspx', {
                method: 'GET',
                headers: {
                    Cookie: props.cookies
                }
            })
                .then(async res => {
                    const $ = cheerio.load(await res.text());

                    props.setStudentInfo({
                        name: /Good [a-zA-z]+, (.+), [0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/g.exec($('#Greeting').text())[1],
                        studentID: /ID: ([0-9]{8})/.exec($('.student-id').text())[1]
                    });
                });

            fetch('https://kajchang.github.io/LowellAPI/event_calendar.json')
                .then(async res => {
                    props.setEventCalendar(await res.json());
                });

            fetch('https://kajchang.github.io/LowellAPI/bell_schedules.json')
                .then(async res => {
                    props.setBellSchedule(await res.json());
                });

            setInitialized(true);
        }
    });

    if (props.bellSchedule.loaded && props.eventCalendar.loaded && scheduleMessage === '') {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const today = new Date;
        const minutes = today.getHours() * 60 + today.getMinutes();

        const code = props.eventCalendar[monthNames[today.getMonth()].toUpperCase()]['days'][String(today.getDate())];

        if (code === 'M' || code === 'N') {
            const scheduleType = code === 'M' ? 'Monday Meeting' : 'Tuesday - Friday';

            const blocks = Object.keys(props.bellSchedule[scheduleType]).map(block => ({
                block,
                startMinutes: parseTime(props.bellSchedule[scheduleType][block]['Start Time']),
                endMinutes: parseTime(props.bellSchedule[scheduleType][block]['End Time'])
            })).sort((a, b) => a['startMinutes'] - b['startMinutes']);

            if (minutes < blocks[0].startMinutes) {
                setScheduleMessage(`School starts at ${ props.bellSchedule[scheduleType][blocks[0].block]['Start Time'] } Today!`);
            } else if (minutes > blocks[blocks.length - 1].endMinutes) {
                const tomorrow = new Date()
                    .setDate(today.getDate() + 1);
                let tomorrowMessage;

                const code = props.eventCalendar[monthNames[tomorrow.getMonth()].toUpperCase()]['days'][String(today.getDate())];

                if (code === 'M' || code === 'N') {
                    const scheduleType = code === 'M' ? 'Monday Meeting' : 'Tuesday - Friday';
                    tomorrowMessage = `School starts at ${ props.bellSchedule[scheduleType]['1']['Start Time'] } tomorrow.`;
                } else {
                    tomorrowMessage = `Tomorrow is a ${ code } day!`
                }

                setScheduleMessage(`School is out for the day! ${ tomorrowMessage }.`);
            } else {
                for (const [idx, block] of blocks.entries()) {
                    if (minutes > block.startMinutes && minutes < block.endMinutes) {
                        setScheduleMessage(`Current Class is Period ${ block.block } which ends at ${ props.bellSchedule[scheduleType][block.block]['End Time'] }.`);
                        break;
                    } else if (minutes > block.endMinutes && minutes < blocks[idx + 1].startMinutes) {
                        setScheduleMessage(`Next Class is Period ${blocks[idx + 1].block} which starts at ${ props.bellSchedule[scheduleType][blocks[idx + 1].block]['Start Time'] }.`);
                        break;
                    }
                }
            }
        } else {
            setScheduleMessage(`Today is a ${ code } day!`)
        }
    }

    return (
        <Card>
            <Text style={ { fontSize: 18, padding: 10 } }>
                Student ID: { props.studentInfo.studentID }
            </Text>
            <TouchableHighlight
                style={ { paddingLeft: 10, paddingBottom: 10 } }
                onPress={ () => { props.navigation.replace('Barcode') } }
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
    cookies: state.cookies,
    bellSchedule: state.bellSchedule,
    eventCalendar: state.eventCalendar,
    studentInfo: state.studentInfo
});

const mapDispatchToProps = dispatch => ({
    setStudentInfo: studentInfo => dispatch(setStudentInfo(studentInfo)),
    setBellSchedule: bellSchedule => dispatch(setBellSchedule(bellSchedule)),
    setEventCalendar: eventCalendar => dispatch(setEventCalendar(eventCalendar))
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleCard);
