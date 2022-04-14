import React, {useState, useEffect} from 'react'
import {Text, View, StyleSheet, TouchableHighlight, TouchableOpacity} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {fetchPlaceDamaged, clearPack} from '../redux/slices/placeDamaged'
import {Dimensions} from 'react-native'
import {clearPacks} from '../redux/slices/shipments/shipmentPacksSlice'
import {AppToast} from "./AppToast";

export const ConfirmDamagedPlace = ({place, setVisible, visible, onLoad}) => {
    const dispatch = useDispatch()
    const [label, setLabel] = useState(null)
    const [type, setType] = useState(null)
    const [isShow, setIsShow] = useState(false)
    const makePlaceDamaged = async () => {
        dispatch(clearPacks())
        const packID = place.ID
        await dispatch(fetchPlaceDamaged({packID}))
    }
    const {status, error} = useSelector(state => state.placeDamaged)
    useEffect(() => {
        if(!status && error){
            setLabel(error)
            setType("error")
            setIsShow(true)
            return setTimeout(() => {
                dispatch(clearPack())
                setIsShow(false)
                setVisible(false)
            }, 2500)
        }
        if(status){
            setLabel(`${place.code} отправлено в брак`)
            setType("success")
            setIsShow(true)
            return setTimeout(() => {
                onLoad()
                dispatch(clearPack())
                setIsShow(false)
                setVisible(false)
            }, 2500)
        }
    }, [status])

    const closePopup = () => setVisible(false)
    if (visible) {
        return (
            <TouchableOpacity style={styles.container} onPress={closePopup} activeOpacity={0.0} underlayColor="rgba(129,129,129,0.0)">
                <AppToast label={label} isShow={isShow} type={type}/>
                <TouchableHighlight style={styles.modalWindow} activeOpacity={0.0} underlayColor="rgba(129,129,129,0.0)">
                    <View >
                        <Text style={styles.text}>
                            Вы точно хотите отправить место {place.code} в брак?
                        </Text>
                        <View style={styles.confirmPlace}>
                            <Text onPress={makePlaceDamaged} style={styles.confirmButton}>
                                Отправить в брак
                            </Text>
                            <Text style={styles.cancelButton} onPress={closePopup}>
                                Отмена
                            </Text>
                        </View>
                    </View>
                </TouchableHighlight>
            </TouchableOpacity>
        )
    }
    return null
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 50,
        borderRadius: 5,
        zIndex: 9000,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(129,129,129,0.6)"
    },
    modalWindow: {
        width: "80%",
        height: 130,
        borderRadius: 15,
        borderColor: "#8F8E8EF9",
        backgroundColor: "#FFF",
        borderWidth: 1,
        zIndex: 905,
        paddingHorizontal: 10,
        marginTop: "-75%",
    },
    text: {
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 20,
        fontSize: 16
    },
    confirmPlace: {
        flexDirection: "row",
        marginTop: 15,
        justifyContent: "space-between",
        alignItems: "center"
    },
    confirmButton: {
        flex: 1,
        backgroundColor: "#2196F3",
        paddingVertical: 8,
        marginRight: 10,
        borderRadius: 15,
        color: "#FFF",
        fontWeight: "bold",
        width: "50%",
        textAlign: "center"
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "#f1073e",
        textAlign: "center",
        paddingVertical: 8,
        borderRadius: 15,
        color: "#FFF",
        fontWeight: "bold",
        width: "50%"

    },
    btnText: {
        color: "#FFF",
        fontWeight: "bold"
    }
})