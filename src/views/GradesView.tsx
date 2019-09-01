import * as React from 'react';
import { View } from 'react-native';

import { Header, ThisText } from '../components';
import styles from '../styles';

import { NavigationScreenProp } from 'react-navigation';

interface IAttendanceViewProps {
    navigation: NavigationScreenProp<any, any>;
}

const GradesView = (props: IAttendanceViewProps) => <React.Fragment>
    <Header
        back={ true }
        navigation={ props.navigation }
    />
    <View style={ styles.container }>
        <ThisText>This is the Grades page.</ThisText>
    </View>
</React.Fragment>;

export default GradesView;
