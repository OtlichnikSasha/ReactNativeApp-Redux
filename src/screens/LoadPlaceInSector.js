import React, {useEffect, useState} from 'react'
import {View, StyleSheet} from "react-native";
import {ScanComponent} from "../components/ScanComponent";
import {clearPack, fetchShipmentScanPack} from "../redux/slices/shipments/shipmentScanPack";
import {useSelector, useDispatch} from "react-redux";
import {fetchPackToSector, clearSectorPack} from "../redux/slices/packToSector";
import {useIsFocused} from "@react-navigation/native";
import {fetchPacksCount} from "../redux/slices/packsCountSlice";

export const LoadPlaceInSector = ({navigation}) => {
    const [cod, setCode] = useState('')
    const [message, setMessage] = useState('')
    const [type, setType] = useState('')
    const [isShow, setIsShow] = useState(false)
    const dispatch = useDispatch()
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            setIsShow(false)
            clearSector()
            dispatch(clearPack())
        }
    }, [isFocused])

    useEffect(() => {
        if (cod !== '') packHandler(cod)
    }, [cod])
    const entity = useSelector(state => state.shipmentScanPack.type)
    const {pack, loading, success} = useSelector(state => state.shipmentScanPack)
    const {status, error} = useSelector(state => state.packToSector)
    const sections = useSelector(state => state.sections.sections)
    const closePage = () => navigation.goBack()
    useEffect(() => {
        if (!loading && cod) {
            if (entity === 'pack' && pack.status === 'ON_PALLET_TO_SECTOR') { // Надо добавить ещё каких то проверок!
                if (!pack.sectionID) {
                    setMessage('Место не привязано к сектору!')
                    setType('error')
                    return setIsShow(true)
                }
                const packIDs = []
                packIDs.push(pack.ID)
                return sendPlaceInSector(packIDs)
            }
            if (cod && !success) {
                setMessage('Такого места не существует!')
                setType('error')
                return setIsShow(true)
            }
            if (entity === 'storageCell' && cod) {
                setMessage("Это код ячейки!")
                setType('error')
                return setIsShow(true)
            }
            if (entity === 'pack' && pack.status !== 'ON_PALLET_TO_SECTOR') {
                setMessage("Место не может быть загружено!")
                setType('error')
                return setIsShow(true)
            }
        }
    }, [pack, entity])

    useEffect(() => {
        if(error){
            setType("error")
            setMessage(error)
            setIsShow(true)
            return setTimeout(() => {
                setIsShow(false)
            }, 2500)
        }
        if (status && pack) {
            dispatch(fetchPacksCount({}))
            clearSector()
            setType("success")
            setMessage(`Место ${pack.code} выгружено в ${getSection(pack)}`)
            setIsShow(true)
            return setTimeout(() => {
                setIsShow(false)
            }, 2500)
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
    const clearSector = () => dispatch(clearSectorPack())
    const packHandler = (code) => dispatch(fetchShipmentScanPack({code}))
    const sendPlaceInSector = (packIDs) => dispatch(fetchPackToSector({packIDs}))
    const getSection = (pack) => {
        const section = sections?.find(section => section.ID === pack?.sectionID)
        if(section) return section.name
    }
    return (
        <>
            {isFocused ?
                <View style={styles.container}>
                        <ScanComponent
                            scanCode={scanCode}
                            title="Выгрузка места на сектор хранения"
                            description="Отсканируйте код места, чтобы узнать, на какой сектор его выгрузить"
                            label={message}
                            isShow={isShow}
                            type={type}
                            closeScanner={closePage}
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