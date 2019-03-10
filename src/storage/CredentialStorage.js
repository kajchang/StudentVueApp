import { AsyncStorage } from 'react-native';

const setCredentials = (username, password) => {
    AsyncStorage.setItem('@StudentVue:credentials', JSON.stringify({
        username: username,
        password: password
    }));
};
const getCredentials = () => AsyncStorage.getItem('@StudentVue:credentials');

export default {
    setCredentials: setCredentials,
    getCredentials: getCredentials
};
