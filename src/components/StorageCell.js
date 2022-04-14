import React from 'react'
import {Text, View, StyleSheet} from "react-native";

export const StorageCell = ({cell, style, setStorageCellId, setStorageData}) => {
    const changeCell = (cell) => {
        setStorageCellId(cell.ID)
        setStorageData(cell.data)
    }

    return(
        <View style={[styles.cellItem, style]} >
            <Text onPress={() => changeCell(cell)}>
                {cell.data} ({cell.packsCount})
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    cellItem: {
        width: "20%",
        borderColor: "#585858",
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 8
    }
})