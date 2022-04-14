import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { ScrollList } from '../../components/ScrollList';
import {fetchDealerPacks, reloadDealerPacks} from '../../redux/slices/dealer/dealerPacksSlice';
import { Empty } from '../../components/Empty';

const PackInfoShippedScreen = ({ route, navigation }) => {
  const { order, subOrder } = route.params;
  const subOrderID = subOrder.ID;
  const dispatch = useDispatch();
  const limit = 30;
  useEffect(() => {
    loadPacksHandler();
  }, [subOrderID]);
  const { packs, loading, total } = useSelector((state) => state.dealerPacks);
  console.log('packs', packs)
  const onRefresh = useCallback(() => {
    loadPacksHandler();
  }, []);

  const loadPacks = () => {
    if(loading || packs.length === total) return;
    const offset = (packs.length / limit) * limit;
    dispatch(fetchDealerPacks({ limit, offset, subOrderID}));
  };
  const loadPacksHandler = () => dispatch(reloadDealerPacks({limit, subOrderID, withDetails: true}))

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
          <Text style={styles.subOrder}>{`Подзаказ ${subOrder.name}`}</Text>
        </View>
        <Text style={styles.count}>{total}</Text>
      </View>
      <ScrollList loading={loading} onScroll={loadPacks} onRefresh={onRefresh}>
        {packs.length ? (
          packs.map((pack) => (
            <TouchableOpacity
              key={pack.ID}
              style={styles.listItem}
              onPress={() =>
                navigation.navigate('PackInfoShippedDetails', {pack})
              }
            >
              <Text style={styles.itemTitle}>{`Место ${pack.code}`}</Text>
              <Text style={styles.itemCount}>{pack.details.length}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Empty visible={!loading} />
        )}
      </ScrollList>
    </SafeAreaView>
  );
};

export default PackInfoShippedScreen;

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
  itemStatus: {
    width: '30%',
    fontSize: 12,
  },
  itemCount: {
    fontSize: 16,
    fontWeight: '900',
  },
});
