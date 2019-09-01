import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    baseText: {
        fontFamily: 'Product Sans',
    },
    bordered: {
        borderColor: '#d6d7da',
        borderRadius: 4,
        borderWidth: 0.5,
    },
    container: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center',
    },
    control: {
        padding: 15,
    },
    header: {
        fontFamily: 'Product Sans Bold',
        fontSize: 42,
    },
    item: {
        height: 50,
        margin: 2.5,
        width: '75%',
    },
    textCentered: {
        textAlign: 'center',
    },
});

export default styles;
