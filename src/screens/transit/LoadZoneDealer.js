import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {ScanComponent} from '../../components/ScanComponent';
import {clearPack, fetchShipmentScanPack} from "../../redux/slices/shipments/shipmentScanPack";
import {useIsFocused} from "@react-navigation/native";
import {sendAwayPackIDs, clearResult} from "../../redux/slices/transit/sendAwayPacks";

export const LoadZoneDealer = ({navigation}) => {
    const dispatch = useDispatch()
    const isFocused = useIsFocused();
    const [cod, setCode] = useState('')
    const [message, setMessage] = useState('')
    const [type, setType] = useState('')
    const [isShow, setIsShow] = useState(false)
    useEffect(() => {
        if (isFocused) {
            dispatch(clearPack())
            dispatch(clearResult())
            setIsShow(false)
        }
    }, [isFocused])

    useEffect(() => {
        if (cod !== '') packHandler(cod)
    }, [cod])

    const {pack, loading} = useSelector(state => state.shipmentScanPack)
    const entity = useSelector(state => state.shipmentScanPack.type)
    const {status, error} = useSelector(state => state.sendAwayPackIDs)

    const scanCode = (code) => {
        if (code !== cod) {
            setMessage(`Код ${code} отсканирован, получаем информацию`)
            setType('loading')
            setIsShow(true)
            setCode(code)
        }
    }

    useEffect(async () => {
        if (!loading && cod) {
            if (cod && pack === undefined) {
                setMessage('Такого места не существует!')
                setType('error')
                return setIsShow(true)
            }
            if (entity === 'storageCell' && cod) {
                setMessage("Это код ячейки!")
                setType('error')
                return setIsShow(true)
            }
            if (pack.status === 'ACCEPTED_TRANSIT_STORE' && entity === 'pack') { // Ещё проверка на departureID машины
                const packIDs = []
                packIDs.push(pack.ID)
                await sendToDealer(packIDs);
                return;
            }
            if (pack.status !== 'ACCEPTED_TRANSIT_STORE' && entity === 'pack') { // Ещё проверка на departureID машины
                setMessage("Это место не может быть загружено!")
                setType('error')
                return setIsShow(true)
            }
        }
    }, [pack, entity])

    useEffect(() => {
        if(error){
            setMessage(error)
            setType('error')
            setIsShow(true)
            return setTimeout(() => {
                dispatch(clearPack())
                dispatch(clearResult())
                setIsShow(false)
            }, 3000)
        }
        if(status && pack && pack.code){
            setMessage("Место " + pack.code + " загружено")
            setType('success')
            setIsShow(true)
            return setTimeout(() => {
                dispatch(clearPack())
                dispatch(clearResult())
                setIsShow(false)
            }, 3000)
        }
    }, [status])

    const packHandler = (code) => dispatch(fetchShipmentScanPack({code}))
    const submitHandler = () => navigation.goBack()
    const sendToDealer = (packIDs) => dispatch(sendAwayPackIDs({packIDs}))
    return (
        <>
            {isFocused ?
                <View style={styles.container}>
                    <ScanComponent
                        label={message}
                        isShow={isShow}
                        type={type}
                        title="Отгрузка места дилеру"
                        description="Отсканируйте код места, чтобы отгрузить его дилеру"
                        scanCode={scanCode}
                        closeScanner={submitHandler}
                    />
                </View>
                :
                <></>}
        </>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
