import * as React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux'
import { NavigationScreenProp } from 'react-navigation';

import { Header, Menu, ScheduleCard } from '../components';

import { StateInterface } from '../reducers';
import { StudentInfoInterface } from '../actions';

interface LandingViewProps {
    navigation: NavigationScreenProp<any, any>;
    studentInfo: StudentInfoInterface;
}

const LandingView = (props: LandingViewProps) => <View>
    <Header
        name={ props.studentInfo.name }
        navigation={ props.navigation }
    />
    <ScheduleCard
        navigation={ props.navigation }
    />
    <Menu
        pages={ [
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
        ] }
    />
</View>;

const mapStateToProps = (state: StateInterface) => ({
    studentInfo: state.studentInfo
});

export default connect(mapStateToProps)(LandingView);
