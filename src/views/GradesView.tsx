import * as React from 'react';
import { Text, View } from 'react-native';

import { Header } from '../components';

import { NavigationScreenProp } from 'react-navigation';

interface IAttendanceViewProps {
    navigation: NavigationScreenProp<any, any>;
}

const GradesView = (props: IAttendanceViewProps) => <View>
    <Header
        back={ true }
        navigation={ props.navigation }
    />
    <Text>This is the Grades page.</Text>
</View>;

export default GradesView;
