import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {fetchTransitWarehouses} from "../redux/slices/transitWarehousesSlice";
import moment from "moment";
import {fetchSections} from "../redux/slices/sections/sectionsSlice";

export const DepartureItem = ({departure, onPress}) => {
    const [section, setSection] = useState('')
    const [warehouse, setWarehouse] = useState('')
    const sections = useSelector(state => state.sections.sections)
    const {warehouses} = useSelector(state => state.transitWarehousesSlice)
    const dispatch = useDispatch()
    useEffect(() => {
        if (!warehouses.length) return dispatch(fetchTransitWarehouses({}))
        if (!sections.length) return dispatch(fetchSections({}))
        const section = getSection()
        const warehouse = getTransitWarehouse(departure.transitWarehouseID)
        if(section) setSection(section.name)
        if(warehouse) setWarehouse(warehouse)
    }, [departure])

    const getSection = () => sections?.find(section => section.ID === departure?.sectionID)
    const getTransitWarehouse = (warehouseID) => {
        return warehouses?.find(warehouse => warehouse.ID === warehouseID)?.name
    }
    const navigateToDeparture = () => onPress(departure)
    return (
        <TouchableOpacity
            style={styles.listItem}
            onPress={navigateToDeparture}
        >
            <Text style={styles.itemTitle}>
                {`Отгрузка ${moment(departure.createdAt).format('DD.MM.YYYY')}`}
            </Text>
            <Text style={styles.itemStatus}>
                {section}
            </Text>
            <Text style={styles.itemStatus}>
                {warehouse}
            </Text>
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    listItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 55,
        marginVertical: 5,
        marginHorizontal: 15,
        paddingHorizontal: 10,
        padding: 5,
        backgroundColor: '#9B9B9B44',
        borderRadius: 5
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
})
