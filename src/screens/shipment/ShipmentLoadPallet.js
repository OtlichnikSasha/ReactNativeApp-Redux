import React, {useEffect, useState} from 'react';
import {ScanComponent} from "../../components/ScanComponent";
import {useDispatch, useSelector} from "react-redux";
import {clearPack, fetchShipmentScanPack} from "../../redux/slices/shipments/shipmentScanPack";
import {useIsFocused} from "@react-navigation/native";
import {fetchShipmentPackOnPallet, clearResult} from "../../redux/slices/shipments/shipmentPacksOnPallet";
import {StyleSheet, View} from "react-native";
import {reloadShipmentPalletPacks} from "../../redux/slices/shipments/shipmentPalletPacks";

export const ShipmentLoadPallet = ({navigation, route}) => {
    const {sectionID, departureID} = route.params
    const [cod, setCode] = useState('')
    const [message, setMessage] = useState('')
    const [type, setType] = useState('')
    const [isShow, setIsShow] = useState(false)
    const isFocused = useIsFocused()
    const dispatch = useDispatch()
    useEffect(() => {
        if (isFocused) {
            dispatch(clearResult())
            dispatch(clearPack())
        }
    }, [isFocused])
    useEffect(() => {
        if (cod !== '') scanCodeHandler(cod)
    }, [cod])
    const entity = useSelector(state => state.shipmentScanPack.type)
    const {pack, loading} = useSelector(state => state.shipmentScanPack)
    const {status, error} = useSelector(state => state.shipmentPacksOnPallet)
    useEffect(() => {
        if (!loading && cod) {
            console.log('pack/entity', pack, entity)
            if (entity === 'pack' && pack.status === 'STAYED_ON_SECTOR') {
                if (pack.sectionID !== sectionID) {
                    setMessage('Место не с этого сектора!')
                    setType('error')
                    return setIsShow(true)
                }
                const packIDs = []
                packIDs.push(pack.ID)
                return sendToPallet(packIDs)
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
            if (entity === 'pack' && pack.status !== 'STAYED_ON_SECTOR') {
                setMessage("Нельзя загрузить это место!")
                setType('error')
                return setIsShow(true)
            }
        }
    }, [pack, entity])

    useEffect(() => {
        console.log('status/error', status, error)
        if(!status && error){
            setType('error')
            setMessage(error)
            return setIsShow(true)
        }
        if(status){
            setType('success')
            setMessage('Место ' + cod + ' загружено')
            setIsShow(true)
            dispatch(reloadShipmentPalletPacks({sectionID}))
            return dispatch(clearResult())
        }
    }, [status])


    const scanCode = (code) => {
        if (code !== cod) {
            setMessage(`Код ${code} отсканировали, получаем информацию`)
            setType('loading')
            setIsShow(true)
            setCode(code)
        }
    }
    const goBack = () => navigation.goBack()
    const scanCodeHandler = (code) => dispatch(fetchShipmentScanPack({code}))
    const sendToPallet = (packIDs) => dispatch(fetchShipmentPackOnPallet({packIDs}))
    return (
        <>
            {isFocused ?
                <View style={styles.container}>
                    <ScanComponent
                        title="Загрузка мест на поддон"
                        isShow={isShow}
                        type={type}
                        label={message}
                        description="Отсканируйте места и они будут перемещены на поддон"
                        scanCode={scanCode}
                        closeScanner={goBack}
                    />
                </View>
                :
                <></>}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})