import React, {useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useIsFocused} from "@react-navigation/native";
import {clearOrder, fetchOrder} from "../redux/slices/orderSlice";
import {clearSubOrder, fetchSubOrder} from "../redux/slices/subOrderSlice";
import {fetchPackHistory, clearHistory} from "../redux/slices/placeHistoryPlace";
import {StyleSheet, SafeAreaView, View, TouchableOpacity, Text, ScrollView} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Row, Table} from "react-native-table-component";
import moment from 'moment';
import {fetchHistoryPackSlice} from "../redux/slices/packHistorySlice";

export const PlaceHistory = ({navigation, route}) => {
    const {packID} = route.params
    const dispatch = useDispatch();
    const isFocused = useIsFocused()
    useEffect(() => {
        if (isFocused) {
            dispatch(clearOrder())
            dispatch(clearSubOrder())
            dispatch(clearHistory())
        }
    }, [isFocused])

    const getPack = useCallback(() => {
        dispatch(fetchHistoryPackSlice({id: packID}))
    }, [route])

    useEffect(() => {
        getPack()
    }, [getPack])

    const {pack} = useSelector(state => state.packHistory)
    const {order} = useSelector(state => state.order)
    const {subOrder} = useSelector(state => state.subOrder)
    const {history, loading} = useSelector(state => state.placeHistory)
    const state = {
        tableHead: ['Дата и время', 'Событие', 'Сотрудник'],
        widthArr: [2.5, 5, 2.5],
    };

    const getPackData = useCallback(() => {
        if (pack && pack.ID === packID) {
            if (pack.orderID) dispatch(fetchOrder({id: pack.orderID}))
            if (pack.subOrderID) dispatch(fetchSubOrder({id: pack.subOrderID}))
            dispatch(fetchPackHistory({entity: "pack", entityID: pack.ID}))
        }
    }, [pack])

    useEffect(() => {
        getPackData()
    }, [getPackData])
    return (
        <>
            {
                isFocused && pack ?
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
                        </View>
                        {order ? <Text style={styles.order}>Заказ {order.number}</Text> : <></>}
                        {subOrder ? <Text>Подзаказ {subOrder.name}</Text> : <></>}
                        <View style={styles.table}>
                            <Table borderStyle={{borderWidth: 1, borderColor: '#9F9E9E'}}>
                                <Row
                                    flexArr={state.widthArr}
                                    data={state.tableHead}
                                    style={styles.head}
                                    textStyle={styles.text}
                                />
                            </Table>
                            <ScrollView>
                                <Table borderStyle={{borderWidth: 1, borderColor: '#9F9E9E'}}>
                                    {
                                        !loading && history.length ?
                                            history.map((history, i) => (
                                                <Row
                                                    key={i}
                                                    data={[moment(history.time).format('DD.MM.YYYY H:mm'), history.action, history.mobileUserName || "Сотрудник"]}
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
        marginVertical: 5,
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
    table: {
        marginTop: 15,
        marginBottom: 120,
    },
    head: {height: 40, backgroundColor: '#F2F2F2'},
    text: {margin: 3, fontSize: 10, textAlign: 'center'},
})

