import * as React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';

import { BarcodeView, LandingView, LoginView } from './views';

const store = createStore(reducers);

const MainNavigator = createStackNavigator({
    Barcode: { screen: BarcodeView },
    Landing: { screen: LandingView },
    Login: { screen: LoginView },
},                                         {
    headerMode: 'none',
    initialRouteName: 'Login',
});

const AppContainer = createAppContainer(MainNavigator);

const App = () => <Provider store={ store }>
    <AppContainer/>
</Provider>;

export default App;
