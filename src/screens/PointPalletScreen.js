import React, {useEffect, useState} from 'react'
import {SafeAreaView, StyleSheet, View} from 'react-native'
import {AppButton} from '../components/AppButton'
import {useDispatch, useSelector} from 'react-redux'
import {
  fetchPointPalletPacks,
  reloadPointPalletPacks
} from '../redux/slices/pointsPalletsPacksSlice'
import {ScrollList} from '../components/ScrollList'
import {Empty} from '../components/Empty'
import {PointPalletItem} from "../components/PointPalletItem";
import {useIsFocused} from "@react-navigation/native";
import {PlaceDamagedAndInfo} from "../components/PlaceDamagedAndInfo";

export const PointPalletScreen = ({navigation}) => {
  const dispatch = useDispatch()
  const limit = 30
  const isFocused = useIsFocused();

  useEffect(() => {
    if(isFocused) loadPacksHandler()
  }, [isFocused])

  const {packs, loading, total} = useSelector(state => state.pointPalletPacks)

  const onRefresh = React.useCallback(() => {
    loadPacksHandler()
  }, [])

  const [place, setPlace] = useState({})
  const [visible, setVisible] = useState(false)
  const openModalDamaged = (pack) => {
    if (!visible) {
      setVisible(true)
      setPlace(pack)
    }
  }

  const loadPacks = () => {
    if (loading || packs.length === total) return
    const offset = (packs.length / limit) * limit
    loadPacksOffset(offset)
  }

  const openBarcodeScanner = () => navigation.navigate("LoadPlaceInCell")
  const loadAllInCell = () => navigation.navigate("LoadAllPlacesInCell", {packs})
  const loadPacksHandler = () => dispatch(reloadPointPalletPacks({limit}))
  const loadPacksOffset = (offset=0) => dispatch(fetchPointPalletPacks({limit, offset}))
  const onLoad = () => dispatch(reloadPointPalletPacks({}))
  const watchPlaceInfo = () => navigation.navigate("ShipmentPlaceInfo", {packID: place.ID})
  return (
    <SafeAreaView style={styles.container}>
      <PlaceDamagedAndInfo
          visible={visible}
          setVisible={setVisible}
          place={place}
          onPress={watchPlaceInfo}
          onLoad={onLoad}/>
      <ScrollList
        loading={loading}
        onScroll={loadPacks}
        onRefresh={onRefresh}
      >
        {packs.length
          ? packs.map(pack => (
            <PointPalletItem key={pack.ID} pack={pack} onPress={openModalDamaged}/>
          ))
          : <Empty visible={!loading}/>
        }
      </ScrollList>
      <View style={styles.buttonInner}>
        <AppButton
            style={styles.button}
            label="Выгрузить место в ячейку"
            onPress={openBarcodeScanner}
            disabled={packs.length === 0}
        />
        <AppButton
          style={styles.button}
          label="Выгрузить весь поддон в ячейку"
          mode="outlined"
          disabled={packs.length === 0}
          onPress={loadAllInCell}
        />
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    flex: 1
  },
  buttonInner: {
    marginVertical: 5,
    marginHorizontal: 10
  }
})