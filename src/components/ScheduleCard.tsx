import * as React from 'react';
import { Text, TouchableHighlight } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';

import {
    IBellScheduleInterface,
    IClassInterface,
    IEventCalendarInterface,
    IStudentInfoInterface,
} from '../actions';

import { NavigationScreenProp } from 'react-navigation';

interface IScheduleCardProps {
    navigation: NavigationScreenProp<any, any>;
    classes: IClassInterface;
    cookies: string;
    bellSchedule: IBellScheduleInterface;
    eventCalendar: IEventCalendarInterface;
    studentInfo: IStudentInfoInterface;
}

const ScheduleCard = (props: IScheduleCardProps) => {
    return (
        <Card>
            <Text style={ { fontSize: 18, margin: 5 } }>
                Name: { props.studentInfo.name }
            </Text>
            <Text style={ { fontSize: 18, margin: 5 } }>
                Student ID: { props.studentInfo.studentID }
            </Text>
            <TouchableHighlight
                style={ { margin: 5 } }
                onPress={ () => { props.navigation.replace('Barcode'); } }
                underlayColor={ '#fff' }
            >
                <Text style={ { fontSize: 10, color: '#29a4a4' } }> Show Barcode</Text>
            </TouchableHighlight>
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

export default connect(mapStateToProps)(ScheduleCard);
