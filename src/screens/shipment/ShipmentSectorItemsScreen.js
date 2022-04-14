import React, {useCallback, useEffect, useState, useLayoutEffect} from 'react'
import {Dimensions, SafeAreaView, StyleSheet, View, Text} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import {ScrollList} from '../../components/ScrollList'
import {ShipmentScanForCar} from './ShipmentScanForCar'
import {Empty} from '../../components/Empty'
import {AppButton} from "../../components/AppButton";
import {ShipmentItem} from "../../components/ShipmentItem";
import {PlaceDamagedAndInfo} from "../../components/PlaceDamagedAndInfo";
import {useIsFocused} from "@react-navigation/native";
import moment from 'moment';
import {
    reloadShipmentSectorPacks,
    clearSectorPacks,
    fetchShipmentSectorPacks
} from "../../redux/slices/shipments/shipmentSectorSlice";
import {fetchSections} from "../../redux/slices/sections/sectionsSlice";
import {clearSection, fetchSection} from "../../redux/slices/sections/sectionSlice";

export const ShipmentSectorItemsScreen = ({navigation, route}) => {
    const limit = 30
    const {warehouses} = useSelector(state => state.transitWarehousesSlice)
    const {sectionID} = route.params
    const [departure, setDeparture] = useState(null)
    let status = ""
    if (route.params.hasOwnProperty("status")) {
        status = route.params.status
    }
    const isFocused = useIsFocused();
    const dispatch = useDispatch()

    const getSection = useCallback(() => {
        dispatch(clearSectorPacks())
        setDeparture(null)
        dispatch(fetchSections({}))
        dispatch(fetchSection({id: sectionID}))
    }, [route])

    useEffect(() => {
        getSection()
    }, [getSection])

    const {section} = useSelector(state => state.sectionSlice)

    const loadPacksEffect = useCallback((async () => {
        setDeparture(section.departure)
        let args = `isDefect=false&status=ON_SECTOR&status=DELIVERY&limit=${limit}&sectionID=${sectionID}&departureID=${section.departure.ID}`
        if (section.departure && section.departure.status !== "ON_SECTOR") {
            args = `isDefect=false&status=ON_SECTOR&limit=${limit}&sectionID=${sectionID}&withDetails=true&departureID=${section.departure.ID}`
        }
        if (section.departure && section.departure.status === 'ON_SECTOR' && status) {
            args = `isDefect=false&status=${status}&limit=${limit}&sectionID=${sectionID}&departureID=${section.departure.ID}`
        }
        await dispatch(reloadShipmentSectorPacks({args}))
    }), [section])


    useEffect(async () => {
        if (section && !loading && !departure && section.ID === sectionID) {
            await loadPacksEffect()
        }
    }, [loadPacksEffect])


    const [visible, setVisible] = useState(false)
    const [pack, setPlace] = useState({})
    const openModalDamaged = (pack) => {
        if (!visible) {
            setVisible(true)
            setPlace(pack)
        }
    }

    const loadPacksRequest = useCallback(async (offset) => {
        if (departure) {
            let args = `isDefect=false&status=ON_SECTOR&status=DELIVERY&limit=${limit}&sectionID=${sectionID}&departureID=${section.departure.ID}&offset=${offset}`
            if (section.departure && section.departure.status !== "ON_SECTOR") {
                args = `isDefect=false&status=ON_SECTOR&limit=${limit}&sectionID=${sectionID}&withDetails=true&departureID=${section.departure.ID}&offset=${offset}`
            }
            if (section.departure && section.departure.status === 'ON_SECTOR' && status) {
                args = `isDefect=false&status=${status}&limit=${limit}&sectionID=${sectionID}&departureID=${section.departure.ID}&offset=${offset}`
            }
            await dispatch(fetchShipmentSectorPacks({args}))
        }
    }, [])

    const onRefresh = useCallback(async () => {
        dispatch(fetchSections({}))
        dispatch(clearSection())
        dispatch(clearSectorPacks())
        setDeparture(null)
        await dispatch(fetchSection({id: sectionID}))
    }, [])
    const loadPacks = useCallback(() => {
        if (loading || packs.length === total) return
        const offset = (packs.length / limit) * limit
        loadPacksRequest(offset)
    }, [])
    const getTransitWarehouse = (transitWarehouseID) => {
        return warehouses?.find(warehouse => warehouse.ID === transitWarehouseID)?.name
    }
    const watchPlaceInfo = () => navigation.navigate("ShipmentPlaceInfo", {packID: pack.ID})
    const scanToCar = () => navigation.navigate("ShipmentScanForCar", {sectionID: section.ID})
    const onLoad = useCallback(async () => {
        setDeparture(null)
        dispatch(fetchSections({}))
        dispatch(fetchSection({id: sectionID}))
    }, [])

    const {packs, loading, total} = useSelector(state => state.shipmentSector)
    const navigateBack = () => navigation.goBack()
    return (
        <>
            {isFocused && section ?
                <SafeAreaView style={styles.container}>
                    <PlaceDamagedAndInfo
                        visible={visible}
                        setVisible={setVisible}
                        place={pack}
                        onPress={watchPlaceInfo}
                        onLoad={onLoad}/>
                    {
                        section.departure && section.departure.ID ?
                            <Text style={styles.heading}>
                                Отгрузка {moment(section.departure.createdAt).format('DD.MM.YYYY')}
                            </Text>
                            :
                            <Text style={styles.heading}>
                                Не создано отправление
                            </Text>
                    }
                    {
                        section.departure && section.departure.transitWarehouseID ?
                            <Text style={styles.subHeading}>
                                Транзитный склад {getTransitWarehouse(section.departure.transitWarehouseID)}
                            </Text>
                            :
                            <></>
                    }
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
                    {!loading &&
                        <View style={styles.wrapper}>
                            <AppButton
                                label="Сканирование мест для погрузки"
                                onPress={scanToCar}
                                disabled={!packs.length}
                            />
                            {status ?
                                <AppButton
                                    label="Назад"
                                    onPress={navigateBack}
                                    style={{marginTop: 5}}
                                />
                                :
                                <></>
                            }
                        </View>
                    }

                </SafeAreaView> :
                <></>}
        </>
    )
}
const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
        justifyContent: "flex-end",
    },
    container: {
        flex: 1,
        height: Dimensions.get('window').height / 2,
        padding: 10
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