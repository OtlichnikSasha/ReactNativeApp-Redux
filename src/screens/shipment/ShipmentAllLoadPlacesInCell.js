import React, {useEffect, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {useDispatch, useSelector} from "react-redux";
import {fetchShipmentScanPack, clearPack} from "../../redux/slices/shipments/shipmentScanPack";
import {ScanComponentForCell} from "../../components/ScanComponentForCell";
import {PlacesData} from "../../components/PlacesData";
import {useIsFocused} from "@react-navigation/native";
import {reloadShipmentPalletPacks} from "../../redux/slices/shipments/shipmentPalletPacks";
import {fetchShipmentPackOnStore, clearResult} from "../../redux/slices/shipments/shipmentPacksOnStore";

export const ShipmentAllLoadAllPlacesInCell = ({navigation, route}) => {
    const {sectionID} = route.params
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
            setIsShow(false)
            scanCodeHandler(cod)
        }
    }, [cod])

    const entity = useSelector(state => state.shipmentScanPack.type)
    const {pack, loading} = useSelector(state => state.shipmentScanPack)
    const {status, error} = useSelector(state => state.shipmentPacksOnStore)
    const places = useSelector(state => state.shipmentPalletPacks.packs)

    useEffect(async () => {
        console.log('pack/entity/cod', pack, entity, cod)
        if (!loading && cod) {
            if (entity === 'pack') {
                setMessage("Это код места!")
                setType('error')
                return setIsShow(true)
            }
            if (cod && entity === undefined && pack === undefined) {
                setMessage('Такой ячейки не существует!')
                setType('error')
                return setIsShow(true)
            }
            if (entity === 'storageCell' && cod) {
                const storageCellID = pack.ID
                const packIDs = []
                if (places.length) {
                    places.map((place) => packIDs.push(place.ID))
                    await sendCode(packIDs, storageCellID)
                    return
                }
                setMessage('Вы не отсканировали ни одного места!')
                setType('error')
                return setIsShow(true)

            }
        }
    }, [pack, entity])

    useEffect(() => {
        if (error) {
            setMessage(error)
            setType('error')
            return setIsShow(true)
        }
        if (status && pack) {
            setMessage('Места выгружены в ячейку: ' + pack.data)
            setType('success')
            setIsShow(true)
            return setTimeout(() => {
                setIsShow(false)
                clearPackToStoreHandler()
                navigation.goBack()
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
    const loadPacksEffect = () => dispatch(reloadShipmentPalletPacks({limit, sectionID}))
    const submitHandler = () => navigation.goBack()
    const goToSellSelection = () => navigation.navigate("ShipmentCellSelection", {places})
    const clearPackToStoreHandler = () => dispatch(clearResult())
    const sendCode = (packIDs, storageCellID) => dispatch(fetchShipmentPackOnStore({packIDs, storageCellID}))
    const scanCodeHandler = (code) => dispatch(fetchShipmentScanPack({code}))
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