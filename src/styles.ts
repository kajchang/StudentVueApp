import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    header: {
        fontSize: 36,
        padding: 25
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    bordered: {
        width: '75%',
        height: 50,
        margin: 2.5,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da'
    },
    textCentered: {
        textAlign: 'center',
    },
    slightlyPadded: {
        paddingTop: 15,
        paddingBottom: 15
    }
});

export default styles;
