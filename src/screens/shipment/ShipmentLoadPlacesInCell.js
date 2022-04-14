import React, {useEffect, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {ScanComponentForCell} from "../../components/ScanComponentForCell";
import {useDispatch, useSelector} from "react-redux";
import {fetchShipmentScanPack, clearPack} from "../../redux/slices/shipments/shipmentScanPack";
import {PlacesData} from "../../components/PlacesData";
import {useIsFocused} from "@react-navigation/native";
import {fetchShipmentPackOnStore, clearResult} from "../../redux/slices/shipments/shipmentPacksOnStore";

export const ShipmentLoadPlacesInCell = ({navigation}) => {
    const [cod, setCode] = useState('')
    const [message, setMessage] = useState('')
    const [type, setType] = useState('')
    const [isShow, setIsShow] = useState(false)
    const [places, setPlaces] = useState([])
    const dispatch = useDispatch()
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            setIsShow(false)
            dispatch(clearPack())
        }
    }, [isFocused])

    useEffect(() => {
        if (cod !== '') {
            setIsShow(false)
            clearPackToStoreHandler()
            scanCodeHandler(cod)
        }
    }, [cod])
    const entity = useSelector(state => state.shipmentScanPack.type)
    const {loading, pack} = useSelector(state => state.shipmentScanPack)
    const {status, error} = useSelector(state => state.shipmentPacksOnStore)

    useEffect(async () => {
        if (!loading && cod) {
            console.log('pack/entity', pack, entity)
            if (entity === 'pack' && pack.status === 'ON_PALLET_TO_STORE') {
                for (let packId in places) {
                    if (places[packId]['ID'] === pack.ID) {
                        setMessage('Место уже загружено!')
                        setType('error')
                        return setIsShow(true)
                    }
                }
                return setPlaces([...places, pack])
            }
            if (entity === 'storageCell' && cod) {
                const storageCellID = pack.ID
                if (places.length) {
                    const packIDs = []
                    places.map((place) => packIDs.push(place.ID))
                    await sendCode(packIDs, storageCellID)
                    return;
                }
                setMessage('Вы не отсканировали ни одного места!')
                setType('error')
                return setIsShow(true)

            }
            if (entity === 'pack' && pack.status !== 'ON_PALLET_TO_STORE') {
                setMessage('Место ' + cod + ' не может быть выгружено в ячейку')
                setType('error')
                return setIsShow(true)
            }
            if (entity === undefined && pack === undefined && cod) {
                setMessage("Не найдено такого места")
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
            setPlaces([])
            setMessage('Места выгружены в ячейку: ' + pack.data)
            setType('success')
            clearPackToStoreHandler()
            setIsShow(true)
            return setTimeout(() => {
                setIsShow(false)
            }, 2000)
        }
    }, [status])

    const submitHandler = () => navigation.goBack()
    const goToSellSelection = () => {
        navigation.navigate("ShipmentCellSelection", {places})
        setPlaces([])
        setIsShow(false)
        setMessage('')
        setType('')
    }

    const scanCode = (code) => {
        if (code !== cod) {
            setMessage(`Код ${code} отсканировали, получаем информацию`)
            setType('loading')
            setIsShow(true)
            setCode(code)
        }
    }
    const clearPackToStoreHandler = () => dispatch(clearResult())
    const sendCode = (packIDs, storageCellID) => dispatch(fetchShipmentPackOnStore({packIDs, storageCellID}))
    const scanCodeHandler = (code) => dispatch(fetchShipmentScanPack({code}))
    return (
        <>
            {isFocused ?
                <View style={styles.container}>
                    <PlacesData places={places}/>
                    <ScanComponentForCell
                        label={message}
                        isShow={isShow}
                        type={type}
                        title="Выгрузка мест в ячейку склада"
                        description="Отсканируйте код места и код ячейки, чтобы выгрузить место в ячейку склада"
                        scanCode={scanCode}
                        onPress={submitHandler}
                        goToCellSelection={goToSellSelection}
                        places={places}
                        disabled={!places.length}
                    />
                </View>
                :
                <></>
            }
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