import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native'
import {Ionicons} from "@expo/vector-icons";
import {
    reloadPreparedPalletPacks,
    fetchPreparedPalletPacks,
    clearPreparedPalletPacks
} from "../redux/slices/preparedPalletPlaces";
import {useIsFocused} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {ScrollList} from "../components/ScrollList";
import {PointPalletItem} from "../components/PointPalletItem";
import {Empty} from "../components/Empty";
import {reloadPreparedPallets, totalPreparedPallets, clearTotal} from "../redux/slices/preparedPalletsSlice";
import {PlaceDamagedAndInfo} from "../components/PlaceDamagedAndInfo";

export const PalletScreen = ({route, navigation}) => {
    const {palletID} = route.params
    const [place, setPlace] = useState({})
    const [visible, setVisible] = useState(false)
    const limit = 30
    const isFocused = useIsFocused();
    const dispatch = useDispatch()
    useEffect(async () => {
        if (isFocused) {
            loadPallet()
            loadPacksEffect()
        }
    }, [isFocused])
    const {packs, total, loading} = useSelector(state => state.preparedPalletPlaces)
    const {pallets} = useSelector(state => state.preparedPalletsSlice)
    const loadPallet = () => dispatch(reloadPreparedPallets({id: palletID}))
    const loadPacksEffect = () => {
        loadPallet()
        dispatch(reloadPreparedPalletPacks({preparedPalletID: palletID, limit}))
    }
    const loadPacksFetch = (offset) => dispatch(fetchPreparedPalletPacks({offset, preparedPalletID: palletID, limit}))
    const openModalDamaged = (pack) => {
        if (!visible) {
            setVisible(true)
            setPlace(pack)
        }
    }
    const loadPacks = () => {
        if (loading || packs.length === total) return
        const offset = (packs.length / limit) * limit
        loadPacksFetch(offset)
    }
    const onRefresh = React.useCallback(() => {
        dispatch(clearPreparedPalletPacks())
        loadPacksEffect()
    }, [])
    const watchPlaceInfo = () => navigation.navigate("ShipmentPlaceInfo", {packID: place.ID})
    const onLoad = () => {
        loadPacksEffect()
        loadPallet()
        dispatch(clearTotal())
        dispatch(totalPreparedPallets({}))
    }

    useEffect(() => {
        if(!pallets.length && !loading) return navigation.goBack()
    }, [pallets])
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="black"/>
                </TouchableOpacity>
                {
                    pallets.length ?
                        <>
                            <Text style={styles.carNum}>Поддон {pallets[0].ID}</Text>
                            <Text style={styles.count}>{pallets[0].packsCount}</Text>
                        </>
                        :
                        <></>
                }

            </View>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5
    },
    headerData: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%"
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 15,
        marginVertical: 5,
    },
    backBtn: {
        paddingRight: 10,
    },
    carNum: {
        marginRight: 'auto',
        fontSize: 18,
        fontWeight: 'bold',
    },
    count: {
        fontSize: 18,
        fontWeight: 'bold',
    }
})

