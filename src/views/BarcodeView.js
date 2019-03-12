import React from 'react';
import { View } from 'react-native';
import Barcode from 'react-native-barcode-builder';
import { connect } from 'react-redux';

import { Header } from '../components';

const BarcodeView = props => <View>
    <Header
        name={ props.studentInfo.name }
        back={ 'Landing' }
        navigation={ props.navigation }
    />
    <Barcode
        value={ props.studentInfo.studentID }
    />
</View>;

const mapStateToProps = state => ({
    studentInfo: state.studentInfo
});

export default connect(mapStateToProps)(BarcodeView);
