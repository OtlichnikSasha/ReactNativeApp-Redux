import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Picker, Text, ScrollView} from 'react-native'
import {useDispatch, useSelector} from "react-redux";
import {clearCells, fetchCells} from '../../redux/slices/cellsSlice'
import {AppButton} from "../../components/AppButton";
import {StorageCell} from "../../components/StorageCell";
import {PlacesData} from "../../components/PlacesData";
import {AppToast} from "../../components/AppToast";
import {fetchWarehouses} from "../../redux/slices/warehouseSlice";
import {useIsFocused} from "@react-navigation/native";
import {fetchShipmentPackOnStore, clearResult} from "../../redux/slices/shipments/shipmentPacksOnStore";

export const ShipmentCellSelection = ({navigation, route}) => {
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
            clearResultHandler()
        }
    }, [isFocused])

    const {warehouses, loading} = useSelector(state => state.warehouses)
    const {status, error} = useSelector(state => state.shipmentPacksOnStore)
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
        if (status && storageCellData) {
            setMessage("Успешно выгружено в ячейку: " + storageCellData)
            setType('success')
            setIsShow(true)
            return setTimeout(() => {
                navigation.goBack()
            }, 2000)
        }
    }, [status])

    const saveBtn = async () => {
        if (places.length) {
            let packIDs = []
            places.map((place) => packIDs.push(place.ID))
            await sendPackToStore(packIDs)
            return
        }
        setMessage("Загружать нечего!")
        setType('error')
        return setIsShow(true)
    }

    const changePicker = (itemValue) => {
        warehouseID = Number(itemValue)
        dispatch(clearCells())
        dispatch(fetchCells({warehouseID}))
    }

    const sendPackToStore = (packIDs) => {
        dispatch(fetchShipmentPackOnStore({packIDs, storageCellID}))
    }
    const clearResultHandler = () => dispatch(clearResult())
    return (
        <>
            {
                isFocused ?
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
                                    null
                                }
                            </Picker>
                        </View>
                        <View style={styles.mainData}>
                            <Text style={styles.label}>
                                Выберите ячейку склада:
                            </Text>
                            <ScrollView>
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
                            <AppButton label="Отмена" mode="outlined" onPress={cancellationBtn}/>
                            <AppButton label="Сохранить" onPress={saveBtn}/>
                        </View>
                    </View>
                : <></>
            }
        </>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        paddingTop: 35
    },
    select: {
        width: "60%",
        borderWidth: 1,
        borderColor: "#585858"
    },
    mainData: {
        height: "80%",
        marginBottom: 10
    },
    cellsPlace: {
        flexDirection: "row",
        width: "100%",
        flexWrap: "wrap"
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
        position: "absolute",
        width: "100%",
        left: 10,
        right: 10,
        top: 10,
        justifyContent: "center",
        flexDirection: "row",
        paddingVertical: 8
    }
})