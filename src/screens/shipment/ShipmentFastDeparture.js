import React, {useEffect, useState} from 'react';
import {PlaceDamagedAndInfo} from "../../components/PlaceDamagedAndInfo";
import {View, SafeAreaView, StyleSheet, Text} from "react-native";
import {AppToast} from "../../components/AppToast";
import {useIsFocused} from "@react-navigation/native";
import {clearPacks, fetchShipmentPacks, reloadShipmentPacks} from "../../redux/slices/shipments/shipmentPacksSlice";
import {useDispatch, useSelector} from "react-redux";
import {Empty} from "../../components/Empty";
import {ScrollList} from "../../components/ScrollList";
import {ShipmentItem} from "../../components/ShipmentItem";
import {fetchTransitWarehouses} from "../../redux/slices/transitWarehousesSlice";

export const ShipmentFastDeparture = ({navigation, route}) => {
    const {departureID, warehouseID, sectionID} = route.params
    console.log('departureID, warehouseID, sectionID', departureID, warehouseID, sectionID)
    const [message, setMessage] = useState('До следующего отправления места оставлены на секторе')
    const [type, setType] = useState('success')
    const [visible, setVisible] = useState(false);
    const [isShow, setIsShow] = useState(true)
    const [pack, setPlace] = useState({})
    const [warehouse, setWarehouse] = useState('')
    const dispatch = useDispatch()
    const limit = 30
    const status = 'STAYED_ON_SECTOR'
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            loadPacksEffect()
            dispatch(fetchTransitWarehouses({limit: 'all'}))
            setTimeout(() => {
                setType("")
                setMessage("")
                setIsShow(false)
            }, 1500)
        }
    }, [isFocused])
    const {packs, total, loading} = useSelector(state => state.shipmentPacks)
    const loadPacksEffect = () => dispatch(reloadShipmentPacks({limit, sectionID, status}))
    const {warehouses} = useSelector(state => state.transitWarehousesSlice)
    useEffect(() => {
        if(warehouses.length) setWarehouse(getTransitWarehouse())
    } , [warehouses])
    console.log('warehouses', warehouses)
    const getTransitWarehouse = () => {
        return warehouses?.find(warehouse => warehouse.ID === warehouseID)
    }
    const clearPacksEffect = () => dispatch(clearPacks())
    const openModalDamaged = (pack) => {
        if (!visible) {
            setVisible(true)
            setPlace(pack)
        }
    }
    const onRefresh = React.useCallback(() => {
        clearPacksEffect()
        loadPacksEffect()
    }, [])
    const loadPacks = () => {
        if (loading || packs.length === total) return
        const offset = (packs.length / limit) * limit
        dispatch(fetchShipmentPacks({limit, offset, sectionID, status}))
    }
    const watchPlaceInfo = () => navigation.navigate("ShipmentPlaceInfo", {packID: pack.ID})
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
                    {
                        departureID ?
                            <View>
                                <Text style={styles.heading}>
                                    Отправление {departureID}
                                </Text>
                            </View>
                            :
                            <></>

                    }
                    {
                        warehouse ?
                            <View>
                                <Text style={styles.subHeading}>
                                    Транзитный склад {warehouse.name}
                                </Text>
                            </View>
                            :
                            <></>
                    }
                    <View style={styles.header}>
                        <AppToast isShow={isShow} label={message} type={type}/>
                    </View>
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
                </SafeAreaView>
                :
                <></>}
        </>
    );
};
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        width: "100%",
        justifyContent: "flex-end",
        paddingRight: 10
    },
    container: {
        flex: 1,
        padding: 10
    },
    header: {
        flex: 1,
        position: "absolute",
        top: 10,
        width: "100%"
    },
    heading: {
        fontWeight: "bold",
        fontSize: 20,
        paddingLeft: 10
    },
    subHeading: {
        paddingLeft: 10,
        fontSize: 16
    }
})
