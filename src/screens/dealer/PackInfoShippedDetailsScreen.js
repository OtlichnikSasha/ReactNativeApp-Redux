import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Row, Table } from 'react-native-table-component';
import {fetchOrder} from "../../redux/slices/orderSlice";
import {fetchSubOrder} from "../../redux/slices/subOrderSlice";
import {useDispatch, useSelector} from "react-redux";

const PackInfoShippedDetailsScreen = ({ route, navigation }) => {
  const { pack} = route.params;
  const dispatch = useDispatch();

  const getPackData = useCallback(() => {
    if (pack.orderID) dispatch(fetchOrder({id: pack.orderID}))
    if (pack.subOrderID) dispatch(fetchSubOrder({id: pack.subOrderID}))
  }, [route])

  useEffect(() => {
    getPackData()
  }, [getPackData])

  const {order} = useSelector(state => state.order)
  const {subOrder} = useSelector(state => state.subOrder)

  const state = {
    tableHead: ['№ Модуля', 'Поз.', 'Детали упаковки', 'Кол-во', 'Штрих код'],
    widthArr: [1.2, 0.6, 4, 0.9, 1.3],
  }
  console.log('pack.details', pack.details);

  const detailsList = [];
  pack.details.forEach(
    ({ modulePosition, detailPosition, label, count, code }) => {
      detailsList.push([modulePosition, detailPosition, label, count, code]);
    }
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.subOrder}>Место {pack.code}</Text>
        </View>
        <Text style={styles.count}>{pack.details.length}</Text>
      </View>
      <View style={styles.subHeaderContainer}>
        <Text style={styles.order}>Заказ {order.number}</Text>
        <Text>Подзаказ {subOrder.name}</Text>
      </View>
      <View style={styles.table}>
        <Table borderStyle={{ borderWidth: 1, borderColor: '#9F9E9E' }}>
          <Row
            flexArr={state.widthArr}
            data={state.tableHead}
            style={styles.head}
            textStyle={styles.text}
          />
        </Table>
        <ScrollView>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#9F9E9E' }}>
            {detailsList.map((rowData, i) => (
              <Row
                key={i}
                data={rowData}
                flexArr={state.widthArr}
                textStyle={styles.text}
              />
            ))}
          </Table>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PackInfoShippedDetailsScreen;

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
  subHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 15,
    // marginVertical: 5,
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
    marginBottom: 120,
  },
  head: { height: 40, backgroundColor: '#F2F2F2' },
  text: { margin: 3, fontSize: 10, textAlign: 'center' },
});
