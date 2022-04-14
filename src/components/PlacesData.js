import {StyleSheet, Text, View} from "react-native";
import React from "react";

export const PlacesData = ({places, visible=true}) => {
    if(visible){
        return (
            <View style={styles.header}>
                <Text>Места: </Text>
                {places.length ? places.map((place, i) => {
                        if (i === places.length - 1 && i < 5) {
                            return (
                                <Text key={i}>{place.code}</Text>
                            )
                        }
                        if(i <= 5) return <Text key={i}>{place.code}, </Text>
                    }
                ) : <Text>Мест не найдено</Text>}
                {places.length > 5 ? <Text>...</Text> : null}
            </View>
        )
    }
    return null

}
const styles = StyleSheet.create({
    header: {
        position: "absolute",
        width: "100%",
        left: 10,
        right: 10,
        top: 5,
        backgroundColor: "#C7FFBE",
        justifyContent: "center",
        flexDirection: "row",
        paddingVertical: 5,
        paddingHorizontal: 8,
        flexWrap: "wrap"
    }
})