import {View, Text, StyleSheet, Alert, Dimensions} from 'react-native'
import {IconButton, Colors, Divider} from 'react-native-paper'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'

export const ShipmentItem = ({ pack, onPress }) => {
    const [warehouse, setWarehouses] = useState('')
    const [cell, setCells] = useState('')
    const warehouses = useSelector(state => state.warehouses.warehouses)
    const cells = useSelector(state => state.cells.cells)
    useEffect(() => {
        const cell = getCell()
        if (cell?.warehouseID) {
            setCells(cell?.data)
            const warehouse = getWarehouse(cell.warehouseID)
            setWarehouses(warehouse)
        }
    }, [pack])

    const getCell = () => {
        return cells?.find(cell => cell.ID === pack?.storageCellID)
    }
    const getWarehouse = (cellWarehouseID) => {
        return warehouses?.find(warehouse => warehouse.ID === cellWarehouseID)?.name
    }

    const openPlaceDamaged = (pack) => onPress(pack)
    return (
        <View>
            <View style={styles.storageItem}>
                <View style={styles.inner}>
                    <Text style={styles.point}>
                        {pack.storageCellID ? warehouse : '' }
                    </Text>
                    <Text style={styles.point}>
                        {pack.storageCellID ? cell : ''}
                    </Text>
                    <Text style={styles.pack}>
                        Место {pack.code}
                        {pack.status === "DELIVERY" ? <Text>
                                ✅
                            </Text>
                            : null
                        }
                    </Text>
                </View>
                <IconButton
                    icon="dots-vertical"
                    color={Colors.grey500}
                    size={24}
                    onPress={() => openPlaceDamaged(pack)}
                />
            </View>

            <Divider />
        </View>
    )
}
const styles = StyleSheet.create({
    storageItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    point: {
        marginRight: 5,
        fontSize: 20
    },
    inner: {
        flexDirection: 'row'
    },
    pack: {
        fontSize: 20
    }
})