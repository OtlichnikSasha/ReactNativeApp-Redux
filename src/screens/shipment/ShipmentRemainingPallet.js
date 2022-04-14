import React, {useEffect, useState} from 'react';
import {AppButton} from "../../components/AppButton";
import {PlaceDamagedAndInfo} from "../../components/PlaceDamagedAndInfo";
import {useIsFocused} from "@react-navigation/native";
import {SafeAreaView, StyleSheet} from "react-native";
import {ScrollList} from "../../components/ScrollList";
import {ShipmentItem} from "../../components/ShipmentItem";
import {Empty} from "../../components/Empty";
import {clearPacks} from "../../redux/slices/shipments/shipmentPacksSlice";
import {useDispatch, useSelector} from "react-redux";
import {fetchShipmentPalletPacks, reloadShipmentPalletPacks} from "../../redux/slices/shipments/shipmentPalletPacks";
export const ShipmentRemainingPallet = ({navigation, route}) => {
    const isFocused = useIsFocused();
    const {sectionID} = route.params
    const dispatch = useDispatch()
    const limit = 30
    const [visible, setVisible] = useState(false);
    const [pack, setPlace] = useState({})
    const watchPlaceInfo = () => navigation.navigate("ShipmentPlaceInfo", {packID: pack.ID})
    useEffect(() => {
        if (isFocused) loadPacksEffect()
    }, [isFocused])
    const {packs, total, loading} = useSelector(state => state.shipmentPalletPacks)
    const sectorTotal = useSelector(state => state.shipmentPacks.total)
    const loadPacksEffect = () => dispatch(reloadShipmentPalletPacks({limit, sectionID}))
    const clearPacksEffect = () => dispatch(clearPacks())
    const onRefresh = React.useCallback(() => {
        clearPacksEffect()
        loadPacksEffect()
    }, [])
    const loadPacks = () => {
        if (loading || packs.length === total) return
        const offset = (packs.length / limit) * limit
        dispatch(fetchShipmentPalletPacks({limit, offset, sectionID}))
    }
    const openModalDamaged = (pack) => {
        if (!visible) {
            setVisible(true)
            setPlace(pack)
        }
    }
    const loadPlacesInCell = () => navigation.navigate("ShipmentLoadPlacesInCell")
    const loadAllPlaces = () => navigation.navigate("ShipmentAllLoadAllPlacesInCell", {sectionID})
    const backToCar = () => navigation.navigate("ShipmentSectorScreen")
    return (
        <>
            {isFocused ?
                <SafeAreaView style={styles.container}>
                    <PlaceDamagedAndInfo
                        visible={visible}
                        setVisible={setVisible}
                        place={pack}
                        onPress={watchPlaceInfo}
                        onLoad={loadPacksEffect}/>
                    <ScrollList
                        loading={loading}
                        onScroll={loadPacks}
                        onRefresh={onRefresh}>
                        {packs.length
                            ? packs.map(pack => (
                                <ShipmentItem key={pack.ID} pack={pack} onPress={openModalDamaged}/>
                            ))
                            : <Empty visible={!loading}/>
                        }

                    </ScrollList>
                    <AppButton label="Выгрузить место в ячейку" onPress={loadPlacesInCell} disabled={!packs.length}/>
                    <AppButton label="Выгрузить весь поддон в ячейку" style={styles.middleBtn} onPress={loadAllPlaces}
                               disabled={!packs.length}/>
                    <AppButton label="Вернуться к отгрузке машины" style={styles.backBtn} onPress={backToCar}
                               disabled={total + sectorTotal}/>
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
        padding: 10
    },
    middleBtn: {
        backgroundColor: "#ADD7FF",
        marginVertical: 5,
        color: "#596D80"
    },
    backBtn: {
        backgroundColor: "#AAAAAA",
        marginTop: 5
    }
})