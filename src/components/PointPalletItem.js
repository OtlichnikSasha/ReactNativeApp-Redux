import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {IconButton, Colors, Divider} from 'react-native-paper'

export const PointPalletItem = ({ pack, onPress }) => {
    const openPlaceDamaged = (pack) => onPress(pack)
    return (
        <View>
            {pack ?
                <View style={styles.pointItem}>
                    <View style={styles.inner}>
                        <Text style={styles.pack}>
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
        alignItems: 'center',
        paddingLeft: 10

    },
    point: {
        marginRight: 8,
        fontSize: 16
    },
    inner: {
        flexDirection: 'row'
    },
    pack: {
        fontSize: 16
    }
})