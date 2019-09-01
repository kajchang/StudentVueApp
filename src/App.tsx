import * as React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import { Font } from 'expo';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';

import {
    AttendanceView,
    BarcodeView,
    CalendarView,
    GradesView,
    LandingView,
    LoginView,
    MessagesView,
} from './views';

const store = createStore(reducers);

const MainNavigator = createStackNavigator({
    Attendance: { screen: AttendanceView },
    Barcode: { screen: BarcodeView },
    Calendar: { screen: CalendarView },
    Grades: { screen: GradesView },
    Landing: { screen: LandingView },
    Login: { screen: LoginView },
    Messages: { screen: MessagesView },
},                                         {
    headerMode: 'none',
    initialRouteName: 'Login',
});

const AppContainer = createAppContainer(MainNavigator);

const App = () => {
    const [fontLoaded, setFontLoaded] = React.useState(false);

    React.useEffect(() => {
        async function loadFont() {
            await Font.loadAsync({
                'Product Sans': require('./assets/ProductSans-Regular.ttf'),
            });
            await Font.loadAsync({
                'Product Sans Bold': require('./assets/ProductSans-Bold.ttf'),
            });
            setFontLoaded(true);
        }

        loadFont();
    },              []);

    return (
        fontLoaded ? <Provider store={ store }>
            <AppContainer/>
        </Provider> : null
    );
};

export default App;
