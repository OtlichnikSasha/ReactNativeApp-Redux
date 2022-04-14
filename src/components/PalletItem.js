import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {StyleSheet, Text, View, TouchableOpacity} from "react-native";

export const PalletItem = ({pallet, onPress}) => {
    const [point, setPoint] = useState('')
    const points = useSelector(state => state.points.points)
    useEffect(() => {
        const point = getPoint()
        setPoint(point)
    }, [pallet])

    const getPoint = () => {
        return points?.find(point => point.ID === pallet.pointID)?.name
    }
    const navigateToPalletPlaces = () => onPress(pallet)
    return (
        <View>
            {pallet ?
                <TouchableOpacity style={styles.pointItem} onPress={navigateToPalletPlaces}>
                    <View style={styles.inner}>
                        <Text style={styles.point}>
                            {point}
                        </Text>
                        <Text style={styles.pack}>
                            Поддон {pallet.ID} ({pallet.packsCount})
                        </Text>
                    </View>
                </TouchableOpacity>
                :
                <></>
            }
        </View>
    )
};


const styles = StyleSheet.create({
    pointItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderColor: "#bdbcbc"
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

