import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {StyleSheet, Text, View} from "react-native";
import {Colors, IconButton} from "react-native-paper";

export const NeedShipItem = ({pack, onPress}) => {
    const [subOrder, setSubOrder] = useState('')
    const subOrders = useSelector(state => state.subOrders.subOrders)
    useEffect(() => {
        const subOrd = getSubOrder()
        if(subOrd) setSubOrder(subOrd?.name)
    }, [pack])

    const getSubOrder = () => subOrders?.find(subOrder => subOrder.ID === pack?.subOrderID)
    const openPlaceDamaged = (pack) => onPress(pack)
    return (
        <View>
            <View style={styles.storageItem}>
                <View style={styles.inner}>
                    <Text style={styles.pack}>
                        Место {pack.code}
                        {pack.status === "DELIVERY" ? <Text>
                                ✅
                            </Text>
                            : null
                        }
                    </Text>
                    <Text style={styles.point}>
                        {subOrder ? "Подзаказ " + subOrder : ''}
                    </Text>
                </View>
                <IconButton
                    icon="dots-vertical"
                    color={Colors.grey500}
                    size={24}
                    onPress={() => openPlaceDamaged(pack)}
                />
            </View>
        </View>
    )
};
const styles = StyleSheet.create({
    storageItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    point: {
        marginRight: 5,
        fontSize: 16,
        width: "34%"
    },
    inner: {
        flexDirection: 'row',
        alignItems: "center"
    },
    pack: {
        fontSize: 16,
        width: "55%"
    }
})