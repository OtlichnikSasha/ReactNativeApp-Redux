import React, {useCallback, useEffect, useState} from 'react';
import {AppButton} from "../../components/AppButton";
import {ScrollList} from "../../components/ScrollList";
import {useIsFocused} from "@react-navigation/native";
import {SafeAreaView, StyleSheet} from "react-native";
import {clearPacks, fetchShipmentPacks, reloadShipmentPacks} from "../../redux/slices/shipments/shipmentPacksSlice";
import {useDispatch, useSelector} from "react-redux";
import {PlaceDamagedAndInfo} from '../../components/PlaceDamagedAndInfo'
import {ShipmentItem} from "../../components/ShipmentItem";
import {Empty} from "../../components/Empty";
import {reloadShipmentPalletPacks} from "../../redux/slices/shipments/shipmentPalletPacks";
import {reloadPartialPacks} from "../../redux/slices/shipments/partialDeliveryPacks";
export const ShipmentRemainingSector = ({navigation, route}) => {
    const {sectionID, departureID, packIDs} = route.params
    const isFocused = useIsFocused();
    const dispatch = useDispatch()
    const limit = 30
    const status = 'STAYED_ON_SECTOR'
    const [visible, setVisible] = useState(false);
    const [pack, setPlace] = useState({})
    const watchPlaceInfo = () => navigation.navigate("ShipmentPlaceInfo", {packID: pack.ID})

    const loadPacksEffect = useCallback(async () => {
        let id = ''
        if (packIDs.length) {
            packIDs.map(pack => {
                id += `&id=${pack}`
            })
            let args = `sectionID=${sectionID}&status=${status}&isDefect=false${id}`
            await dispatch(reloadPartialPacks({args}))
        }
        if (!packIDs.length) return navigation.navigate("ShipmentSectorScreen")
    }, [route])


    useEffect(() => {
        loadPacksEffect()
    }, [loadPacksEffect])


    useEffect(() => {
        if (isFocused) {
            loadPacksEffect()
            dispatch(reloadShipmentPalletPacks({limit: 1, sectionID}))
        }
    }, [isFocused])
    const {packs, total, loading} = useSelector(state => state.shipmentPartialPacksSlice)
    const palletTotal = useSelector(state => state.shipmentPalletPacks.total)
    const backToCar = () => navigation.navigate("ShipmentSectorScreen")
    const loadPlaceInPallet = () => navigation.navigate("ShipmentLoadPallet", {sectionID, departureID})
    const clearPacksEffect = () => dispatch(clearPacks())
    const onRefresh = React.useCallback(() => {
        clearPacksEffect()
        loadPacksEffect()
    }, [])
    const loadPacks = () => {
        if (loading || packs.length === total) return
        const offset = (packs.length / limit) * limit
        dispatch(fetchShipmentPacks({limit, offset, sectionID, status}))
    }
    const openModalDamaged = (pack) => {
        if (!visible) {
            setVisible(true)
            setPlace(pack)
        }
    }
    const onLoad = () => {
        const arrID = packIDs.indexOf(pack.ID)
        packIDs.splice(arrID, 1)
        loadPacksEffect()
    }
    return (
        <>
            {isFocused ?
                <SafeAreaView style={styles.container}>
                    <PlaceDamagedAndInfo
                        visible={visible}
                        setVisible={setVisible}
                        place={pack}
                        onPress={watchPlaceInfo}
                        onLoad={onLoad}/>
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
                    <AppButton label="Загрузить место на поддон" onPress={loadPlaceInPallet}/>
                    <AppButton label="Вернуться к отгрузке машины" style={styles.backBtn}
                               onPress={backToCar} disabled={total + palletTotal}/>
                </SafeAreaView>
                :
                null}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    backBtn: {
        backgroundColor: "#AAAAAA",
        marginTop: 5
    }
})
