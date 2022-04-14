import React from 'react'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import {PointScreen} from './PointScreen'
import {PointPalletScreen} from './PointPalletScreen'
import {useSelector} from 'react-redux'

const Tab = createMaterialTopTabNavigator()

export const WareHouseScreen = () => {
    const preparedPalletTotal = useSelector(state => state.preparedPalletsSlice.packsTotal) || 0
    const pointTotal = useSelector(state => state.pointPacks.total) || 0
    const palletTotal = useSelector(state => state.pointPalletPacks.total) || 0
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle: {fontSize: 12},
                lazy: true
            }}>
            <Tab.Screen name='Point'
                component={PointScreen}
                options={{
                    tabBarLabelStyle: {fontSize: 14, fontWeight: '500'},
                    tabBarLabel: `На точках (${pointTotal + preparedPalletTotal})`
            }}/>
            <Tab.Screen name='PointPallet'
                component={PointPalletScreen}
                options={{
                    tabBarLabelStyle: {fontSize: 14, fontWeight: '500'},
                    tabBarLabel: `На поддонах (${palletTotal})`
            }}/>
        </Tab.Navigator>
    )
}