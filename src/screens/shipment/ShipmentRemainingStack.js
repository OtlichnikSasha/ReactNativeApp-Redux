import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {ShipmentRemainingSector} from "./ShipmentRemainingSector";
import {ShipmentRemainingPallet} from "./ShipmentRemainingPallet";
import {reloadShipmentPalletPacks} from "../../redux/slices/shipments/shipmentPalletPacks";
const Tab = createMaterialTopTabNavigator()
export const ShipmentRemainingStack = ({route}) => {
    const {section, departureID, packIDs} = route.params
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(reloadShipmentPalletPacks({}))
    }, [route])

    const {total} = useSelector(state => state.shipmentPartialPacksSlice)
    const palletTotal = useSelector(state => state.shipmentPalletPacks.total)
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle: {fontSize: 12},
                lazy: true
            }}
        >
            <Tab.Screen name="ShipmentRemainingSector"
                        component={ShipmentRemainingSector}
                        options={{
                            tabBarLabelStyle: {fontSize: 14, fontWeight: '500'},
                            tabBarLabel: `${section.name} (${total})`
                        }}
                        initialParams={{sectionID: section.ID, departureID: departureID, packIDs}}

            />
            <Tab.Screen name="ShipmentRemainingPallet"
                        component={ShipmentRemainingPallet}
                        options={{
                            tabBarLabelStyle: {fontSize: 14, fontWeight: '500'},
                            tabBarLabel: `На поддоне (${palletTotal})`
                        }}
                        initialParams={{sectionID: section.ID}}
            />
        </Tab.Navigator>
    );
};

