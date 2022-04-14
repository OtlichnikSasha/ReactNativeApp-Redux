import React, {useEffect, useCallback} from 'react';
import {Text} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {FontAwesome5} from '@expo/vector-icons';
import {CarStack} from '../screens/transit/CarStack';
import {TransitPlaceConfirmScreen} from '../screens/transit/TransitPlaceConfirmScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {TransitWarehouseScreen} from '../screens/transit/TransitWarehouseScreen';
import {LoadZoneDealer} from '../screens/transit/LoadZoneDealer';
import {useDispatch, useSelector} from 'react-redux';
import {reloadWarehousePacks} from "../redux/slices/transit/transitWhSlice";
import {ShipmentScanForSearch} from "../screens/shipment/ShipmentScanForSearch";
import {ShipmentPlaceInfo} from "../screens/shipment/ShipmentPlaceInfo";
import {ShipmentCellInfo} from "../screens/shipment/ShipmentCellInfo";
import {LoadZoneWarehouse} from "../screens/transit/LoadZoneWarehouse";
import {PlaceHistory} from "../screens/PlaceHistory";

const Tab = createMaterialBottomTabNavigator();

const TransitBottomTabNavigator = () => {
    const dispatch = useDispatch()
    useEffect(async () => {
        await getTabBarBadge()
    }, [])

    const getTabBarBadge = useCallback(() => {
        dispatch(reloadWarehousePacks({}))
    }, [])

    const totalDp = useSelector((state) => state.departuresForTransit.total);
    const totalWh = useSelector((state) => state.warehousePacks.total);

    return (
        <Tab.Navigator
            activeColor="#1890FF"
            inactiveColor="#5A5A5A"
            barStyle={{backgroundColor: '#FFF'}}
        >
            <Tab.Screen
                name="Машина"
                component={CarStack}
                options={{
                    headerShown: false,
                    tabBarLabel: <Text style={{fontSize: 13}}>Машина</Text>,
                    tabBarIcon: ({color}) => (
                        <FontAwesome5 name="truck" size={18} color={color}/>
                    ),
                    tabBarBadge: totalDp,
                }}
            />
            <Tab.Screen
                name="Склад"
                component={TransitWarehouseScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: <Text style={{fontSize: 13}}>Склад</Text>,
                    tabBarIcon: ({color}) => (
                        <FontAwesome5 name="warehouse" size={18} color={color}/>
                    ),
                    tabBarBadge: totalWh,
                }}
            />
        </Tab.Navigator>
    );
};

const Stack = createStackNavigator();

export const TransitNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name={'TransitBottomTabNavigator'} component={TransitBottomTabNavigator}/>
            <Stack.Screen name={'Confirm'} component={TransitPlaceConfirmScreen}/>
            <Stack.Screen name={'LoadZoneDealer'} component={LoadZoneDealer}/>
            <Stack.Screen name={'LoadZoneWarehouse'} component={LoadZoneWarehouse}/>

            <Stack.Screen name={'ShipmentScanForSearch'} component={ShipmentScanForSearch}/>
            <Stack.Screen name={'ShipmentPlaceInfo'} component={ShipmentPlaceInfo}/>
            <Stack.Screen name={'PlaceHistory'} component={PlaceHistory}/>
            <Stack.Screen name={'ShipmentCellInfo'} component={ShipmentCellInfo}/>
        </Stack.Navigator>
    );
};
