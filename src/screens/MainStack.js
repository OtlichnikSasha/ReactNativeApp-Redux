import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import {MainScreen} from "./MainScreen";
import {LoadPlacesInPallet} from "./LoadPlacesInPallet";
import {PalletScreen} from "./PalletScreen";
import {CellSelection} from "./CellSelection";
import {LoadPlaceInCell} from "./LoadPlaceInCell";
import {ShipmentScanForSearch} from "./shipment/ShipmentScanForSearch";
import {ShipmentPlaceInfo} from "./shipment/ShipmentPlaceInfo";
import {ShipmentCellInfo} from "./shipment/ShipmentCellInfo";
import {LoadSectorPallet} from "./LoadSectorPallet";
import {LoadPlaceInSector} from "./LoadPlaceInSector";
import {LoadAllPlacesInCell} from "./LoadAllPlacesInCell";
import {DealerSearchList} from "./dealer/DealerSearchList";
import {PlaceHistory} from "./PlaceHistory";

const Stack = createStackNavigator();
export const MainStack = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="MainScreen">
            <Stack.Screen name={'MainScreen'} component={MainScreen}/>
            <Stack.Screen name={'LoadPlacesInPallet'} component={LoadPlacesInPallet}/>
            <Stack.Screen name={'CellSelection'} component={CellSelection}/>
            <Stack.Screen name={'LoadPlaceInCell'} component={LoadPlaceInCell}/>
            <Stack.Screen name={'LoadSectorPallet'} component={LoadSectorPallet}/>
            <Stack.Screen name={'LoadPlaceInSector'} component={LoadPlaceInSector}/>
            <Stack.Screen name={'LoadAllPlacesInCell'} component={LoadAllPlacesInCell}/>
            <Stack.Screen name={'PalletScreen'} component={PalletScreen}/>

            <Stack.Screen name={'ShipmentScanForSearch'} component={ShipmentScanForSearch}/>
            <Stack.Screen name={'ShipmentPlaceInfo'} component={ShipmentPlaceInfo}/>
            <Stack.Screen name={'PlaceHistory'} component={PlaceHistory}/>
            <Stack.Screen name={'ShipmentCellInfo'} component={ShipmentCellInfo}/>
            <Stack.Screen name={'DealerSearchList'} component={DealerSearchList}/>
        </Stack.Navigator>
    );
};