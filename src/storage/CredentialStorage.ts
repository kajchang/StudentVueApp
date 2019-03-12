import { AsyncStorage } from 'react-native';

export interface Credentials {
    username: string;
    password: string;
}

const setCredentials = (username: string, password: string) => {
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
