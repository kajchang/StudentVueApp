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
        back={ false }
        navigation={ props.navigation }
    />
    <ScheduleCard
        navigation={ props.navigation }
    />
    <Menu
        pages={ [
            {
                page: 'Messages',
                title: 'Messages',
            },
            {
                page: 'Calendar',
                title: 'Calendar',
            },
            {
                page: 'Attendance',
                title: 'Attendance',
            },
            {
                page: 'Grades',
                title: 'Grades',
            },
        ] }
        navigation={ props.navigation }
    />
</View>;

const mapStateToProps = (state: IStateInterface) => ({
    studentInfo: state.studentInfo,
});

export default connect(mapStateToProps)(LandingView);
