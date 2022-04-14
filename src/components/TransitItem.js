import React from 'react'
import {View, Text, StyleSheet, Alert} from 'react-native'
import {IconButton, Colors, Divider} from 'react-native-paper'
export const TransitItem = ({ pack, onPress }) => {
    const openPlaceDamaged = (pack) => onPress(pack)
    return (
        <View>
            {pack ?
                <View style={styles.pointItem}>
                    <View style={styles.inner}>
                        <Text style={styles.pack}>
                            Место {pack.code}
                        </Text>
                        <Text style={styles.point}>
                            {pack.orderContractNumber}
                        </Text>
                    </View>
                    <IconButton
                        icon="dots-vertical"
                        color={Colors.grey500}
                        size={24}
                        onPress={() => openPlaceDamaged(pack)}
                    />
                </View>
                :
                null
            }
            <Divider/>
        </View>
    )
}
const styles = StyleSheet.create({
    pointItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10
    },
    point: {
        fontSize: 16,
        width: "25%",
    },
    inner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pack: {
        fontSize: 16,
        width: "60%"
    }
})