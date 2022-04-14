import React, {useEffect, useState} from "react";
import {useIsFocused} from "@react-navigation/native";
import {clearPack, fetchShipmentScanPack} from "../../redux/slices/shipments/shipmentScanPack";
import {useDispatch, useSelector} from "react-redux";
import {StyleSheet, View} from 'react-native'
import {sendAcceptedPackIDs, clearResult} from "../../redux/slices/transit/acceptDeparturesTransit";
import {ScanComponentForAccept} from "../../components/ScanComponentForAccept";
import {fetchDeparture} from "../../redux/slices/departureSlice";

export const LoadZoneWarehouse = ({navigation, route}) => {
    const isFocused = useIsFocused();
    const [cod, setCode] = useState('')
    const [message, setMessage] = useState('')
    const [type, setType] = useState('')
    const [isShow, setIsShow] = useState(false)
    const [count, setCount] = useState(0)
    const dispatch = useDispatch()
    const {scannedCount, departureID} = route.params;
    useEffect( () => {
        if (isFocused) {
            dispatch(clearPack())
            setCount(scannedCount)
            setIsShow(false)
            dispatch(fetchDeparture({id: departureID}))
        }
    }, [isFocused])

    useEffect(() => {
        if (cod) packHandler(cod)
    }, [cod])


    const scanCode = (code) => {
        if (code !== cod){
            setMessage(`Код ${code} отсканирован, получаем информацию`)
            setType('loading')
            setIsShow(true)
            setCode(code)
        }
    }
    const submitHandler = () => navigation.navigate("AcceptCar", {carNumber: departure.carNumber, departureID})
    const {pack, loading} = useSelector(state => state.shipmentScanPack)
    const entity = useSelector(state => state.shipmentScanPack.type)
    const {status, error} = useSelector(state => state.acceptDepartures);
    const {departure} = useSelector(state => state.departure)
    const packHandler = (code) => dispatch(fetchShipmentScanPack({code}))
    useEffect(() => {
        if (!loading && cod && pack === undefined) {
            setMessage('Такого места не существует!')
            setType('error')
            return setIsShow(true)
        }
        if (!loading && cod && pack) {
            if (entity === 'storageCell' && cod) {
                setMessage("Это код ячейки!")
                setType('error')
                return setIsShow(true)
            }
            if (pack.status === 'DELIVERY' && entity === 'pack') {
                if (pack.departureID !== departureID) {
                    setMessage("Место не из этой машины!")
                    setType('error')
                    return setIsShow(true)
                }
                const packIDs = []
                packIDs.push(pack.ID)
                return sendToZoneWarehouse(packIDs);
            }
            if (pack.status !== 'DELIVERY' && entity === 'pack') {
                setMessage("Место не может быть принято!")
                setType('error')
                return setIsShow(true)
            }
        }
    }, [pack, entity])

    useEffect(() => {
        if(error && !status){
            setMessage(error)
            setType('error')
            setIsShow(true)
            return setTimeout(() => {
                setIsShow(false)
                dispatch(clearResult())
                dispatch(clearPack())
            }, 2500)
        }
        if(status && pack) {
            setMessage(`Место ${pack.code} принято!`)
            setType('success')
            setIsShow(true)
            setCount(count+1)
            return setTimeout(() => {
                setIsShow(false)
                dispatch(clearResult())
                dispatch(clearPack())
            }, 2500)
        }
    }, [status])
    const sendToZoneWarehouse = (packIDs) => dispatch(sendAcceptedPackIDs({packIDs}))
    return (
        <>
            {isFocused ?
                <View style={styles.container}>
                    <ScanComponentForAccept
                        label={message}
                        isShow={isShow}
                        type={type}
                        title="Подтверждение получения места"
                        description="Отсканируйте код места , чтобы отметить его принятым"
                        scanCode={scanCode}
                        closeScanner={submitHandler}
                        count={count}
                        scan_count={departure.packsCount}
                    />
                </View>
                :
                <></>}
        </>
    )
}
const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    container: {
        flex: 1
    }
})
