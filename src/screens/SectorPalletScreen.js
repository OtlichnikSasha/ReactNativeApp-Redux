import React, {useEffect, useState, useCallback} from 'react'
import {SafeAreaView, StyleSheet, Text, View} from 'react-native'
import {AppButton} from '../components/AppButton'
import {useDispatch, useSelector} from 'react-redux'
import {
    fetchSectorPalletPacks,
    reloadSectorPalletPacks,
    clearSectorPalletPacks,
} from '../redux/slices/sectorPalletsPacksSlice'
import {ScrollList} from '../components/ScrollList'
import {Empty} from '../components/Empty'
import {fetchPackToSector, clearSectorPack} from '../redux/slices/packToSector';
import {useIsFocused} from '@react-navigation/native';
import {SectorPalletItem} from "../components/SectorPalletItem";
import {AppToast} from "../components/AppToast";
import {PlaceDamagedAndInfo} from "../components/PlaceDamagedAndInfo";
import {fetchPacksCount} from "../redux/slices/packsCountSlice";
import moment from "moment";
import {fetchSection} from "../redux/slices/sections/sectionSlice";
import {fetchDeparture, clearDeparture} from "../redux/slices/departureSlice";

export const SectorPalletScreen = ({navigation, route}) => {
    const {departure} = route.params
    const [message, setMessage] = useState('')
    const [type, setType] = useState('')
    const [isShow, setIsShow] = useState(false)
    const [visible, setVisible] = useState(false);
    const [place, setPlace] = useState({})
    const [disActive, setDisActive] = useState(false)
    const [sectionID, setSectionID] = useState(0)
    const [departurePattern, setDepartureData] = useState(null)
    const dispatch = useDispatch()
    const isFocused = useIsFocused();
    let limit = 30
    useEffect(() => {
        if (isFocused) {
            dispatch(clearSectorPalletPacks())
            dispatch(clearDeparture())
            setDisActive(false)
            loadPacksEffect()
            dispatch(clearSectorPack())
        }
    }, [isFocused])

    const {packs, loading, total} = useSelector(state => state.sectorPalletPacks)
    const {status, error} = useSelector(state => state.packToSector)
    const {section} = useSelector(state => state.sectionSlice)
    const departureData = useSelector(state => state.departure.departure)
    console.log('section', section)
    const getSection = useCallback(() => {
        if (packs.length) {
            console.log('getSection', packs)
            setSectionID(packs[0].sectionID)
            dispatch(fetchSection({id: packs[0].sectionID}))
            dispatch(fetchDeparture({id: packs[0].departureID}))
        }
        else{
            dispatch(fetchSection({id: departure.sectionID}))
            setDepartureData(departure)
        }
        if (!sectionID) return setDisActive(true)
        packs.map(pack => {
            if (pack.ID !== sectionID) return setDisActive(true)
        })
        return setDisActive(false)
    }, [packs])


    useEffect(() => {
        getSection()
    }, [getSection])


    const getDeparture = useCallback(() => {
        if(departureData) setDepartureData(departureData)
    }, [departureData])

    useEffect(() => {
        getDeparture()
    }, [getDeparture])

    useEffect(() => {
        if(error){
            setMessage(error)
            setType('error')
            setIsShow(true)
            return setTimeout(() => {
                setIsShow(false)
            }, 4000)
        }
        if(status && sectionID){
            setMessage(`Места успешно выгружены в ${section.name}`)
            setType('success')
            setIsShow(true)
            setDisActive(true)
            loadPacksEffect()
            dispatch(fetchPacksCount({}))
            return setTimeout(() => {
                setIsShow(false)
            }, 2500)
        }
    }, [status])
    const openModalDamaged = (pack) => {
        if (!visible) {
            setVisible(true)
            setPlace(pack)
        }
    }
    const onRefresh = React.useCallback(() => {
        loadPacksEffect()
    }, [])

    const loadPacks = () => {
        if (loading || packs.length === total) return
        const offset = (packs.length / limit) * limit
        loadPacksEffectOffset(offset)
    }
    const loadPacksEffect = () => dispatch(reloadSectorPalletPacks({limit, departureID: departure.ID}))
    const loadPacksEffectOffset = (offset = 0) => dispatch(fetchSectorPalletPacks({limit, offset, departureID: departure.ID}))
    const openBarcodeScanner = () => navigation.navigate('LoadPlaceInSector')
    const onLoad = () => {
        dispatch(clearSectorPalletPacks())
        loadPacksEffect()
        dispatch(fetchPacksCount({}))
    }
    const loadAllInSector = async () => {
        if (packs.length < total) {
            limit = 'all'
            await loadPacksEffect()
        }
        let packIDs = []
        packs.map((pack => packIDs.push(pack.ID)))
        await sendPlaceInSector(packIDs)
    }
    const sendPlaceInSector = (packIDs) => dispatch(fetchPackToSector({packIDs}))
    const watchPlaceInfo = () => navigation.navigate("ShipmentPlaceInfo", {packID: place.ID})
    return (
        <SafeAreaView style={styles.container}>
            <PlaceDamagedAndInfo
                visible={visible}
                setVisible={setVisible}
                place={place}
                onPress={watchPlaceInfo}
                onLoad={onLoad}/>
            <View style={styles.header}>
                <AppToast isShow={isShow} label={message} type={type}/>
            </View>
            {departurePattern && section ?
                <View style={styles.topData}>
                    <Text style={styles.heading}>
                        {`Отгрузка ${moment(departurePattern.createdAt).format('DD.MM.YYYY')}`}
                    </Text>
                    <Text style={styles.subHeading}>
                        {section.name}
                    </Text>
                </View>
                :
                null
            }
            <ScrollList
                loading={loading}
                onScroll={loadPacks}
                onRefresh={onRefresh}
            >
                {packs.length
                    ? packs.map(pack => (
                        <SectorPalletItem key={pack.ID} pack={pack} onPress={openModalDamaged}/>
                    ))
                    : <Empty visible={!loading}/>
                }
            </ScrollList>
            <View style={styles.buttonInner}>
                <AppButton
                    style={styles.button}
                    label="Выгрузить место в сектор"
                    onPress={openBarcodeScanner}
                    disabled={!packs.length}/>
                <AppButton
                    label="Выгрузить весь поддон в сектор"
                    mode="outlined"
                    onPress={loadAllInSector}
                    disabled={disActive || !packs.length}/>
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
    header: {
        flex: 1,
        position: "absolute",
        top: 10,
        width: "100%"
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