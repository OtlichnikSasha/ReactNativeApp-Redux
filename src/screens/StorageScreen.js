import React, {useEffect, useState} from 'react'
import {SafeAreaView, StyleSheet, View, Text} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import {fetchSectorPacks, reloadSectorPacks, clearSectorPacks, totalSectorPacks} from '../redux/slices/sectorPackSlice'
import {ScrollList} from '../components/ScrollList'
import {Empty} from '../components/Empty'
import {AppButton} from "../components/AppButton";
import {StorageItem} from '../components/StorageItem'
import {PlaceDamaged} from "../components/PlaceDamaged";
import {useIsFocused} from "@react-navigation/native";
import moment from "moment";
import {PlaceDamagedAndInfo} from "../components/PlaceDamagedAndInfo";
import {totalSectorPalletPacks} from "../redux/slices/sectorPalletsPacksSlice";
import {fetchPacksCount} from "../redux/slices/packsCountSlice";

export const StorageScreen = ({navigation, route}) => {
    const {departure} = route.params
    const limit = 30
    const dispatch = useDispatch()
    const [visible, setVisible] = useState(false)
    const [place, setPlace] = useState({})
    const isFocused = useIsFocused();
    const [section, setSection] = useState('')
    const sections = useSelector(state => state.sections.sections)
    useEffect(() => {
        const section = getSection()
        if(section) setSection(section.name)
    }, [route])
    const getSection = () => sections?.find(section => section.ID === departure?.sectionID)
    useEffect(() => {
        if (isFocused) {
            clearPacks()
            loadPacksHandler()
        }
    }, [isFocused])

    const openModalDamaged = (pack) => {
        if (!visible) {
            setVisible(true)
            setPlace(pack)
        }
    }
    const {packs, loading, total} = useSelector(state => state.sectorPacks)
    const onRefresh = React.useCallback(() => {
        loadPacksHandler()
    }, [])

    const loadPacks = () => {
        if (loading || packs.length === total) return
        const offset = (packs.length / limit) * limit
        loadPacksWithOffset(offset)
    }
    const loadPacksHandler = () => {
        const args = `haveDeparture=true&isDefect=false&status=STAYED_ON_SECTOR&status=ON_STORE&limit=${limit}&departureID=${departure.ID}`
        dispatch(reloadSectorPacks({args}))
    }
    const clearPacks = () => dispatch(clearSectorPacks())
    const loadPacksWithOffset = (offset=0) => {
        const args = `haveDeparture=true&isDefect=false&status=STAYED_ON_SECTOR&status=ON_STORE&limit=${limit}&departureID=${departure.ID}&offset=${offset}`
        dispatch(fetchSectorPacks({args}))
    }
    const openBarcodeScanner = () => navigation.navigate("LoadSectorPallet", {departureID: departure.ID})
    const onLoad = () => {
        clearPacks()
        loadPacksHandler()
        dispatch(fetchPacksCount({}))
    }
    const watchPlaceInfo = () => navigation.navigate("ShipmentPlaceInfo", {packID: place.ID})
    return (
        <SafeAreaView style={styles.container}>
            <PlaceDamagedAndInfo
                visible={visible}
                setVisible={setVisible}
                place={place}
                onPress={watchPlaceInfo}
                onLoad={onLoad}/>
            {departure ?
                <View style={styles.topData}>
                    <Text style={styles.heading}>
                        {`Отгрузка ${moment(departure.createdAt).format('DD.MM.YYYY')}`}
                    </Text>
                    <Text style={styles.subHeading}>
                        {section}
                    </Text>
                </View>
                :
                null
            }
            <ScrollList loading={loading} onScroll={loadPacks} onRefresh={onRefresh}>
                {packs.length
                    ? packs.map(pack => (
                        <StorageItem key={pack.ID} pack={pack} onPress={openModalDamaged}/>
                    ))
                    : <Empty visible={!loading}/>
                }
            </ScrollList>
            <View style={styles.buttonInner}>
                <AppButton
                    label="Загрузить место на поддон"
                    onPress={openBarcodeScanner}
                    disabled={packs.length === 0}/>
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    buttonInner: {
        marginVertical: 5,
        marginHorizontal: 10
    },
    topData: {
        flexDirection: "row",
        alignItems: "center",
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