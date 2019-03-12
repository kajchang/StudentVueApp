import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux'

import { Header, Menu, ScheduleCard } from '../components';

const LandingView = props => <View>
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

const mapStateToProps = state => ({
    studentInfo: state.studentInfo
});

export default connect(mapStateToProps)(LandingView);
