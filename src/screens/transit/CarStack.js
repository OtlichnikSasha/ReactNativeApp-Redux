import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TransitCarListScreen } from './TransitCarListScreen';
import { TransitPlacesListScreen } from './TransitPlacesListScreen';
import {AcceptCar} from "./AcceptCar";
import {DealerSearchList} from "../dealer/DealerSearchList";

const Stack = createStackNavigator();

export const CarStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={'TransitCarListScreen'} component={TransitCarListScreen}/>
      <Stack.Screen name={'PlacesList'} component={TransitPlacesListScreen} />

      <Stack.Screen name={'AcceptCar'} component={AcceptCar} />
      <Stack.Screen name={'DealerSearchList'} component={DealerSearchList} />
    </Stack.Navigator>
  );
};
