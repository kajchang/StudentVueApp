import * as React from 'react';
import { View } from 'react-native';

import { default as Barcode } from 'react-native-barcode-builder';
import { connect } from 'react-redux';

import { Header } from '../components';

import { NavigationScreenProp } from 'react-navigation';
import { IStudentInfoInterface } from '../actions';
import { IStateInterface } from '../reducers';

interface IBarcodeViewProps {
    navigation: NavigationScreenProp<any, any>;
    studentInfo: IStudentInfoInterface;
}

const BarcodeView = (props: IBarcodeViewProps) => <View>
    <Header
        name={ props.studentInfo.name }
        back={ 'Landing' }
        navigation={ props.navigation }
    />
    <Barcode
        value={ props.studentInfo.studentID }
    />
</View>;

const mapStateToProps = (state: IStateInterface) => ({
    studentInfo: state.studentInfo,
});

export default connect(mapStateToProps)(BarcodeView);
