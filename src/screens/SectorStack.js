import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import {DeparturesListScreen} from "./DeparturesListScreen";
import {SectorScreen} from "./SectorScreen";
const Stack = createStackNavigator();
export const SectorStack = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="DeparturesListScreen">
            <Stack.Screen name={'DeparturesListScreen'} component={DeparturesListScreen}/>
            <Stack.Screen name={'SectorScreen'} component={SectorScreen}/>
        </Stack.Navigator>
    );
};

