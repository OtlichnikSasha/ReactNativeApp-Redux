import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, {useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Ionicons} from '@expo/vector-icons';
import {ScrollList} from '../../components/ScrollList';
import {Empty} from '../../components/Empty';
import {fetchSubOrders, reloadSubOrders} from '../../redux/slices/dealer/subOrdersSlice';

const PackInfoScreen = ({route, navigation}) => {
    const {order} = route.params;
    const orderID = order.ID;
    const limit = 30
    const {subOrders, loading, total} = useSelector((state) => state.subOrders);
    const dispatch = useDispatch();
    const onRefresh = useCallback(() => {
        loadSubOrdersHandler()
    }, []);

    useEffect(() => {
        loadSubOrdersHandler()
    }, [route]);

    const statusDescription = (s) => {
        if (s === 'PRODUCTION') return 'Изготавливается'
        if (s === 'GIVEN_TO_CLIENT') return 'Отгружен из Логистического центра'
        if (s === 'DONE' || "PREPARE_TO_DELIVERY" || "ON_STORE") return 'Готово к отгрузке'
        if (s === 'DELIVERY') return 'В пути'
        if (s === 'ON_TRANSIT_STORE') return 'В Логистическом центре'
    };
    const navigateToPack = (subOrder) => {
        if (subOrder.deliveryStatus === 'PRODUCTION') {
            return navigation.navigate('PackInfoManufactured', {order, subOrder})
        }
        return navigation.navigate('PackInfoShipped', {order, subOrder})
    }
    const loadSubOrders = () => {
        if (loading || subOrders.length === total) return
        const offset = (subOrders.length / limit) * limit
        loadSubOrdersHandlerOffset(offset)
    }
    const loadSubOrdersHandler = () => dispatch(reloadSubOrders({orderID, limit}));
    const loadSubOrdersHandlerOffset = (offset = 0) => dispatch(fetchSubOrders({orderID, offset, limit}));
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="black"/>
                </TouchableOpacity>
                <Text style={styles.carNum}>Подзаказы</Text>
                <Text style={styles.count}>{total}</Text>
            </View>
            <ScrollList
                loading={loading}
                onScroll={loadSubOrders}
                onRefresh={onRefresh}
            >
                {subOrders.length ? (
                        subOrders.map((subOrder) => (
                            <TouchableOpacity
                                key={subOrder.ID}
                                style={styles.listItem}
                                onPress={() => navigateToPack(subOrder)}
                            >
                                <Text style={styles.itemTitle}>
                                    {`Подзаказ ${subOrder.name}`}
                                </Text>
                                <Text style={styles.itemStatus}>
                                    {statusDescription(subOrder.deliveryStatus)}
                                </Text>
                                <Text style={styles.itemCount}>{subOrder.packsCount}</Text>
                            </TouchableOpacity>
                        ))
                    ) :
                    <Empty visible={!loading}/>
                }
            </ScrollList>
        </SafeAreaView>
    );
};

export default PackInfoScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 15,
        marginVertical: 5,
    },
    backBtn: {
        paddingRight: 10,
    },
    carNum: {
        marginRight: 'auto',
        fontSize: 18,
        fontWeight: 'bold',
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
        marginVertical: 5,
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
        fontWeight: 'bold',
    },
    itemStatus: {
        width: '30%',
        fontSize: 12,
    },
    itemCount: {
        fontSize: 16,
        fontWeight: '900',
    },
});
