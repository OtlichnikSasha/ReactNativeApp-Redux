import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'

export const DealerSearchItem = ({pack, onClick}) => {
    const statusDescription = (s) => {
        if(!s) return ''
        if (s === 'PRODUCTION') return 'Изготавливается'
        if (s === 'DONE' || "PREPARE_TO_DELIVERY" || "ON_STORE") return 'Готово к отгрузке'
        if (s === 'DELIVERY') return 'В пути'
        if (s === 'ON_TRANSIT_STORE') return 'В Логистическом центре'
        if (s === 'GIVEN_TO_CLIENT') return 'Отгружен из Логистического центра'
    };
    const navigationToItem = () => onClick(pack)
    return (
        <View>
            <TouchableOpacity
                style={styles.pointItem}
                onPress={navigationToItem}
            >
                {
                    pack['entity'] === 'order' ?
                    <View style={styles.inner}>
                        <Text style={styles.pack}>
                            Заказ {pack.data.number}
                        </Text>
                    </View>
                    : <></>
                }
                {
                    pack['entity'] === 'subOrder' ?
                        <View style={styles.inner}>
                            <Text style={styles.pack}>
                                Подзаказ {pack.data.name}
                            </Text>
                            <Text style={styles.itemStatus}>
                                {statusDescription(pack.data.deliveryStatus)}
                            </Text>
                            <Text style={styles.itemCount}>{pack.data.packsCount}</Text>
                        </View>
                        :
                    <></>
                }
                {
                    pack['entity'] === 'pack' ?
                        <View style={styles.inner}>
                            <Text style={styles.packPack}>
                                Место {pack.data.code}
                            </Text>
                            {pack.data.details ? <Text style={styles.itemCount}>{pack.data.details.length}</Text>
                                : <></>}
                        </View>
                        : <></>
                }

            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    pointItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        backgroundColor: "#c5c3c3",
        paddingVertical: 8,
        margin: 10
    },
    point: {
        fontSize: 16,
        width: "25%",
    },
    inner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between"
    },
    pack: {
        fontSize: 16,
        width: "60%",
        fontWeight: "bold"
    },
    packPack: {
        fontSize: 16,
        width: "80%",
        fontWeight: "bold"
    },
    itemStatus: {
        width: '30%',
        fontSize: 12,
    },
    itemCount: {
        fontSize: 16,
        fontWeight: '900',
    },
})