import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {Ionicons} from '@expo/vector-icons';
import {Row, Table} from 'react-native-table-component';
import {useDispatch, useSelector} from "react-redux";
import {fetchShipmentPack} from "../../redux/slices/shipments/shipmentPackSlice";
import {useIsFocused} from "@react-navigation/native";
import {fetchOrder, clearOrder} from "../../redux/slices/orderSlice";
import {fetchSubOrder, clearSubOrder} from "../../redux/slices/subOrderSlice";
import {fetchDeparture, clearDeparture} from "../../redux/slices/departureSlice";
import {fetchTransitWarehouse, clearWarehouse} from "../../redux/slices/transitWarehouseSlice";
import {fetchCell, clearCell} from "../../redux/slices/cellSlice";
import {fetchPoint, clearPoint} from "../../redux/slices/pointSlice";
import {fetchSectionForPlaceInfo, clearSection} from "../../redux/slices/sections/sectionForPlaceInfoSlice";

export const ShipmentPlaceInfo = ({navigation, route}) => {
    const {packID} = route.params;
    const state = {
        tableHead: ['№ Модуля', 'Поз.', 'Детали упаковки', 'Кол-во', 'Штрих код'],
        widthArr: [1.2, 0.6, 4, 0.9, 1.3],
    };
    const dispatch = useDispatch();
    const isFocused = useIsFocused()
    const [status, setStatus] = useState(null)
    const [location, setLocation] = useState(null)

    const cleaner = useCallback(() => {
        dispatch(clearSection())
        dispatch(clearOrder())
        dispatch(clearSubOrder())
        dispatch(clearDeparture())
        dispatch(clearWarehouse())
        dispatch(clearCell())
        dispatch(clearPoint())
    }, [])

    const getPack = useCallback(() => {
        setLocation(null)
        setStatus(null)
        cleaner()
        dispatch(fetchShipmentPack({id: packID, withDetails: true}))
        console.log(order, subOrder, departure, warehouse, cell, section, pack, point)
    }, [route])

    useEffect(() => {
        cleaner()
        getPack()
    }, [getPack])

    const {order} = useSelector(state => state.order)
    const {subOrder} = useSelector(state => state.subOrder)
    const {section} = useSelector(state => state.sectionForPlaceInfoSlice)
    const {pack, loading} = useSelector(state => state.shipmentPack)
    const {departure} = useSelector(state => state.departure)
    const {warehouse} = useSelector(state => state.transitWarehouse)
    const {cell} = useSelector(state => state.cell)
    const {point} = useSelector(state => state.point)

    const getPackInfo = useCallback(() => {
        if (pack && !loading && pack.ID === packID) {
            setLocation(null)
            setStatus(null)
            cleaner()
            if (pack.orderID) dispatch(fetchOrder({id: pack.orderID}))
            if (pack.subOrderID) dispatch(fetchSubOrder({id: pack.subOrderID}))
            if (pack.transitWarehouseID && pack.status !== "STAYED_ON_SECTOR") dispatch(fetchTransitWarehouse({id: pack.transitWarehouseID}))
            switch (pack.status) {
                case "ON_PALLET_TO_STORE":
                    setLocation("На поддоне к складу")
                    return setStatus("В работе")
                case "ON_PALLET_TO_SECTOR":
                    if (pack.departureID) dispatch(fetchDeparture({id: pack.departureID}))
                    setStatus("Готово к отгрузке")
                    return setLocation("На поддоне к сектору")
                case "ON_STORE":
                    if (pack.departureID) dispatch(fetchDeparture({id: pack.departureID}))
                    if (pack.storageCellID) {
                        dispatch(fetchCell({id: pack.storageCellID}))
                    }
                    return setStatus("На складе")
                case "CREATED":
                    if (pack.pointID) dispatch(fetchPoint({id: pack.pointID}))
                    return setStatus("В работе")
                case "STAYED_ON_SECTOR":
                    if (pack.sectionID) dispatch(fetchSectionForPlaceInfo({id: pack.sectionID}))
                    return setStatus("Остатки в секторе")
                case "GIVE_AWAY_CLIENT":
                    if (pack.departureID) dispatch(fetchDeparture({id: pack.departureID}))
                    return setStatus("У дилера")
                case "ACCEPTED_TRANSIT_STORE":
                    if (pack.departureID) dispatch(fetchDeparture({id: pack.departureID}))
                    return setStatus("На транзитном складе")
                case "DELIVERY":
                    if (pack.departureID) dispatch(fetchDeparture({id: pack.departureID}))
                    setLocation("Машина")
                    return setStatus("В пути или в машине")
                case "ON_PREPARED_PALLET":
                    if (pack.pointID) dispatch(fetchPoint({id: pack.pointID}))
                    return setStatus("В работе")
                case "PRODUCTION":
                    return setStatus("Изготавливается")
                case "GIVEN_TO_CLIENT":
                    return setStatus("Отгружен из Логистического центра")
                case "ON_SECTOR":
                    if (pack.sectionID) dispatch(fetchSectionForPlaceInfo({id: pack.sectionID}))
                    if (pack.departureID) dispatch(fetchDeparture({id: pack.departureID}))
                    return setStatus("На секторе")
                case 'DONE' || "PREPARE_TO_DELIVERY":
                    return setStatus("Готово к отгрузке")
                case "ON_TRANSIT_STORE":
                    return setStatus("В Логистическом центре")
                default:
                    return setStatus(pack.status)
            }
        }
    }, [pack])


    useEffect(() => {
        getPackInfo()
    }, [getPackInfo])
    const navigateToHistory = () => navigation.navigate("PlaceHistory", {packID})
    return (
        <>
            {
                isFocused && pack && status ?
                    <SafeAreaView style={styles.container}>
                        <View style={styles.header}>
                            <View style={styles.headerContainer}>
                                <TouchableOpacity
                                    style={styles.backBtn}
                                    onPress={() => navigation.goBack()}
                                >
                                    <Ionicons name="arrow-back" size={24} color="black"/>
                                </TouchableOpacity>
                                <Text style={styles.subOrder}>{pack.code}</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.historyBtn}
                                onPress={navigateToHistory}
                            >
                                <Text>История</Text>
                            </TouchableOpacity>
                        </View>
                        {order ? <Text style={styles.order}>Заказ {order.number}</Text> : <></>}
                        {subOrder ? <Text>Подзаказ {subOrder.name}</Text> : <></>}
                        {status ?
                            <Text style={styles.dataPack}>Статус: {status}</Text> : <></>}
                        {location ? <Text style={styles.dataPack}>Местоположение: {location}</Text> : <></>}
                        {section && pack.status ?
                            <Text style={styles.dataPack}>Местоположение: {section.name}</Text> : <></>}
                        {cell && pack.status === "ON_STORE" ?
                            <Text style={styles.dataPack}>Местоположение: {cell.data}</Text> : <></>}
                        {point ? <Text style={styles.dataPack}>Местоположение: {point.name}</Text> : <></>}
                        {departure ? <Text
                            style={styles.dataPack}>Отгрузка: {moment(departure.createdAt).format('DD.MM.YYYY')}</Text> : <></>}
                        {warehouse && pack.status === "ACCEPTED_TRANSIT_STORE" ?
                            <Text style={styles.dataPack}>Местоположение: {warehouse.name}</Text>
                            : <></>}
                        {warehouse && pack.status !== "ACCEPTED_TRANSIT_STORE" ?
                            <Text style={styles.dataPack}>Транзитный склад: {warehouse.name}</Text> : <></>}
                        {pack.hasOwnProperty("details") ?
                            <Text style={styles.dataPack}>Кол-во деталей: {pack.details.length}</Text>
                            :
                            <></>}
                        <View style={styles.table}>
                            <Table borderStyle={{borderWidth: 1, borderColor: '#9F9E9E'}}>
                                <Row
                                    flexArr={state.widthArr}
                                    data={state.tableHead}
                                    style={styles.head}
                                    textStyle={styles.text}
                                />
                            </Table>
                            <ScrollView style={{height: "60%"}}>
                                <Table borderStyle={{borderWidth: 1, borderColor: '#9F9E9E'}}>
                                    {
                                        pack && pack.hasOwnProperty("details") && pack.details.length ?
                                            pack.details.map((detail, i) => (
                                                <Row
                                                    key={i}
                                                    data={[detail.modulePosition, detail.detailPosition, detail.label, detail.count, detail.code]}
                                                    flexArr={state.widthArr}
                                                    textStyle={styles.text}
                                                />
                                            )) :
                                            <></>
                                    }
                                </Table>
                            </ScrollView>
                        </View>
                    </SafeAreaView>
                    :
                    <></>
            }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingHorizontal: 15
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    subHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    backBtn: {
        paddingRight: 10,
    },
    headerContainer: {
        flexDirection: 'row',
    },
    subOrder: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    order: {
        marginRight: 10,
        fontSize: 16,
    },
    historyBtn: {
        padding: 8,
        borderWidth: 1,
        borderColor: "#737373FF",
        borderRadius: 5
    },
    dataPack: {
        fontSize: 16,
        paddingVertical: 5
    },
    count: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    listItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 55,
        marginVertical: 10,
        marginHorizontal: 15,
        paddingHorizontal: 10,
        padding: 5,
        backgroundColor: '#9B9B9B44',
        borderRadius: 5,
    },
    item: {
        alignItems: 'center',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '900',
    },
    itemCount: {
        fontSize: 16,
        fontWeight: '900',
    },

    head: {height: 40, backgroundColor: '#F2F2F2'},
    text: {margin: 3, fontSize: 10, textAlign: 'center'},
});
