import * as React from 'react';
import { Text, View } from 'react-native';

import { Header } from '../components';
import styles from '../styles';

import { NavigationScreenProp } from 'react-navigation';

interface IAttendanceViewProps {
    navigation: NavigationScreenProp<any, any>;
}

const CalendarView = (props: IAttendanceViewProps) => <React.Fragment>
    <Header
        back={ true }
        navigation={ props.navigation }
    />
    <View style={ styles.container }>
        <Text>This is the Calendar page.</Text>
    </View>
</React.Fragment>;

export default CalendarView;
