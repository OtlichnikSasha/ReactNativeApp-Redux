import React, {useEffect, useState} from 'react'
import {StyleSheet, Text, SafeAreaView, View} from 'react-native'
import {ScrollList} from "../../components/ScrollList";
import {StorageItem} from "../../components/StorageItem";
import {Empty} from "../../components/Empty";
import {useDispatch, useSelector} from 'react-redux'
import {clearPacks, fetchShipmentPacksForCellSearch, reloadShipmentPacksCellSearch} from '../../redux/slices/shipments/shipmentPacksForCellSearch'
import {FontAwesome5} from "@expo/vector-icons";
import {PlaceDamaged} from "../../components/PlaceDamaged";
import {useIsFocused} from "@react-navigation/native";

export const ShipmentCellInfo = ({navigation, route}) => {
    const cell = route.params.pack
    const storageCellID = cell.ID
    const limit = 30
    const dispatch = useDispatch()
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) loadPacksEffect()
    }, [isFocused])
    const {packs, loading, total} = useSelector(state => state.shipmentPacks)
    const onRefresh = React.useCallback(() => {
        loadPacksEffect()
    }, [])
    const [visible, setVisible] = useState(false)
    const [place, setPlace] = useState({})
    const openModalDamaged = (pack) => {
        if (!visible) {
            setVisible(true)
            setPlace(pack)
        }
    }
    const loadPacks = () => {
        if (loading || packs.length === total) return
        const offset = (packs.length / limit) * limit
        dispatch(fetchShipmentPacksForCellSearch({limit, offset, storageCellID}))
    }
    const clearPacksHandler = () => dispatch(clearPacks())
    const loadPacksEffect = () => dispatch(reloadShipmentPacksCellSearch({limit, storageCellID}))
    const onLoad = () => {
        clearPacksHandler()
        loadPacksEffect()
    }
    const returnBack = () => navigation.goBack()
    return (
        <>
            {isFocused ? <SafeAreaView style={styles.container}>
            <View style={styles.topPlace}>
                <FontAwesome5 name="arrow-left" size={16} onPress={returnBack}/>
                <Text style={styles.heading}>
                    Ячейка {cell.data}
                </Text>
            </View>
            <PlaceDamaged visible={visible} setVisible={setVisible} place={place} onLoad={onLoad}/>
            <ScrollList
                loading={loading}
                onScroll={loadPacks}
                onRefresh={onRefresh}>
                {packs.length
                    ? packs.map(pack => (
                        <StorageItem key={pack.ID} pack={pack} onPress={openModalDamaged}/>
                    ))
                    : <Empty visible={!loading}/>
                }
            </ScrollList>
        </SafeAreaView> : <></>}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 14,
        paddingRight: 5
    },
    topPlace: {
        flexDirection: "row",
        alignItems: "center"
    },
    heading: {
        fontWeight: "700",
        fontSize: 18,
        marginLeft: 15
    }
})