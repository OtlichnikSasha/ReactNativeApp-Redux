import React, {useEffect, useState} from 'react';
import {ImagePickerModal} from "../../components/ImagePickerModal";
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import AddPhotoForCar from "../../components/AddPhotoForCar";
import {clearResult, fetchUploadPhoto} from "../../redux/slices/uploadPhotoSlice";
import {clearData} from "../../redux/slices/shipments/shipmentSendCar";
import {useIsFocused} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {AppButton} from "../../components/AppButton";
import {clearAcceptResult, sendAcceptedCar} from "../../redux/slices/transit/acceptDeparturesCar";
import {AppToast} from "../../components/AppToast";
import {reloadWarehousePacks} from "../../redux/slices/transit/transitWhSlice";

export const AcceptCar = ({navigation, route}) => {
    const {carNumber, departureID} = route.params;
    const [uri, setUri] = useState([])
    const [message, setMessage] = useState('')
    const [type, setType] = useState('')
    const [visible, setVisible] = useState(false);
    const [isShow, setIsShow] = useState(false)
    const [fileIDs, setFileIDs] = useState([])
    const isFocused = useIsFocused();
    const dispatch = useDispatch()
    useEffect(() => {
        if (isFocused) {
            dispatch(clearResult())
            dispatch(clearData())
            dispatch(clearAcceptResult())
            setFileIDs([])
            setUri([])
            setType('')
            setMessage('')
            setIsShow(false)
        }
    }, [isFocused])

    useEffect(() => {
        dispatch(clearResult())
        handleAccept()
    }, [uri])
    const status = useSelector(state => state.uploadPhotoSlice.status)
    const resultPhoto = useSelector(state => state.uploadPhotoSlice.result)
    const {result, success} = useSelector(state => state.acceptDeparturesCar);

    useEffect(() => {
        if (resultPhoto && status) {
            setFileIDs([...fileIDs, resultPhoto.ID])
        }
    }, [resultPhoto, status])

    useEffect(() => {
        if(result && success){
            setMessage("Машина принята!")
            setType('success')
            setIsShow(true)
            setFileIDs([])
            setUri([])
            return (
                setTimeout(() => {
                    setMessage("")
                    setType('')
                    setIsShow(false)
                    dispatch(reloadWarehousePacks({}))
                    navigation.navigate("TransitCarListScreen")
                }, 2500)
            )
        }
    }, [result, success])


    const handleAccept = async () => {
        const imageData = new FormData();
        imageData.append('file', {
            uri: uri[uri.length - 1],
            name: `shipmentSendCar/${carNumber}/${uri.length - 1}.jpg`,
            type: 'image/jpeg',
        });
        await sendPhoto(imageData)
    };


    const sendPhoto = (imageData) => dispatch(fetchUploadPhoto(imageData))
    const acceptedCar = async () => dispatch(sendAcceptedCar({departureID, fileIDs}))
    return (
        <View style={styles.container}>
            <ImagePickerModal
                isVisible={visible}
                setVisible={setVisible}
                setUri={setUri}
                uri={uri}
            />
            <View style={styles.headerToast}>
                <AppToast isShow={isShow} label={message} type={type}/>
            </View>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="black"/>
                </TouchableOpacity>
                <Text style={styles.carNum}>{carNumber}</Text>
            </View>
            <AddPhotoForCar uri={uri} setUri={setUri} setVisible={setVisible} fileIDs={fileIDs}
                            setFileIDs={setFileIDs}/>
            <View style={styles.wrapper}>
                <AppButton onPress={acceptedCar} label="Принять"/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 15,
        marginTop: 75,
    },
    headerToast: {
        flex: 1,
        position: "absolute",
        width: "95%",
        marginHorizontal: 10,
        top: 5,
    },
    backBtn: {
        paddingRight: 10,
    },
    carNum: {
        marginRight: 'auto',
        fontSize: 18,
        fontWeight: 'bold',
    },
    wrapper: {
        flex: 1,
        paddingHorizontal: 18,
        marginBottom: 5,
        zIndex: 100,
        justifyContent: "flex-end"
    },
})