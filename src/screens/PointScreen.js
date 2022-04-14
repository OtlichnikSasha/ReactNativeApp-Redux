import React, { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { PointItem } from '../components/PointItem'
import { fetchPointPacks, reloadPointPacks } from '../redux/slices/pointPacksSlice'
import { ScrollList } from '../components/ScrollList'
import { Empty } from '../components/Empty'
import { AppButton } from '../components/AppButton';
import { useIsFocused } from '@react-navigation/native';
import {reloadPreparedPallets, fetchPreparedPallets, totalPreparedPallets} from "../redux/slices/preparedPalletsSlice";
import {PalletItem} from "../components/PalletItem";
import {fetchPoints} from "../redux/slices/pointsSlice";
import {PlaceDamagedAndInfo} from "../components/PlaceDamagedAndInfo";

export const PointScreen = ({ navigation }) => {
	const limit = 30
	const status = 'CREATED'
	const dispatch = useDispatch()
	const isFocused = useIsFocused();
	useEffect(() => {
		if (isFocused) {
			loadPalletsEffect()
			loadPacksEffect()
			dispatch(fetchPoints({}))
			dispatch(totalPreparedPallets({}))
		}
	}, [isFocused])
	const [visible, setVisible] = useState(false)
	const [place, setPlace] = useState({})
	const {pallets} = useSelector(state => state.preparedPalletsSlice)
	console.log('pallets', pallets)
	const points = useSelector(state => state.points.points)
	const {packs, loading, total} = useSelector(state => state.pointPacks)
	const openModalDamaged = (pack) => {
		if (!visible) {
			setVisible(true)
			setPlace(pack)
		}
	}
	const openPallet = (pallet) => navigation.navigate("PalletScreen", {palletID: pallet.ID})
	const onRefresh = React.useCallback(() => {
		loadPacksEffect()
		loadPalletsEffect()
        dispatch(totalPreparedPallets({}))
	}, [])

	const loadPacks = () => {
		if (!loading && packs.length !== total){
			const offset = (packs.length / limit) * limit
			dispatch(fetchPointPacks({ limit, offset }))
		}
	}
	const openBarcodeScanner = () => navigation.navigate('LoadPlacesInPallet')
	const loadPacksEffect = () => dispatch(reloadPointPacks({ limit, status }))
	const loadPalletsEffect = () => dispatch(reloadPreparedPallets({}))
	const onLoad = () => dispatch(reloadPointPacks({}))
	const watchPlaceInfo = () => navigation.navigate("ShipmentPlaceInfo", {packID: place.ID})
	return (
		<SafeAreaView style={styles.container}>
			<PlaceDamagedAndInfo
				visible={visible}
				setVisible={setVisible}
				place={place}
				onPress={watchPlaceInfo}
				onLoad={onLoad}/>
			<ScrollList loading={loading} onScroll={loadPacks} onRefresh={onRefresh}>
				{!packs.length && !pallets.length ? <Empty visible={!loading}/> : null}
				{pallets.length && points.length
					? pallets.map(pallet => (
						<PalletItem key={pallet.ID} pallet={pallet} onPress={openPallet}/>
					))
					: null
				}
				{packs.length && points.length
					? packs.map(pack => (
						<PointItem key={pack.ID} pack={pack} onPress={openModalDamaged}/>
					))
					: null
				}
			</ScrollList>
			<View style={styles.buttonInner}>
				<AppButton
					label="Загрузить место на поддон"
					onPress={openBarcodeScanner}
					disabled={!packs.length && !pallets.length}/>
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