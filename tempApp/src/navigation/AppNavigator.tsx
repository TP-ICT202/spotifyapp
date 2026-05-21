import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();

const Home = () => (
  <View>
    <Text>Home</Text>
  </View>
);

const Search = () => (
  <View>
    <Text>Search</Text>
  </View>
);

const Library = () => (
  <View>
    <Text>Library</Text>
  </View>
);

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Search" component={Search} />
        <Tab.Screen name="Library" component={Library} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}