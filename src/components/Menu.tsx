import * as React from 'react';
import { FlatList, TouchableHighlight } from 'react-native';
import { ListItem } from 'react-native-elements';
import { NavigationScreenProp } from 'react-navigation';

interface IPage {
    title: string;
    icon: {
        name: string,
        type?: string;
        size: number;
    };
    page: string;
}

interface IMenuProps {
    navigation: NavigationScreenProp<any, any>;
    pages: IPage[];
}

const Menu = (props: IMenuProps) => <FlatList
    scrollEnabled={ false }
    data={ props.pages }
    renderItem={ ({ item }) => <TouchableHighlight
        onPress={ () => props.navigation.replace(item.page) }
        underlayColor={ '#29a4a4' }
    >
        <ListItem
            containerStyle={ { padding: 30 } }
            leftIcon={ item.icon }
            title={ item.title }
            chevron
        />
    </TouchableHighlight> }
    keyExtractor={ item => item.title }
/>;

export default Menu;
