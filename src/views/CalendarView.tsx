import * as React from 'react';
import { Text, View } from 'react-native';

import { Header } from '../components';

import { NavigationScreenProp } from 'react-navigation';

interface IAttendanceViewProps {
    navigation: NavigationScreenProp<any, any>;
}

const CalendarView = (props: IAttendanceViewProps) => <View>
    <Header
        back={ true }
        navigation={ props.navigation }
    />
    <Text>This is the Calendar page.</Text>
</View>;

export default CalendarView;
