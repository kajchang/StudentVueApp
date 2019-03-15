import * as React from 'react';
import { Text, TouchableHighlight } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import { connect } from 'react-redux';

import { default as cheerio } from 'react-native-cheerio';

import {
    IBellScheduleInterface,
    IClassInterface,
    IEventCalendarInterface,
    IStudentInfoInterface,
    setBellSchedule,
    setClasses,
    setEventCalendar,
    setStudentInfo,
} from '../actions';

import { NavigationScreenProp } from 'react-navigation';

interface IScheduleCardProps {
    navigation: NavigationScreenProp<any, any>;
    classes: IClassInterface;
    cookies: string;
    bellSchedule: IBellScheduleInterface;
    eventCalendar: IEventCalendarInterface;
    studentInfo: IStudentInfoInterface;
    setBellSchedule: (arg0: IBellScheduleInterface) => null;
    setClasses: (arg0: IClassInterface[]) => null;
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
    const [initialized, setInitialized] = React.useState(props.bellSchedule.loaded && props.eventCalendar.loaded && props.studentInfo.loaded && props.classes.loaded);

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

            fetch('https://portal.sfusd.edu/PXP2_ClassSchedule.aspx?AGU=0', {
                headers: {
                    Cookie: props.cookies,
                },
                method: 'GET',
            })
                .then(async (res) => {
                    const html = await res.text();

                    return fetch('https://portal.sfusd.edu/service/PXP2Communication.asmx/DXDataGridRequest', {
                        body: JSON.stringify({
                            request: {
                                agu: 0,
                                dataRequestType: 'Load',
                                dataSourceTypeName: /new DevExpress\.PXPRemoteDataStore\('([A-Z0-9-]+)'/.exec(html)[1],
                                gridParameters: /{"schoolName":"Lowell HS","orgYearGU":"[A-Z0-9-]+","studentSchYrGU":"[A-Z0-9-]+","AGU":"0","TermIndexForHomeSchool":1}/.exec(html)[0],
                                loadOptions:{
                                    group: null,
                                    requireTotalCount: true,
                                    searchOperation: 'contains',
                                    searchValue: null,
                                    skip: 0,
                                    sort: null,
                                    take: 15,
                                },
                            },
                        }),
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            Cookie: props.cookies,
                        },
                        method: 'POST',
                    });
                })
                .then(async (res) => {
                    const data = await res.json();

                    props.setClasses(data.d.Data.data.map(_class => ({
                        className: _class.CourseTitle,
                        id: _class.ID,
                        period: parseInt(_class.Period, 10),
                        roomName: _class.RoomName,
                        teacher: {
                            email: JSON.parse(_class.Teacher).email,
                            name: JSON.parse(_class.Teacher).teacherName,
                            sgu: JSON.parse(_class.Teacher).sgu,
                        },
                    })));
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

    if (props.bellSchedule.loaded && props.eventCalendar.loaded && props.classes.loaded && scheduleMessage === '') {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];

        const scheduleCodes = {
            E: 'Early Release',
            H: 'Holiday',
            R: 'Rally',
            S: 'Special',
            T: 'Testing',
        };

        const getTomorrowMessage = (): string => {
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            let tomorrowMessage;

            const tomorrowCode = props.eventCalendar.data
                [monthNames[tomorrow.getMonth()].toUpperCase()].days
                [String(tomorrow.getDate())];

            if (tomorrowCode === undefined) {
                tomorrowMessage = 'There is no school tomorrow!';
            } else if (tomorrowCode === 'M' || tomorrowCode === 'N') {
                const tomorrowScheduleType = tomorrowCode === 'M' ? 'Monday Meeting' : 'Tuesday - Friday';
                const firstClass = props.classes.data[0];
                tomorrowMessage = `Your first class tomorrow, ${ firstClass.className }, starts at ${ props.bellSchedule.data[tomorrowScheduleType][String(firstClass.period)]['Start Time'] }.`;
            } else {
                tomorrowMessage = `Tomorrow is a ${ scheduleCodes[tomorrowCode] } schedule day!`;
            }

            return tomorrowMessage;
        };

        const today = new Date();
        const minutes = today.getHours() * 60 + today.getMinutes();

        const code = props.eventCalendar.data
            [monthNames[today.getMonth()].toUpperCase()].days
            [String(today.getDate())];

        if (code === undefined) {
            setScheduleMessage('There is no school today!');
        } else if (code === 'M' || code === 'N') {
            const scheduleType = code === 'M' ? 'Monday Meeting' : 'Tuesday - Friday';

            const blocks = Object.keys(props.bellSchedule.data[scheduleType]).map(block => ({
                block,
                endMinutes: parseTime(props.bellSchedule.data[scheduleType][block]['End Time']),
                startMinutes: parseTime(props.bellSchedule.data[scheduleType][block]['Start Time']),
            })).sort((a, b) => a.startMinutes - b.startMinutes);

            if (minutes < blocks[0].startMinutes) {
                const firstClass = props.classes.data[0];
                setScheduleMessage(`School starts at ${ props.bellSchedule.data[scheduleType][blocks[0].block]['Start Time'] } Today! Your first class, ${ firstClass.className }, starts at ${ props.bellSchedule.data[scheduleType][String(firstClass.period)]['Start Time'] }.`);
            } else if (minutes > blocks[blocks.length - 1].endMinutes) {
                setScheduleMessage(`School is out for the day! ${ getTomorrowMessage() }`);
            } else {
                for (const [idx, block] of blocks.entries()) {
                    const currentBlock = block.block === 'Registry' ? 9 : parseInt(block.block, 10);

                    if (minutes > block.startMinutes && minutes < block.endMinutes) {
                        const currentClass = props.classes.data.find(_class => _class.period === currentBlock);

                        if (currentClass) {
                            setScheduleMessage(`Your current class is ${ currentClass.className } which ends at ${ props.bellSchedule.data[scheduleType][block.block]['End Time'] }.`);
                        } else {
                            const nextClass = props.classes.data.find(_class => _class.period > currentBlock);
                            setScheduleMessage(`Your have this block off! Your next class is ${ nextClass.className } which starts at ${ props.bellSchedule.data[scheduleType][blocks[idx + 1].block]['Start Time'] }.`);
                        }

                        break;
                    } else if (minutes >= block.endMinutes && minutes <= blocks[idx + 1].startMinutes) {
                        const nextClass = props.classes.data.find(_class => _class.period > currentBlock);
                        setScheduleMessage(`It is currently passing period, your next class is ${ nextClass.className } which starts at ${ props.bellSchedule.data[scheduleType][blocks[idx + 1].block]['Start Time'] }.`);

                        break;
                    }
                }
            }
        } else {
            if (minutes >= 15 * 60 + 30) {
                setScheduleMessage(`Today was a ${ scheduleCodes[code] } schedule day! ${ getTomorrowMessage() }`);
            } else {
                setScheduleMessage(`Today is a ${ scheduleCodes[code] } schedule day!`);
            }
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
    classes: state.classes,
    cookies: state.cookies,
    eventCalendar: state.eventCalendar,
    studentInfo: state.studentInfo,
});

const mapDispatchToProps = dispatch => ({
    setBellSchedule: bellSchedule => dispatch(setBellSchedule(bellSchedule)),
    setClasses: classes => dispatch(setClasses(classes)),
    setEventCalendar: eventCalendar => dispatch(setEventCalendar(eventCalendar)),
    setStudentInfo: studentInfo => dispatch(setStudentInfo(studentInfo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleCard);
