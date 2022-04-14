import React, {useState, useEffect} from 'react'
import {StyleSheet, View} from 'react-native'
import {ScanComponent} from "../components/ScanComponent";
import {PlacesData} from "../components/PlacesData";
import {useDispatch, useSelector} from "react-redux";
import {clearPack, fetchShipmentScanPack} from "../redux/slices/shipments/shipmentScanPack";
import {fetchPackOnPalletToStore, clearPackToStore} from "../redux/slices/packOnPalletToStore";
import {useIsFocused} from "@react-navigation/native";
import {reloadPointPalletPacks} from "../redux/slices/pointsPalletsPacksSlice";
import {reloadPreparedPalletPacks, clearPreparedPalletPacks} from "../redux/slices/preparedPalletPlaces";
import {AppButton} from "../components/AppButton";
import {totalSectorPacks} from "../redux/slices/sectorPackSlice";
import {totalPreparedPallets, clearTotal} from "../redux/slices/preparedPalletsSlice";

export const LoadPlacesInPallet = ({navigation}) => {
    const [cod, setCode] = useState('')
    const [message, setMessage] = useState('')
    const [type, setType] = useState('')
    const [isShow, setIsShow] = useState(false)
    const [prepPalletID, setPrepPalletID] = useState(0)
    const [visible, setVisible] = useState(false)
    const limit = "all"
    let packIDs = []
    const dispatch = useDispatch()
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            dispatch(clearPreparedPalletPacks())
            clearPackToStoreHandler()
            dispatch(clearPack())
            setCode('')
            setIsShow(false)
        }
    }, [isFocused])

    useEffect(() => {
        if (cod !== '') {
            clearPackToStoreHandler()
            scanCodeHandler(cod)
        }
    }, [cod])
    const entity = useSelector(state => state.shipmentScanPack.type)
    const {pack, loading} = useSelector(state => state.shipmentScanPack)
    const {status, error} = useSelector(state => state.packOnPalletToStore)
    const {packs, total} = useSelector(state => state.preparedPalletPlaces)
    useEffect(() => {
        if (!status && error) {
            setType('error')
            setIsShow(true)
            setMessage(error)
            return setTimeout(() => {
                setIsShow(false)
                clearPackToStoreHandler()
                dispatch(clearPack())
            }, 3000)
        }
        if (status && pack && cod) {
            packIDs = []
            setType('success')
            setIsShow(true)
            dispatch(reloadPointPalletPacks({}))
            dispatch(totalSectorPacks({}))
            dispatch(clearTotal())
            dispatch(totalPreparedPallets({}))
            dispatch(clearPreparedPalletPacks())
            if (prepPalletID) {
                setMessage(`Места выгружены с поддона ${prepPalletID}`)
                return setTimeout(() => {
                    setPrepPalletID(0)
                    setIsShow(false)
                    clearPackToStoreHandler()
                    dispatch(clearPack())
                }, 3000)
            }
            return setMessage('Место ' + cod + ' загружено')
        }
    }, [status])


    useEffect(() => {
        if (prepPalletID) loadPacks()
    }, [prepPalletID])

    useEffect(() => {
        if (!loading && cod) {
            if (entity === 'pack' && pack.preparedPalletID) {
                setPrepPalletID(pack.preparedPalletID)
                setVisible(true)
                setMessage("Это место находится на поддоне, Все Места с этого поддона будут добавлены на ваш поддон.")
                setType("success")
                return setTimeout(() => {
                    setIsShow(false)
                }, 3000)
            }
            if (entity === 'pack' && pack.status === 'CREATED') {
                packIDs.push(pack.ID)
                return sendCode(packIDs)

            }
            if (entity === undefined && pack === undefined) {
                setMessage('Такого места не существует!')
                setType('error')
                return setIsShow(true)
            }
            if (entity === 'storageCell' && cod) {
                setMessage("Это код ячейки!")
                setType('error')
                return setIsShow(true)
            }
            if (entity === 'pack' && pack.status !== 'CREATED' && pack.status !== "ON_PREPARED_PALLET") {
                setMessage("Место уже загружено!")
                setType('error')
                return setIsShow(true)
            }
        }
    }, [pack, entity])

    const scanCode = (code) => {
        if (code !== cod) {
            setMessage(`Код ${code} отсканировали, получаем информацию`)
            setType('loading')
            setIsShow(true)
            setCode(code)
        }
    }
    const clearPackToStoreHandler = () => dispatch(clearPackToStore())
    const sendCode = (packIDs) => dispatch(fetchPackOnPalletToStore({packIDs}))
    const scanCodeHandler = (code) => dispatch(fetchShipmentScanPack({code}))
    const submitHandler = () => navigation.navigate("MainScreen")
    const loadPacks = () => dispatch(reloadPreparedPalletPacks({preparedPalletID: prepPalletID, limit}))
    const loadAllPallet = () => {
        packs.map(pack => packIDs.push(pack.ID))
        sendCode(packIDs)
    }
    return (
        <>
            {isFocused ?
                <View style={styles.container}>
                    <PlacesData places={packs} visible={visible}/>
                    <ScanComponent
                        label={message}
                        isShow={isShow}
                        type={type}
                        title="Загрузка мест на поддон"
                        description="Отсканируйте места и они будут перемещены на поддон"
                        scanCode={scanCode}
                        closeScanner={submitHandler}/>
                    {packs.length ?
                        <View style={styles.wrapper}>
                            <AppButton label="Загрузить все места на поддон" onPress={loadAllPallet}
                                       style={{marginHorizontal: 10, marginBottom: 5}}/>
                        </View>
                        :
                        <></>
                    }
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
    },
    wrapper: {
        zIndex: 100
    }
})