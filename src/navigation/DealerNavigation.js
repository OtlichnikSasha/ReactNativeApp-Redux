import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {MyOrdersScreen} from '../screens/dealer/MyOrdersScreen';
import {OrderScreen} from '../screens/dealer/OrderScreen';
import PackInfoScreen from '../screens/dealer/PackInfoScreen';
import PackInfoShippedDetailsScreen from '../screens/dealer/PackInfoShippedDetailsScreen';
import PackInfoManufacturedScreen from '../screens/dealer/PackInfoManufacturedScreen';
import PackInfoShippedScreen from '../screens/dealer/PackInfoShippedScreen';
import {DealerSearchList} from '../screens/dealer/DealerSearchList';
import {ShipmentPlaceInfo} from '../screens/shipment/ShipmentPlaceInfo';

const Stack = createStackNavigator();

export const DealerNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={'MyOrders'} component={MyOrdersScreen} />
      <Stack.Screen name={'OrderScreen'} component={OrderScreen} />
      <Stack.Screen name={'PackInfo'} component={PackInfoScreen} />
      <Stack.Screen name={'PackInfoManufactured'} component={PackInfoManufacturedScreen}/>
      <Stack.Screen name={'PackInfoShipped'} component={PackInfoShippedScreen}/>
      <Stack.Screen name={'PackInfoShippedDetails'} component={PackInfoShippedDetailsScreen}/>

      <Stack.Screen name={'DealerSearchList'} component={DealerSearchList}/>
      <Stack.Screen name={'ShipmentPlaceInfo'} component={ShipmentPlaceInfo}/>
    </Stack.Navigator>
  );
};
