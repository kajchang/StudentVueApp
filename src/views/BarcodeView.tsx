import * as React from 'react';
import { View } from 'react-native';
// @ts-ignore
import Barcode from 'react-native-barcode-builder';
import { connect } from 'react-redux';

import { Header } from '../components';

import { NavigationScreenProp } from 'react-navigation';
import { StateInterface } from '../reducers';
import { StudentInfoInterface } from '../actions';

interface BarcodeViewProps {
    navigation: NavigationScreenProp<any, any>;
    studentInfo: StudentInfoInterface;
}

const BarcodeView = (props: BarcodeViewProps) => <View>
    <Header
        name={ props.studentInfo.name }
        back={ 'Landing' }
        navigation={ props.navigation }
    />
    <Barcode
        value={ props.studentInfo.studentID }
    />
</View>;

const mapStateToProps = (state: StateInterface) => ({
    studentInfo: state.studentInfo
});

export default connect(mapStateToProps)(BarcodeView);
