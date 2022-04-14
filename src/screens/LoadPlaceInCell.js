import React, {useEffect, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {ScanComponentForCell} from "../components/ScanComponentForCell";
import {useDispatch, useSelector} from "react-redux";
import {fetchShipmentScanPack, clearPack} from "../redux/slices/shipments/shipmentScanPack";
import {PlacesData} from "../components/PlacesData";
import {fetchPackToStore, clearPackStore} from "../redux/slices/packsToStore";
import {useIsFocused} from "@react-navigation/native";
import {fetchPacksCount} from "../redux/slices/packsCountSlice";

export const LoadPlaceInCell = ({navigation}) => {
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
            clearPackToStoreHandler()
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
    const {pack, loading} = useSelector(state => state.shipmentScanPack)
    const {status, error} = useSelector(state => state.packToStore)
    let packIDs = []

    useEffect(() => {
        if (!loading && cod) {
            if (entity === 'pack' && pack.status === 'ON_PALLET_TO_STORE') {
                for (let packId in places) {
                    if (places[packId]['ID'] === pack.ID) {
                        setMessage('Место уже загружено!')
                        setType('error')
                        setIsShow(true)
                        return closeTimer()
                    }
                }
                return setPlaces([...places, pack])
            }
            if (entity === 'storageCell' && cod) {
                const storageCellID = pack.ID
                if (places.length) {
                    places.map((place) => packIDs.push(place.ID))
                    return sendCode(packIDs, storageCellID)
                }
                setMessage('Вы не отсканировали ни одного места!')
                setType('error')
                setIsShow(true)
                return closeTimer()

            }
            if (entity === 'pack' && pack.status !== 'ON_PALLET_TO_STORE') {
                setMessage('Место ' + cod + ' не может быть выгружено в ячейку')
                setType('error')
                setIsShow(true)
                return closeTimer()
            }
            if (entity === undefined && pack === undefined && cod) {
                setMessage("Не найдено такого места")
                setType('error')
                setIsShow(true)
                return closeTimer()
            }
        }
    }, [pack, entity])


    useEffect(() => {
        if (error) {
            setMessage(error)
            setType('error')
            setIsShow(true)
            return closeTimer()
        }
        if (status && pack && pack.hasOwnProperty("data")) {
            setPlaces([])
            setMessage('Места выгружены в ячейку: ' + pack.data)
            setType('success')
            clearPackToStoreHandler()
            setIsShow(true)
            return setTimeout(() => {
                setIsShow(false)
                dispatch(fetchPacksCount({}))
            }, 2000)
        }
    }, [status])

    const submitHandler = () => navigation.goBack()
    const goToSellSelection = () => {
        navigation.navigate("CellSelection", {places})
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