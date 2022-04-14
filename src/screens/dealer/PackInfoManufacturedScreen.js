import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, {useEffect, useCallback} from 'react';
import {Ionicons} from '@expo/vector-icons';
import {Row, Table} from 'react-native-table-component';
import {useSelector, useDispatch} from 'react-redux';
import {fetchDetails, reloadDetails} from '../../redux/slices/dealer/detailsSlice';
import {ScrollList} from '../../components/ScrollList';

const PackInfoManufacturedScreen = ({route, navigation}) => {
    const {order, subOrder} = route.params;
    console.log('order', order, subOrder)
    const subOrderID = subOrder.ID;
    const limit = 30;

    const dispatch = useDispatch();
    const state = {
        tableHead: ['№ Модуля', 'Поз.', 'Детали', 'Кол-во', 'Штрих код'],
        widthArr: [1.2, 0.6, 4, 0.9, 1.3],
    };
    useEffect(() => {
        loadDetailsHandler();
    }, [subOrderID]);

    const {details, loading, total} = useSelector((state) => state.details);
    const loadDetails = () => {
        if(details.length === total) return;
        const offset = (details.length / limit) * limit;
        dispatch(fetchDetails({limit, offset, subOrderID}));
    };
    const onRefresh = useCallback(() => {
        loadDetailsHandler()
    }, []);
    const loadDetailsHandler = () => dispatch(reloadDetails({limit, subOrderID}))
    const detailsList = [];
    details.forEach(({modulePosition, position, label, count, code}) => {
        detailsList.push([modulePosition, position, label, count, code]);
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        style={styles.backBtn}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="black"/>
                    </TouchableOpacity>
                    <Text style={styles.subOrder}>Подзаказ {subOrder.name}</Text>
                </View>
                <View style={styles.orderPlace}>
                    <Text style={styles.order}>Заказ {order.number || order}</Text>
                    <Text style={styles.count}>{total}</Text>
                </View>
            </View>
            <View style={styles.table}>
                <Table borderStyle={{borderWidth: 1, borderColor: '#9F9E9E'}}>
                    <Row
                        flexArr={state.widthArr}
                        data={state.tableHead}
                        style={styles.head}
                        textStyle={styles.text}
                    />
                </Table>
                <ScrollList
                    loading={loading}
                    onScroll={loadDetails}
                    onRefresh={onRefresh}
                >
                    <Table borderStyle={{borderWidth: 1, borderColor: '#9F9E9E'}}>
                        {detailsList.map((rowData, i) => (
                            <Row
                                key={i}
                                data={rowData}
                                flexArr={state.widthArr}
                                textStyle={styles.text}
                            />
                        ))}
                    </Table>
                </ScrollList>
            </View>
        </SafeAreaView>
    );
};

export default PackInfoManufacturedScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingBottom: 20
    },
    orderPlace: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        marginHorizontal: 15,
        marginVertical: 5,
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
        fontSize: 16,
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
    table: {
        marginHorizontal: 15,
        marginTop: 10,
        marginBottom: 90,
    },
    head: {height: 40, backgroundColor: '#F2F2F2'},
    text: {margin: 3, fontSize: 10, textAlign: 'center'},
});
