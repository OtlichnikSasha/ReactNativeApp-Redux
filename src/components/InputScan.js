import React, {useState} from 'react';
import {Dimensions, StyleSheet, View, Text, TextInput} from "react-native";
import {AppButton} from "./AppButton";

export const InputScan = ({visible, setVisible, title, scanCode}) => {
    const [code, setCode] = useState('')
    const closeBtn = () => setVisible(false)
    const changeHandler = (text) => setCode(text)
    const finishHandler = (event) => {
        event.persist();
        scanCode(code)
    }
    if (visible) {
        return (
            <View style={styles.container}>
                <View style={styles.inputPlace}>
                    <Text style={styles.heading}>
                        {title}
                    </Text>
                    <TextInput style={styles.input}
                               placeholder="Введите название заказа или упаковки"
                               onEndEditing={finishHandler}
                               onChangeText={changeHandler}
                    />
                </View>
                <View style={styles.wrapper}>
                    <AppButton label="Закрыть" mode="outlined" onPress={closeBtn}/>
                </View>
            </View>
        );
    }
    return null;

};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF",
        flex: 1,
        padding: 10,
        marginTop: 50,
        height: Dimensions.get("window").height - 50,
        width: Dimensions.get("window").width,
        zIndex: 9000,
        position: "absolute",
    },
    heading: {
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        fontSize: 18
    },
    inputPlace: {
        alignItems: "center",
        marginTop: "50%"
    },
    input: {
        color: "#000000",
        width: "92%",
        padding: 8,
        textTransform: "uppercase",
        fontSize: 12,
        borderWidth: 2,
        borderColor: "#8E8E8E",
        borderRadius: 5
    },
    wrapper: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 50
    }
})
