import React, {useEffect, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {useDispatch, useSelector} from "react-redux";
import {fetchShipmentScanPack, clearPack} from "../redux/slices/shipments/shipmentScanPack";
import {ScanComponentForCell} from "../components/ScanComponentForCell";
import {PlacesData} from "../components/PlacesData";
import {clearPackStore, fetchPackToStore} from "../redux/slices/packsToStore";
import {reloadPointPalletPacks} from "../redux/slices/pointsPalletsPacksSlice";
import {useIsFocused} from "@react-navigation/native";

export const LoadAllPlacesInCell = ({navigation}) => {
    const [cod, setCode] = useState('')
    const [message, setMessage] = useState('')
    const [type, setType] = useState('')
    const [isShow, setIsShow] = useState(false)
    const dispatch = useDispatch()
    const limit = "all"
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            setIsShow(false)
            loadPacksEffect()
            clearPackToStoreHandler()
            dispatch(clearPack())
        }
    }, [isFocused])

    useEffect(() => {
        if (cod !== '') {
            setMessage('')
            setType('')
            clearPackToStoreHandler()
            setIsShow(false)
            scanCodeHandler(cod)
        }
    }, [cod])

    const entity = useSelector(state => state.shipmentScanPack.type)
    const {pack, loading} = useSelector(state => state.shipmentScanPack)
    const status = useSelector(state => state.packToStore.status)
    let places = useSelector(state => state.pointPalletPacks.packs)
    const loadPacksEffect = () => dispatch(reloadPointPalletPacks({limit}))
    const submitHandler = () => navigation.goBack()
    const goToSellSelection = () => navigation.navigate("CellSelection", {places})
    useEffect(() => {
        if (!loading && cod) {
            if (entity === 'pack') {
                setMessage("Это код места!")
                setType('error')
                setIsShow(true)
                return closeTimer()
            }
            if (cod && entity === undefined && pack === undefined) {
                setMessage('Такой ячейки не существует!')
                setType('error')
                setIsShow(true)
                return closeTimer()
            }
            if (entity === 'storageCell' && cod) {
                const storageCellID = pack.ID
                const packIDs = []
                if (places.length) {
                    places.map((place) => packIDs.push(place.ID))
                    return sendCode(packIDs, storageCellID)
                }
                setMessage('Вы не отсканировали ни одного места!')
                setType('error')
                setIsShow(true)
                return closeTimer()
            }
        }
    }, [pack, entity])

    useEffect(() => {
        if (status && pack && pack.hasOwnProperty("data")) {
            places = []
            clearPackToStoreHandler()
            setMessage("Места успешно загружены в ячейку: " + pack.data)
            setType("success")
            setIsShow(true)
            return setTimeout(() => {
                setIsShow(false)
                navigation.navigate("MainScreen")
            }, 2000)
        }
    }, [status])


    const scanCode = async (code) => {
        if (code !== cod) {
            setMessage(`Код ${code} отсканировали, получаем информацию`)
            setType('loading')
            setIsShow(true)
            setCode(code)
        }
    }

    const clearPackToStoreHandler = () => dispatch(clearPackStore())
    const sendCode = (packIDs, storageCellID) => dispatch(fetchPackToStore({packIDs, storageCellID}))
    const scanCodeHandler = (code) => dispatch(fetchShipmentScanPack({code}))
    const closeTimer = () => {
        return setTimeout(() => {
            setIsShow(false)
        }, 3000)
    }
    return (
        <>
            {
                isFocused ?
                    <View style={styles.container}>
                        <PlacesData places={places}/>
                        <ScanComponentForCell
                            label={message}
                            isShow={isShow}
                            type={type}
                            title="Загрузка мест в ячейку"
                            description="Отсканируйте код ячейки"
                            scanCode={scanCode}
                            onPress={submitHandler}
                            goToCellSelection={goToSellSelection}
                        />
                    </View>
                    : <></>
            }
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})