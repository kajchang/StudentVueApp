import { AsyncStorage } from 'react-native';

const setCredentials = (username: string, password: string) => {
    AsyncStorage.setItem('@StudentVue:credentials', JSON.stringify({
        password,
        username,
    }));
};
const getCredentials = () => AsyncStorage.getItem('@StudentVue:credentials');

export default {
    getCredentials,
    setCredentials,
};
