import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from "react-native";
import {PlaceDamagedAndInfo} from "../../components/PlaceDamagedAndInfo";
import {ScrollList} from "../../components/ScrollList";
import {Empty} from "../../components/Empty";
import {AppButton} from "../../components/AppButton";
import {useIsFocused} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {AppToast} from "../../components/AppToast";
import {NeedShipItem} from "../../components/NeedShipItem";
import {fetchReturnToStore, clearReturnToStoreData} from "../../redux/slices/shipments/subordersReturnToStore";
import {reloadPartialPacks} from "../../redux/slices/shipments/partialDeliveryPacks";

export const ShipmentNeedShipPlaces = ({navigation, route}) => {
    const {sectionID, departureID, packIDs} = route.params
    const dispatch = useDispatch()
    const status = 'STAYED_ON_SECTOR'
    const isFocused = useIsFocused();
    const [message, setMessage] = useState('Машина успешно отправлена')
    const [type, setType] = useState('success')
    const [visible, setVisible] = useState(false);
    const [isShow, setIsShow] = useState(true)
    const [pack, setPlace] = useState({})
    const [warehouseID, setWarehouseID] = useState(0)

    const loadPacksEffect = useCallback(async () => {
        dispatch(clearReturnToStoreData())
        let id = ''
        if (packIDs.length) {
            packIDs.map(pack => {
                id += `&id=${pack}`
            })
            let args = `sectionID=${sectionID}&status=${status}&isDefect=false${id}`
            await dispatch(reloadPartialPacks({args}))
        }
        if (!packIDs.length) return navigation.navigate("ShipmentSectorScreen")
        return setTimeout(() => {
            setIsShow(false)
        }, 1500)
    }, [route])


    useEffect(async () => {
        await loadPacksEffect()
    }, [loadPacksEffect])

    const openModalDamaged = (pack) => {
        if (!visible) {
            setVisible(true)
            setPlace(pack)
        }
    }
    const {section} = useSelector(state => state.sectionSlice)
    console.log('section', section)
    const {result, error} = useSelector(state => state.subordersReturnToStore)
    const {packs, total, loading} = useSelector(state => state.shipmentPartialPacksSlice)
    useEffect(() => {
        if (packs.length) return setWarehouseID(packs[0].transitWarehouseID)
    }, [packs])


    const getResult = useCallback(() => {
        if (error) {
            setIsShow(true)
            setMessage(error)
            setType("error")
            return dispatch(clearReturnToStoreData())
        }
        if (result && section) {
            dispatch(clearReturnToStoreData())
            return navigation.navigate("ShipmentRemainingStack", {section, departureID, packIDs})
        }
    }, [result])
    useEffect(() => {
        getResult()
    }, [getResult])

    const watchPlaceInfo = () => navigation.navigate("ShipmentPlaceInfo", {packID: pack.ID})
    const onRefresh = React.useCallback(async () => {
        await loadPacksEffect()
    }, [])

    const packOnPallet = () => {
        const subOrderIDs = []
        packs.map(pack => {
            if (packs.indexOf(pack.subOrderID) === -1) subOrderIDs.push(pack.subOrderID)
        })
        dispatch(fetchReturnToStore({subOrderIDs}))
    }
    const fastDeparture = () => navigation.navigate("ShipmentSectorScreen")
    const onLoad = async () => {
        const arrID = packIDs.indexOf(pack.ID)
        packIDs.splice(arrID, 1)
        await loadPacksEffect()
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
                    <View style={styles.header}>
                        <AppToast isShow={isShow} label={message} type={type}/>
                    </View>
                    {section ?
                        <View>
                            <Text style={styles.sectionData}>
                                {section.name} ({total})
                            </Text>
                        </View>
                        :
                        <></>
                    }
                    <ScrollList
                        loading={loading}
                        onRefresh={onRefresh}>
                        {packs.length
                            ? packs.map(pack => (
                                <NeedShipItem key={pack.ID} pack={pack} onPress={openModalDamaged}/>
                            ))
                            : <Empty visible={!loading}/>
                        }

                    </ScrollList>
                    {!loading &&
                        <View style={styles.wrapper}>
                            <AppButton
                                label="Оставить места на секторе для быстрого отправления"
                                onPress={fastDeparture}
                            />
                            <AppButton
                                label="Отправить оставшиеся места на склад"
                                onPress={packOnPallet}
                                mode="outlined"
                            />
                        </View>
                    }
                </SafeAreaView> :
                <></>}
        </>
    )
}
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        width: "100%",
        justifyContent: "flex-end",
        paddingRight: 10
    },
    container: {
        flex: 1,
        paddingVertical: 10,
        paddingLeft: 15,
        paddingRight: 5
    },
    header: {
        flex: 1,
        position: "absolute",
        top: 10,
        width: "100%"
    },
    sectionData: {
        fontWeight: "bold",
        fontSize: 20
    }
});
