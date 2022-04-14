import React, {useState} from 'react'
import {Text, StyleSheet, TouchableHighlight, Dimensions, View} from "react-native";
import {ConfirmDamagedPlace} from "./ConfirmDamagedPlace";

export const PlaceDamagedAndInfo = ({place, setVisible, visible, onPress, onLoad}) => {
    const [openModal, setOpenModal] = useState(false)
    const closePopup = () => setVisible(false)
    const changeActive = () => {
        setOpenModal(true)
        setVisible(false)
    }
    if (openModal) return <ConfirmDamagedPlace place={place} setVisible={setOpenModal} visible={openModal}
                                               onLoad={onLoad}/>
    const watchPlaceInfo = () => {
        setVisible(false)
        onPress()
    }
    if (visible) {
        return (
            <TouchableHighlight activeOpacity={0.0} underlayColor="rgba(129,129,129,0.0)" style={styles.container} onPress={closePopup}>
                <View style={styles.modalWindow}>
                    <Text style={styles.text}
                          onPress={changeActive}>
                        Место повреждено
                    </Text>
                    <Text style={styles.text} onPress={watchPlaceInfo}>
                        Информация о месте
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
    text: {
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 8,
        fontSize: 18
    },
    modalWindow: {
        width: "60%",
        height: 100,
        borderRadius: 15,
        borderColor: "#8F8E8EF9",
        backgroundColor: "#FFF",
        borderWidth: 1,
        marginTop: "-75%",
        justifyContent: "center",
        alignItems: "center"
    },
})