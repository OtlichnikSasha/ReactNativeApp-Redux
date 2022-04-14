import React, {useEffect, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {ScanComponent} from "../components/ScanComponent";
import {useDispatch, useSelector} from "react-redux";
import {clearPack, fetchShipmentScanPack} from "../redux/slices/shipments/shipmentScanPack";
import {fetchPackOnPalletToSector, clearPalletPack} from "../redux/slices/packOnPalletToSector";
import {useIsFocused} from "@react-navigation/native";
import {reloadSectorPalletPacks} from "../redux/slices/sectorPalletsPacksSlice";

export const LoadSectorPallet = ({navigation, route}) => {
    const {departureID} = route.params
    const [cod, setCode] = useState('')
    const [message, setMessage] = useState('')
    const [type, setType] = useState('')
    const [isShow, setIsShow] = useState(false)
    let packIDs = []
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            setIsShow(false)
            return async () => await dispatch(clearPack())}
    }, [isFocused])

    useEffect(() => {
        if (cod !== '') packHandler(cod)
    }, [cod])

    const dispatch = useDispatch()
    const entity = useSelector(state => state.shipmentScanPack.type)
    const {pack, loading} = useSelector(state => state.shipmentScanPack)
    const {status, error} = useSelector(state => state.packOnPalletToSector)
    useEffect(() => {
        if(error && !status){
            setMessage(error)
            setType('error')
            setIsShow(true)
            dispatch(clearPalletPack())
            return setTimeout(() => {
                setIsShow(false)
            }, 3500)
        }
        if(status){
            dispatch(reloadSectorPalletPacks({}))
            setMessage('Место ' + cod + ' загружено')
            setType('success')
            packIDs = []
            dispatch(clearPalletPack())
            return setIsShow(true)
        }
    }, [status, error])

    useEffect(() => {
        if (!loading && cod && entity === undefined && pack === undefined) {
            setMessage('Такого места не существует!')
            setType('error')
            return setIsShow(true)
        }
        if (!loading && cod) {
            if (entity === 'pack' && pack.status === 'ON_STORE' || pack.status === "STAYED_ON_SECTOR") {
                if (pack.departureID === departureID) {
                    packIDs.push(pack.ID)
                    return sendPackToSector(packIDs)
                }
                if (pack.departureID !== departureID) {
                    setMessage('Место не с этого отправления!')
                    setType('error')
                    return setIsShow(true)
                }
                setMessage('У места не создано отправление')
                setType('error')
                return setIsShow(true)
            }

            if (entity === 'storageCell') {
                setMessage("Это код ячейки!")
                setType('error')
                return setIsShow(true)
            }
            if (entity === 'pack' && pack.status !== 'ON_STORE' || pack.status !== 'STAYED_ON_SECTOR') {
                setMessage("Место не может быть загружено!")
                setType('error')
                return setIsShow(true)
            }
        }
    }, [pack, entity])

    const submitHandler = () => navigation.goBack()
    const scanCode = (code) => {
        if (code !== cod) {
            setMessage(`Код ${code} отсканирован, получаем информацию`)
            setType('loading')
            setIsShow(true)
            setCode(code)
        }
    }
    const packHandler = (code) => dispatch(fetchShipmentScanPack({code}))
    const sendPackToSector = (packIDs) => dispatch(fetchPackOnPalletToSector({packIDs, departureID}))
    return (
        <>
            {isFocused ?
                <View style={styles.container}>
                    <ScanComponent
                        label={message}
                        isShow={isShow}
                        type={type}
                        title="Загрузка мест на поддон"
                        description="Отсканируйте код места, чтобы загрузить его на поддон"
                        scanCode={scanCode}
                        closeScanner={submitHandler}/>
                </View>
                :
                <></>
            }
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})