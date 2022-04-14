import {View, Text, StyleSheet, Alert} from 'react-native'
import {IconButton, Colors, Divider} from 'react-native-paper'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'

export const SectorPalletItem = ({ pack, onPress }) => {
    const openPlaceDamaged = (pack) => onPress(pack)
    return (
        <View>
            <View style={styles.storageItem}>
                <View style={styles.inner}>
                    <Text style={styles.packWithoutCellAndWar}>
                        Место {pack.code}
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
        paddingLeft: 10,
    },
    section: {
        fontSize: 16,
        width: "35%"
    },
    inner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pack: {
        fontSize: 16,
        width: "55%",
    },
    packWithoutCellAndWar: {
        fontSize: 16,
        width: "90%",
    }
})