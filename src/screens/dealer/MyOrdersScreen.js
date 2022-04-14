import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Empty} from '../../components/Empty';
import {ScrollList} from '../../components/ScrollList';
import {fetchOrders, reloadOrders, clearOrders} from '../../redux/slices/dealer/ordersSlice';
import {useIsFocused} from "@react-navigation/native";
import {Ionicons} from "@expo/vector-icons";

export const MyOrdersScreen = ({navigation, route}) => {
    const dispatch = useDispatch();
    const limit = 30;
    const isFocused = useIsFocused();
    const [order, setOrder] = useState('')
    useEffect(() => {
        console.log('route.params', route.params)
        console.log('navigation', navigation.canGoBack())
        if (isFocused) {
            setOrder('')
            dispatch(clearOrders())
            if(route.params) return setOrder(route.params.pack.data)
            return loadOrders();
        }
    }, [isFocused]);
    const onRefresh = useCallback(() => loadOrders(), []);
    const {orders, loading, total} = useSelector((state) => state.orders);

    const loadOrders = () => dispatch(reloadOrders({limit}));
    const loadOrdersOffset = () => {
        if (loading || orders.length === total) return
        const offset = orders.length / limit * limit
        dispatch(fetchOrders({limit, offset}));
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollList loading={loading} onScroll={loadOrdersOffset} onRefresh={onRefresh}>
                {!orders.length && !order ? <Empty visible={!loading}/> : <></>}
                {orders.length ? (
                    orders.map(order => (
                        <TouchableOpacity
                            key={order.ID}
                            style={styles.listItem}
                            onPress={() => navigation.navigate('PackInfo', {order})}
                        >
                            <Text style={styles.item}>
                                {`${order.contractNumber} Заказ ${order.number}`}
                            </Text>
                        </TouchableOpacity>
                    ))
                ) : <></>}

                {order ?
                    <TouchableOpacity
                        style={styles.listItem}
                        onPress={() => navigation.navigate('PackInfo', {order})}
                    >
                        <Text style={styles.item}>
                            {`${order.contractNumber} Заказ ${order.number}`}
                        </Text>
                    </TouchableOpacity>
                    :
                    <></>
                }
            </ScrollList>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    listItem: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginVertical: 5,
        marginHorizontal: 15,
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: '#9B9B9B44',
        borderRadius: 5,
    },
    item: {
        fontSize: 14,
    },
});
