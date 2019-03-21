import * as React from 'react';
import { FlatList, TouchableHighlight } from 'react-native';
import { ListItem } from 'react-native-elements';
import { NavigationScreenProp } from 'react-navigation';

interface IPage {
    title: string;
    page: string;
}

interface IMenuProps {
    navigation: NavigationScreenProp<any, any>;
    pages: IPage[];
}

const Menu = (props: IMenuProps) => <FlatList
    style={ { paddingVertical: 15, paddingHorizontal: 15 } }
    scrollEnabled={ false }
    data={ props.pages }
    renderItem={ ({ item }) => <TouchableHighlight
        onPress={ () => props.navigation.replace(item.page) }
        underlayColor={ '#29a4a4' }
    >
        <ListItem
            containerStyle={ { margin: 5, padding: 30, borderWidth: 1, borderColor: '#e1e8ee' } }
            titleStyle={ { textAlign: 'center' } }
            title={ item.title }
        />
    </TouchableHighlight> }
    keyExtractor={ item => item.title }
/>;

export default Menu;
