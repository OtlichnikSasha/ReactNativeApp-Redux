import React, {useState} from 'react'
import {Text, View, StyleSheet, TouchableHighlight, Dimensions} from "react-native";
import {ConfirmDamagedPlace} from "./ConfirmDamagedPlace";

export const PlaceDamaged = ({place, setVisible, visible, onLoad}) => {
    const [openModal, setOpenModal] = useState(false)
    const changeActive = () => {
        setOpenModal(true)
        setVisible(false)
    }
    const closePopup = () => setVisible(false)
    if(openModal) return <ConfirmDamagedPlace place={place} setVisible={setOpenModal} visible={openModal} onLoad={onLoad}/>
    if (visible) {
        return (
            <TouchableHighlight activeOpacity={0.0} underlayColor="rgba(129,129,129,0.0)" style={styles.container} onPress={closePopup}>
                <View style={styles.modalWindow}>
                    <Text style={styles.text}
                          onPress={changeActive}>
                        Место повреждено
                    </Text>
                </View>
            </TouchableHighlight>
        )
    }
    return null


}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        borderRadius: 5,
        zIndex: 900,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(129,129,129,0.6)"
    },
    modalWindow: {
        width: "60%",
        height: 80,
        borderRadius: 15,
        borderColor: "#8F8E8EF9",
        backgroundColor: "#FFF",
        borderWidth: 1,
        marginTop: "-75%",
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        fontWeight: "bold",
        fontSize: 16
    },
    agree: {
        position: "absolute",
        bottom: 15,
        right: 5,
        color: "#1890FF",
        fontWeight: "bold",
    }
})