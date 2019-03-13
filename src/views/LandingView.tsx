import * as React from 'react';
import { View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { connect } from 'react-redux';

import { Header, Menu, ScheduleCard } from '../components';

import { IStudentInfoInterface } from '../actions';
import { IStateInterface } from '../reducers';

interface ILandingViewProps {
    navigation: NavigationScreenProp<any, any>;
    studentInfo: IStudentInfoInterface;
}

const LandingView = (props: ILandingViewProps) => <View>
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
                icon: { name: 'message', size: 30 },
                title: 'Messages',
            },
            {
                icon: { name: 'calendar', type: 'entypo', size: 30 },
                title: 'Calendar',
            },
            {
                icon: { name: 'notebook', type: 'simple-line-icon', size: 30 },
                title: 'Attendance',
            },
            {
                icon: { name: 'grade', size: 30 },
                title: 'Grades',
            },
        ] }
    />
</View>;

const mapStateToProps = (state: IStateInterface) => ({
    studentInfo: state.studentInfo,
});

export default connect(mapStateToProps)(LandingView);
