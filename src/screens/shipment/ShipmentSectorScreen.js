import React, {useCallback, useEffect, useState} from 'react'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import {useDispatch, useSelector} from 'react-redux'
import {fetchSections} from '../../redux/slices/sections/sectionsSlice'
import {ShipmentSectorItemsScreen} from './ShipmentSectorItemsScreen'
import {fetchTransitWarehouses} from "../../redux/slices/transitWarehousesSlice";

const Tab = createMaterialTopTabNavigator()

export const ShipmentSectorScreen = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        getSections()
    }, [])

    const getSections = useCallback(() => {
        if (!sections.length) {
            dispatch(fetchSections({}))
            dispatch(fetchTransitWarehouses({}))
        }
    }, [])

    const {sections} = useSelector(state => state.sections)
    if (!sections.length) return null;
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarScrollEnabled: true,
                tabBarLabelStyle: {fontSize: 12},
                tabBarItemStyle: {width: 150},
                lazy: true
            }}
        >
            {sections.map(section =>
                <Tab.Screen
                    name={`${section.ID}`}
                    component={ShipmentSectorItemsScreen}
                    key={section.ID}
                    options={
                        {
                            tabBarLabelStyle: {fontSize: 14, fontWeight: '500'},
                            tabBarLabel: `${section?.name} (${section.departure.packsCountInCar}/${section.departure['packsCount']})`
                        }
                    }
                    initialParams={{sectionID: section.ID}}/>
            )}
        </Tab.Navigator>
    )
}

