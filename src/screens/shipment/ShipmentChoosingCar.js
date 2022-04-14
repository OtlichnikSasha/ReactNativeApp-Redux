import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, View, TextInput, ScrollView} from 'react-native'
import {AppButton} from "../../components/AppButton";
import {ImagePickerModal} from "../../components/ImagePickerModal"
import {useSelector, useDispatch} from 'react-redux'
import {fetchShipmentSendCar, clearData, addShipmentCarData} from "../../redux/slices/shipments/shipmentSendCar";
import {AppToast} from "../../components/AppToast";
import {fetchUploadPhoto, clearResult} from "../../redux/slices/uploadPhotoSlice";
import AddPhotoForCar from "../../components/AddPhotoForCar";
import {useIsFocused} from "@react-navigation/native";
import {clearPacks, reloadShipmentPacks} from "../../redux/slices/shipments/shipmentPacksSlice";
import {fetchSections, clearSections} from "../../redux/slices/sections/sectionsSlice";
import {fetchSection, clearSection} from "../../redux/slices/sections/sectionSlice";
import {clearSectorPacks} from "../../redux/slices/shipments/shipmentSectorSlice";

export const ShipmentChoosingCar = ({navigation, route}) => {
    const sectionRoute = route.params.section
    const sectionID = sectionRoute.ID
    const [form, setForm] = useState({
        carNumber: '', // Гос номер автомобиля
        seal: '', // Номер пломбы автомобиля
    })
    const [defaultForm, setDefaultForm] = useState({
        carNumber: '',
        seal: '',
    })
    const [uri, setUri] = useState([])
    const [message, setMessage] = useState('')
    const [type, setType] = useState('')
    const [visible, setVisible] = useState(false);
    const [isShow, setIsShow] = useState(false)
    const [fileIDs, setFileIDs] = useState([])
    const [departure, setDeparture] = useState({})
    const [total, setTotal] = useState(0)
    const isFocused = useIsFocused();
    const dispatch = useDispatch()

    const getSection = useCallback(() => {
        dispatch(clearSection())
        dispatch(clearPacks())
        dispatch(clearSectorPacks())
        dispatch(fetchSection({id: sectionID}))
        setDefaultForm({...form, carNumber: String(form.carNumber)})
        setDefaultForm({...form, seal: String(form.seal)})
        defaultForm.carNumber = form.carNumber
        if(reduxSectionID && reduxSectionID === sectionID){
            setForm({...form, carNumber: carNumber})
            setForm({...form, seal: seal})
            setFileIDs(photos)
        }
    }, [isFocused])

    useEffect(() => {
        getSection()
    }, [getSection])

    const {result, loading, error} = useSelector(state => state.shipmentSendCar)
    const {photos, carNumber, seal} = useSelector(state => state.shipmentSendCar)
    const reduxSectionID = useSelector(state => state.shipmentSendCar.sectionID)

    const status = useSelector(state => state.uploadPhotoSlice.status)
    const resultPhoto = useSelector(state => state.uploadPhotoSlice.result)
    const {packs} = useSelector(state => state.shipmentPacks)
    const packsLoading = useSelector(state => state.shipmentPacks.loading)
    const {section} = useSelector(state => state.sectionSlice)
    useEffect(async () => {
        if (uri.length === fileIDs.length && uri.length !== 0) return;
        await dispatch(clearResult())
        await handleAccept()
    }, [uri])


    const getPacks = useCallback(async () => {
        if (section) {
            setDeparture(section.departure)
            setTotal(departure['packsCount'])
        }
    }, [section])

    useEffect(async () => {
        await getPacks()
    }, [getPacks])

    useEffect(() => {
        if (error) {
            setType('error')
            setMessage(error)
            setIsShow(true)
            return setTimeout(() => {
                dispatch(clearData())
                setIsShow(false)
            }, 3500)
        }
        if (result && !loading) {
            dispatch(clearData())
            dispatch(fetchSections({}))
            if (!packs.length) {
                setType('success')
                setMessage('Машина успешно отправлена!')
                setIsShow(true)
                return setTimeout(() => {
                    navigation.navigate("ShipmentSectorScreen")
                }, 1500)
            }
            const packIDs = []
            packs.map(pack => packIDs.push(pack.ID))
            return navigation.navigate("ShipmentNeedShipPlaces", {sectionID, departureID: departure.ID, packIDs})
        }
    }, [result])

    useEffect(() => {
        if (resultPhoto && status) setFileIDs([...fileIDs, resultPhoto.ID])
    }, [resultPhoto, status])
    const handleAccept = async () => {
        const imageData = new FormData();
        imageData.append('file', {
            uri: uri[uri.length - 1],
            name: `shipmentSendCar/${departure.ID}/${uri.length - 1}.jpg`,
            type: 'image/jpeg',
        });
        await sendPhoto(imageData)
    };

    const sendPhoto = (imageData) => dispatch(fetchUploadPhoto(imageData))
    const sendInCar = async () => { // Отправляем места
        if (!form.carNumber) {
            setType('error')
            setMessage('Не все данные заполнены!')
            return setIsShow(true)
        }
        form.departureID = departure.ID
        form.fileIDs = fileIDs
        await sendToCar()
    }

    const onChangeCarNumber = (text) => {
        setIsShow(false)
        setForm({...form, carNumber: text})
    }
    const onChangeSeal = (text) => {
        setIsShow(false)
        setForm({...form, seal: text})
    }
    const sendToCar = () => dispatch(fetchShipmentSendCar(form))
    const navigateBack = () => {
        let args = form
        args.photos = fileIDs
        args.sectionID = sectionID
        dispatch(addShipmentCarData(args))
        dispatch(clearSectorPacks())
        navigation.navigate("ShipmentSectorItemsScreen", {sectionID: section.ID, status: "ON_SECTOR"})
    }
    const navigateToScan = () => navigation.navigate("ShipmentScanForCar", {sectionID})
    const navigateToDeliveryPlaces = () => {
        let args = form
        args.photos = fileIDs
        args.sectionID = sectionID
        dispatch(addShipmentCarData(args))
        dispatch(clearSectorPacks())
        navigation.navigate("ShipmentSectorItemsScreen", {
            sectionID,
            status: "DELIVERY"
        })
    }
    const loadPacksEffect = useCallback(() => {
        dispatch(reloadShipmentPacks({
            sectionID,
            status: "ON_SECTOR",
            departureID: departure.ID
        }) )}, [departure])

    useEffect(async () => {
        await loadPacksEffect()
    }, [loadPacksEffect])
    return (
        <>
            {section ?
                <View style={styles.container}>
                    <ImagePickerModal
                        isVisible={visible}
                        setVisible={setVisible}
                        setUri={setUri}
                        uri={uri}
                    />
                    <View style={styles.header}>
                        <AppToast isShow={isShow} label={message} type={type}/>
                    </View>
                    <View style={styles.data_place}>
                        <Text style={styles.label}>
                            Введите гос.номер автомобиля:
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Введите гос.номер"
                            onChangeText={onChangeCarNumber}
                            defaultValue={defaultForm.carNumber}
                        />
                        <Text style={styles.label}>
                            Введите номер пломбы автомобиля:
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Введите номер пломбы"
                            onChangeText={onChangeSeal}
                            defaultValue={defaultForm.seal}
                        />
                        <ScrollView style={{height: "25%"}}>
                            <View style={styles.photos_place}>
                                <AddPhotoForCar uri={uri} setUri={setUri} setVisible={setVisible} fileIDs={fileIDs}
                                                setFileIDs={setFileIDs}/>
                            </View>
                        </ScrollView>
                        <View style={{zIndex: 500}}>
                            {!packs.length && section && !packsLoading ?
                                <Text style={styles.loadedPlace}>Все места загружены</Text>
                                :
                                <></>
                            }
                            {section && packs.length && !packsLoading ?
                                <ScrollView style={{height: "20%"}}>
                                    <Text style={styles.loadedPlace}>
                                        Мест не загружено: {packs.length}
                                    </Text>
                                    <Text>
                                        Незагруженные места:
                                    </Text>
                                    <View style={styles.packsList}>
                                        {packs.length ? packs.map(pack => (
                                                <Text key={pack.ID}>{pack.code} </Text>
                                            ))
                                            :
                                            null
                                        }
                                    </View>
                                </ScrollView>
                                :
                                <></>
                            }
                        </View>
                    </View>

                    <View style={styles.wrapper}>
                        {!packs.length && section ?
                            <AppButton label="Все места загружены, отправляем машину" onPress={sendInCar}/>
                            :
                            <></>
                        }
                        {section && packs.length && departure ?
                            <View>
                                <AppButton label="Вернуться к сканированию" onPress={navigateToScan}
                                           mode="outlined" style={{backgroundColor: "#EAE9FF"}}/>
                                <AppButton label={`Перейти к незагруженным местам (${packs.length})`} onPress={navigateBack}
                                           mode="outlined" style={{backgroundColor: "#EAE9FF", marginVertical: 5}}/>
                                <AppButton label={`Список погруженных мест (${departure.packsCountInCar})`} onPress={navigateToDeliveryPlaces}
                                           mode="outlined" style={{backgroundColor: "#EAE9FF", marginBottom: 5}}/>
                                <AppButton label="Отправляем частично загруженную машину"
                                           onPress={sendInCar} disabled={!packs.length}/>
                            </View>
                            :
                            <></>
                        }
                    </View>
                </View>
                :
                <></>
            }
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15
    },
    label: {
        color: "#585858",
        marginVertical: 10,
        fontSize: 16,
    },
    input: {
        borderStyle: "solid",
        borderBottomWidth: 2,
        color: "#000000",
        borderBottomColor: "#868686",
        width: "70%",
        padding: 5,
        textTransform: "uppercase",
        fontSize: 18,
    },
    wrapper: {
        flex: 1,
        justifyContent: "flex-end",
        zIndex: 999
    },
    photos_place: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        marginLeft: -10
    },
    header: {
        justifyContent: 'flex-start',
        marginBottom: 10
    },
    packsList: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    loadedPlace: {
        fontWeight: "bold",
        fontSize: 20,
    }
})