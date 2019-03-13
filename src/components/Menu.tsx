import * as React from 'react';
import { FlatList, TouchableHighlight } from 'react-native';
import { ListItem } from 'react-native-elements';

interface IPage {
    title: string;
    icon: {
        name: string,
        type?: string;
        size: number
    };
}

interface IMenuProps {
    pages: IPage[];
}

const Menu = (props: IMenuProps) => <FlatList
    scrollEnabled={ false }
    data={ props.pages }
    renderItem={ ({ item }) => <TouchableHighlight
        onPress={ () => {} }
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
