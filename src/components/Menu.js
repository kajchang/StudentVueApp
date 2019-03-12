import React from 'react';
import { FlatList, TouchableHighlight } from 'react-native';
import { ListItem } from 'react-native-elements';

const Menu = ({ pages }) => <FlatList
    scrollEnabled={ false }
    data={ pages }
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
