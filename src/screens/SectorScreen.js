import React, {useEffect} from 'react'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import {StorageScreen} from './StorageScreen'
import {SectorPalletScreen} from './SectorPalletScreen'
import {useDispatch, useSelector} from 'react-redux'
import {reloadSectorPalletPacks} from "../redux/slices/sectorPalletsPacksSlice";

const Tab = createMaterialTopTabNavigator()

export const SectorScreen = ({route}) => {
    const {departure} = route.params
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(reloadSectorPalletPacks({departureID: departure.ID}))
    }, [route])
    const sectorTotal = useSelector(state => state.sectorPacks.total) || 0
    const palletTotal = useSelector(state => state.sectorPalletPacks.total) || 0
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle: { fontSize: 12 },
                lazy: true
            }}>
            <Tab.Screen
                name="StorageScreen"
                component={StorageScreen}
                options={{
                    tabBarLabelStyle: {fontSize: 14, fontWeight: '500'},
                    tabBarLabel: `На складе и на секторах (${sectorTotal})`
                }}
            initialParams={{departure : departure}}/>
            <Tab.Screen
                name="SectorPalletScreen"
                component={SectorPalletScreen}
                options={{
                    tabBarLabelStyle: {fontSize: 14, fontWeight: '500'},
                    tabBarLabel:`На поддоне (${palletTotal})`
                }}
                initialParams={{departure : departure}}/>
        </Tab.Navigator>
    )
}