import {StyleSheet, View} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import {useSelector, useDispatch} from 'react-redux'
import {fetchShipmentScanPack, clearPack} from "../../redux/slices/shipments/shipmentScanPack";
import {ScanComponentForChoosingCar} from "../../components/ScanComponentForChoosingCar";
import {useIsFocused} from "@react-navigation/native";
import {clearPacksResult, fetchShipmentPacksDelivery} from "../../redux/slices/shipments/shipmentPacksDelivery";
import {fetchSections} from "../../redux/slices/sections/sectionsSlice";
import {fetchSection} from "../../redux/slices/sections/sectionSlice";
import {reloadShipmentSectorPacks} from "../../redux/slices/shipments/shipmentSectorSlice";

export const ShipmentScanForCar = ({navigation, route}) => {
    const [cod, setCode] = useState('')
    const [message, setMessage] = useState('')
    const [type, setType] = useState('')
    const [isShow, setIsShow] = useState(false)
    const [count, setCount] = useState(0)
    const [departure, setDeparture] = useState(0)
    const dispatch = useDispatch()
    const {sectionID} = route.params
    const isFocused = useIsFocused();
    const getSection = useCallback(() => {
        dispatch(clearPacksResult())
        dispatch(clearPack())
        dispatch(fetchSection({id: sectionID}))
    }, [isFocused])

    useEffect(() => {
        getSection()
    }, [getSection])

    const {section} = useSelector(state => state.sectionSlice)
    const getDeparture = useCallback(() => {
        if(section) {
            setDeparture(section.departure)
            setCount(section.departure.packsCountInCar)
        }
    }, [section])

    useEffect(() => {
        getDeparture()
    }, [getDeparture])

    useEffect(() => {
        if (cod) packHandler(cod)
    }, [cod])


    const entity = useSelector(state => state.shipmentScanPack.type)
    const errorScan = useSelector(state => state.shipmentScanPack.error)
    const {pack, loading} = useSelector(state => state.shipmentScanPack)
    const {status, error} = useSelector(state => state.shipmentPacksDelivery)
    useEffect(() => {
        if (cod && pack && !loading === undefined) {
            setMessage("Такого места не существует!")
            setType("error")
            setIsShow(true)
            return cleaner()
        }
        if (!loading && cod && pack && pack.hasOwnProperty("status")) {
            if (pack && pack.status === 'DELIVERY' && cod && entity === 'pack') {
                if (pack.sectionID === sectionID) {
                    setMessage("Место уже загружено в машину")
                    setType("error")
                    setIsShow(true)
                    return cleaner()
                }
            }
            if (pack && pack.status === 'ON_SECTOR' && cod && entity === 'pack') {
                if (pack.sectionID === sectionID) {
                    const packIDs = []
                    packIDs.push(pack.ID)
                    return packDeliveryHandler(packIDs);
                }
                setMessage("Место " + pack.code + ' не из этого сектора!')
                setType("error")
                setIsShow(true)
                return cleaner()
            }
            if (cod && entity === 'storageCell') {
                setMessage("Это код ячейки")
                setType("error")
                setIsShow(true)
                return cleaner()
            }
            if (pack.status !== 'ON_SECTOR' && cod && entity === 'pack') {
                setMessage("Это место не в секторе!")
                setType("error")
                setIsShow(true)
                return cleaner()
            }
        }
    }, [pack, entity])


    useEffect(() => {
        if(errorScan){
            setMessage(errorScan)
            setType('error')
            setIsShow(true)
            return setTimeout(() => {
                setIsShow(false)
                dispatch(clearPack())
            }, 2500)
        }
    }, [errorScan])

    useEffect(() => {
        if(error && !status){
            setMessage(error)
            setType('error')
            setIsShow(true)
            return cleaner()
        }
        if(status && pack){
            setCount(count + 1)
            setMessage("Место " + pack.code + ' добавлено')
            setType("success")
            dispatch(fetchSections({}))
            let args = `isDefect=false&status=ON_SECTOR&status=DELIVERY&limit=${30}&sectionID=${sectionID}&departureID=${section.departure.ID}`
            dispatch(reloadShipmentSectorPacks({args}))
            dispatch(fetchSection({id: sectionID}))
            setIsShow(true)
            return cleaner()
        }
    }, [status])


    const cleaner = () => {
        return setTimeout(() => {
            setIsShow(false)
            dispatch(clearPacksResult())
            dispatch(clearPack())
        }, 3000)
    }

    const scanCode = (code) => {
        if (code !== cod) {
            setMessage(`Код ${code} отсканировали, получаем информацию`)
            setType('loading')
            setIsShow(true)
            setCode(code)
        }
    }
    const submitHandler = () => navigation.navigate("ShipmentChoosingCar", {section})
    const packHandler = (code) => dispatch(fetchShipmentScanPack({code}))
    const packDeliveryHandler = (packIDs) => dispatch(fetchShipmentPacksDelivery({packIDs, departureID: departure.ID}))
    return (
        <>
            {isFocused && departure ?
                <View style={styles.container}>
                    <ScanComponentForChoosingCar
                        label={message}
                        isShow={isShow}
                        type={type}
                        title="Погрузка места в машину"
                        description="Отсканируйте код места, чтобы погрузить его в машину"
                        scanCode={scanCode}
                        closeScanner={submitHandler}
                        count={count}
                        scan_count={departure.packsCount}
                    />
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
    }
})