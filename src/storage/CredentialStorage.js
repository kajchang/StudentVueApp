import { AsyncStorage } from 'react-native';

const setCredentials = (username, password) => {
    AsyncStorage.setItem('@StudentVue:credentials', JSON.stringify({
        username: username,
        password: password
    }));
};
const getCredentials = () => AsyncStorage.getItem('@StudentVue:credentials');

const setCookies = (sessionId) => AsyncStorage.setItem('@StudentVue:sessionId', sessionId);
const getCookies = () => AsyncStorage.getItem('@StudentVue:sessionId');

export default {
    setCredentials: setCredentials,
    getCredentials: getCredentials,
    setCookies: setCookies,
    getCookies: getCookies
};
