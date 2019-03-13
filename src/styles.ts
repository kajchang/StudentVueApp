import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    bordered: {
        borderColor: '#d6d7da',
        borderRadius: 4,
        borderWidth: 0.5,
        height: 50,
        margin: 2.5,
        width: '75%',
    },
    container: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center',
    }, header: {
        fontSize: 36,
        padding: 25,
    },
    slightlyPadded: {
        paddingBottom: 15,
        paddingTop: 15,
    },
    textCentered: {
        textAlign: 'center',
    },
});

export default styles;
