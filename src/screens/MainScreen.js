import React, {useEffect} from 'react'
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs'
import {FontAwesome5} from '@expo/vector-icons'
import {useDispatch, useSelector} from 'react-redux'
import {Text} from 'react-native'
import {WareHouseScreen} from './WareHouseScreen'
import {clearPointPalletPacks, reloadPointPalletPacks} from '../redux/slices/pointsPalletsPacksSlice'
import {fetchWarehouses} from "../redux/slices/warehouseSlice";
import {fetchSections} from "../redux/slices/sections/sectionsSlice";
import {fetchCells} from '../redux/slices/cellsSlice'
import {SectorStack} from "./SectorStack";
import {fetchPacksCount} from "../redux/slices/packsCountSlice";
const Tab = createMaterialBottomTabNavigator()

export const MainScreen = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        getSectorTotal()
    }, [])

    const getSectorTotal = () => {
        dispatch(clearPointPalletPacks())
        dispatch(fetchWarehouses({}))
        dispatch(fetchSections({}))
        dispatch(fetchCells({}))

        dispatch(reloadPointPalletPacks({}))
        dispatch(fetchPacksCount({}))
    }

    const totalPreparedPallet = useSelector(state => state.preparedPalletsSlice.packsTotal)
    const totalPointPacks = useSelector(state => state.pointPacks.total)
    const totalPointPalletPacks = useSelector(state => state.pointPalletPacks.total)

    const sectorTotal = useSelector(state => state.packsCount.result) || 0
    return (
        <Tab.Navigator
            activeColor="#1890FF"
            inactiveColor="#5a5a5a"
            barStyle={{backgroundColor: '#fff'}}
        >
            <Tab.Screen name="Склад"
                        component={WareHouseScreen}
                        options={{
                            headerShown: false,
                            tabBarLabel: <Text style={{fontSize: 13}}>Склад</Text>,
                            tabBarIcon: ({color}) => (
                                <FontAwesome5 name="warehouse" size={20} color={color}/>
                            ),
                            tabBarBadge: (totalPointPacks + totalPointPalletPacks + totalPreparedPallet)
                        }}/>
            <Tab.Screen name="Сектор"
                        component={SectorStack}
                        options={{
                            headerShown: false,
                            tabBarLabel: <Text style={{fontSize: 13}}>Сектор</Text>,
                            tabBarIcon: ({color}) => (
                                <FontAwesome5 name="truck-loading" size={20} color={color}/>
                            ),
                            tabBarBadge: (sectorTotal)
                        }}/>
        </Tab.Navigator>

    )
}



