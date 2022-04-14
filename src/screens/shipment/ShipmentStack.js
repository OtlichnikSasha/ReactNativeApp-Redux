import React, {useCallback, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ShipmentScanForSearch} from './ShipmentScanForSearch'
import {ShipmentScanForCar} from './ShipmentScanForCar'
import {ShipmentChoosingCar} from './ShipmentChoosingCar'
import {ShipmentSectorScreen} from "./ShipmentSectorScreen";
import {ShipmentPlaceInfo} from "./ShipmentPlaceInfo";
import {ShipmentCellInfo} from "./ShipmentCellInfo";
import {ShipmentSectorItemsScreen} from "./ShipmentSectorItemsScreen";
import {ShipmentNeedShipPlaces} from "./ShipmentNeedShipPlaces";
import {ShipmentLoadPallet} from "./ShipmentLoadPallet";
import {ShipmentFastDeparture} from "./ShipmentFastDeparture";
import {ShipmentRemainingStack} from "./ShipmentRemainingStack";
import {ShipmentCellSelection} from "./ShipmentCellSelection";
import {ShipmentLoadPlacesInCell} from "./ShipmentLoadPlacesInCell";
import {ShipmentAllLoadAllPlacesInCell} from "./ShipmentAllLoadPlacesInCell";
import {PlaceHistory} from "../PlaceHistory";

const Stack = createStackNavigator();
export const ShipmentStack = () => {

    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name={'ShipmentSectorScreen'} component={ShipmentSectorScreen}/>
            <Stack.Screen name={'ShipmentScanForSearch'} component={ShipmentScanForSearch}/>
            <Stack.Screen name={'ShipmentPlaceInfo'} component={ShipmentPlaceInfo}/>
            <Stack.Screen name={'PlaceHistory'} component={PlaceHistory}/>
            <Stack.Screen name={'ShipmentCellInfo'} component={ShipmentCellInfo}/>
            <Stack.Screen name={'ShipmentScanForCar'} component={ShipmentScanForCar}/>
            <Stack.Screen name={'ShipmentChoosingCar'} component={ShipmentChoosingCar}/>
            <Stack.Screen name={'ShipmentSectorItemsScreen'} component={ShipmentSectorItemsScreen}/>
            <Stack.Screen name={'ShipmentNeedShipPlaces'} component={ShipmentNeedShipPlaces}/>
            <Stack.Screen name={'ShipmentLoadPallet'} component={ShipmentLoadPallet}/>
            <Stack.Screen name={'ShipmentFastDeparture'} component={ShipmentFastDeparture}/>
            <Stack.Screen name={'ShipmentRemainingStack'} component={ShipmentRemainingStack}/>
            <Stack.Screen name={'ShipmentLoadPlacesInCell'} component={ShipmentLoadPlacesInCell}/>
            <Stack.Screen name={'ShipmentAllLoadAllPlacesInCell'} component={ShipmentAllLoadAllPlacesInCell}/>
            <Stack.Screen name={'ShipmentCellSelection'} component={ShipmentCellSelection}/>
        </Stack.Navigator>
    );
};

