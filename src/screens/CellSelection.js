import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Picker, Text, ScrollView} from 'react-native'
import {useDispatch, useSelector} from "react-redux";
import {clearCells, fetchCells} from '../redux/slices/cellsSlice'
import {AppButton} from "../components/AppButton";
import {StorageCell} from "../components/StorageCell";
import {PlacesData} from "../components/PlacesData";
import {AppToast} from "../components/AppToast";
import {fetchPackToStore, clearPackStore} from "../redux/slices/packsToStore";
import {fetchWarehouses} from "../redux/slices/warehouseSlice";
import {useIsFocused} from "@react-navigation/native";
import {fetchPacksCount} from "../redux/slices/packsCountSlice";

export const CellSelection = ({navigation, route}) => {
    const [storageCellID, setStorageCellID] = useState(-1)
    const [storageCellData, setStorageData] = useState('')
    const [isShow, setIsShow] = useState(false)
    const [type, setType] = useState('')
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const limit = "all"
    const isFocused = useIsFocused()
    useEffect(() => {
        if (isFocused) {
            dispatch(fetchWarehouses({limit}))
            clearPackToStoreHandler()
        }
    }, [isFocused])

    const warehouses = useSelector(state => state.warehouses.warehouses)
    const loading = useSelector(state => state.warehouses.loading)
    const {status, error} = useSelector(state => state.packToStore)
    const {places} = route.params
    let warehouseID = 0
    if (warehouses.length) warehouseID = warehouses[0].ID
    useEffect(() => {
        dispatch(fetchCells({warehouseID}))
    }, [warehouses])
    const cells = useSelector(state => state.cells.cells)
    const cancellationBtn = () => navigation.goBack()

    useEffect(() => {
        if (error) {
            setMessage(error)
            setType('error')
            return setIsShow(true)
        }
        if (status) {
            setMessage("Успешно выгружено в ячейку: " + storageCellData)
            setType('success')
            setIsShow(true)
            clearPackToStoreHandler()
            return setTimeout(() => {
                navigation.goBack()
                dispatch(fetchPacksCount({}))
            }, 2000)
        }
    }, [status])

    const saveBtn = () => {
        if (places.length) {
            let packIDs = []
            places.map((place) => packIDs.push(place.ID))
            return sendPackToStore(packIDs)
        }
        setMessage("Загружать нечего!")
        setType('error')
        setIsShow(true)
        return closeTimer()
    }

    const changePicker = (itemValue) => {
        warehouseID = Number(itemValue)
        dispatch(clearCells())
        dispatch(fetchCells({warehouseID}))
    }

    const sendPackToStore = (packIDs) => {
        dispatch(fetchPackToStore({packIDs, storageCellID}))
    }
    const clearPackToStoreHandler = () => dispatch(clearPackStore())

    const closeTimer = () => {
        return setTimeout(() => {
            setIsShow(false)
        }, 2500)
    }
    return (
        <View style={styles.container}>
            <PlacesData places={places}/>
            <View style={styles.header}>
                <AppToast type={type} label={message} isShow={isShow}/>
            </View>
            <Text style={styles.label}>
                Выберите склад:
            </Text>
            <View style={styles.select}>
                <Picker
                    onValueChange={(itemValue) => changePicker(itemValue)}
                >
                    {warehouses.length ? warehouses.map((warehouse, i) =>
                            <Picker.Item label={warehouse.name} value={warehouse.ID} key={i}/>
                        )
                        :
                        <></>
                    }
                </Picker>
            </View>
            <View style={styles.mainData}>
                <Text style={styles.label}>
                    Выберите ячейку склада:
                </Text>
                <ScrollView style={{height: "62%"}}>
                    <View style={styles.cellsPlace}>
                        {cells.length && !loading ? cells.map((cell, i) =>
                                <StorageCell cell={cell} setStorageData={setStorageData} setStorageCellId={setStorageCellID}
                                             key={i}
                                             style={storageCellID === cell.ID ? styles.activeBlock : ''}/>
                            )
                            :
                            <Text>
                                В этом складе нет ячеек
                            </Text>
                        }
                    </View>
                </ScrollView>
                <View style={styles.wrapper}>
                    <AppButton label="Отмена" mode="outlined" onPress={cancellationBtn}/>
                    <AppButton label="Сохранить" onPress={saveBtn}/>
                </View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 12,
        paddingTop: 60
    },
    select: {
        width: "60%",
        borderWidth: 1,
        borderColor: "#585858"
    },

    cellsPlace: {
        flexDirection: "row",
        width: "100%",
        flexWrap: "wrap",

    },

    label: {
        color: "#585858",
        marginVertical: 10,
        fontSize: 16,
    },
    saveBtn: {
        marginTop: 10
    },
    activeBlock: {
        backgroundColor: "#C04141"
    },
    header: {
        width: "100%",
        justifyContent: "flex-start",
        flexDirection: "row",
        paddingVertical: 8,
    },
    wrapper: {
        justifyContent: "flex-end",
    }
})