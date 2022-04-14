import {StyleSheet, View} from "react-native";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux'
import {clearPack, fetchShipmentScanPack} from "../../redux/slices/shipments/shipmentScanPack";
import {ScanComponentForShipment} from "../../components/ScanComponentForShipment";
import {useIsFocused} from "@react-navigation/native";

export const ShipmentScanForSearch = ({navigation}) => {
    const [cod, setCode] = useState('')
    const [message, setMessage] = useState('')
    const [type, setType] = useState('')
    const [isShow, setIsShow] = useState(false)
    const dispatch = useDispatch()
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused){
            dispatch(clearPack())
            setIsShow(false)
        }
    }, [isFocused])

    useEffect(() => {
        if(cod) scanPack(cod)
    }, [cod])

    const entity = useSelector(state => state.shipmentScanPack.type)
    const {pack, success, loading} = useSelector(state => state.shipmentScanPack)
    useEffect(() => {
        if (!loading && cod) {
            if (cod && entity && pack) {
                if (entity === 'pack') return navigation.navigate("ShipmentPlaceInfo", {packID: pack.ID})
                if (entity === 'storageCell') return navigation.navigate('ShipmentCellInfo', {pack})
            }
            if (cod && pack === undefined && entity === undefined) {
                setMessage('Такого места или ячейки не существует!')
                setType('error')
                setIsShow(true)
                return setTimeout(() => {
                    dispatch(clearPack())
                    setIsShow(false)
                }, 2500)
            }
        }
    }, [pack, entity])

    const scanCode = (code) => {
        if (code !== cod) {
            setMessage(`Код ${code} отсканирован, получаем информацию`)
            setType('loading')
            setIsShow(true)
            setCode(code)
        }
    }
    const scanPack = (code) => dispatch(fetchShipmentScanPack({code}))
    return (
        <>
            {isFocused ? <View style={styles.container}>
                <ScanComponentForShipment
                    label={message}
                    type={type}
                    scanCode={scanCode}
                    title="Поиск информации"
                    description="Отсканируйте код места или ячейки, чтобы узнать информацию о них"
                    isShow={isShow}
                />
            </View> : <></>}
        </>)

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
