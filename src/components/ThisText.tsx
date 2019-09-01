import * as React from 'react';
import { Text } from 'react-native';

import styles from '../styles';

const ThisText = props => <Text { ...props } style={ [styles.baseText, props.style] }>
    { props.children }
</Text>;

export default ThisText;
