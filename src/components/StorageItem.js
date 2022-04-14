import {View, Text, StyleSheet, Alert} from 'react-native'
import {IconButton, Colors, Divider} from 'react-native-paper'
import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {fetchSections} from "../redux/slices/sections/sectionsSlice";

export const StorageItem = ({pack, onPress}) => {
    const [warehouse, setWarehouse] = useState('')
    const [cell, setCell] = useState('')
    const [sector, setSector] = useState('')
    const warehouses = useSelector(state => state.warehouses.warehouses)
    const cells = useSelector(state => state.cells.cells)
    const {sections} = useSelector(state => state.sections)
    const dispatch = useDispatch();

    useEffect(() => {
        if (!sections.length) {
            dispatch(fetchSections({}))
        }
        if (pack.status !== "STAYED_ON_SECTOR") {
            const getcell = getCell()
            setCell(getcell?.data)
            if (getcell?.warehouseID) {
                const warehouse = getWarehouse(getcell.warehouseID)
                setWarehouse(warehouse)
            }
        }
        else{
            setSector(getSector(pack.sectionID))
        }
    }, [pack])

    const getCell = () => {
        return cells?.find(cell => cell.ID === pack?.storageCellID)
    }

    const getWarehouse = (cellWarehouseID) => {
        return warehouses?.find(warehouse => warehouse.ID === cellWarehouseID)?.name
    }

    const getSector = (sectionID) => {
        return sections?.find(section => section.ID === sectionID)?.name
    }

    const openPlaceDamaged = (pack) => onPress(pack)
    return (
        <View>
            <View style={styles.storageItem}>
                <View style={styles.inner}>
                    {warehouse ?
                        <Text style={styles.fs}>
                            {warehouse}
                        </Text> : null}
                    {cell ?
                        <Text style={styles.fs}>
                            {cell}
                        </Text> : null}
                    <Text style={warehouse && cell || sector ? styles.fs : styles.packWithoutCellAndWar}>
                        Место {pack.code}
                    </Text>
                    {sector ?
                        <Text style={styles.fs}>
                            {sector}
                        </Text> : null}
                </View>
                <IconButton
                    icon="dots-vertical"
                    color={Colors.grey500}
                    size={24}
                    onPress={() => openPlaceDamaged(pack)}
                />
            </View>

            <Divider/>
        </View>
    )
}
const styles = StyleSheet.create({
    storageItem: {
        flex: 1,
        paddingLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    fs: {
        fontSize: 16,
        marginRight: 5
    },
    inner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: "wrap",
        width: "90%"
    },

    packWithoutCellAndWar: {
        fontSize: 16,
        width: "90%",
    }
})