import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Ionicons} from '@expo/vector-icons';
import {ScrollList} from '../../components/ScrollList';
import {Empty} from '../../components/Empty';
import {
    fetchDeparturePacks,
    reloadDeparturePacks,
} from '../../redux/slices/transit/departurePacksSlice';
import {AppButton} from "../../components/AppButton";
import {PlaceDamagedAndInfo} from "../../components/PlaceDamagedAndInfo";
import {useIsFocused} from "@react-navigation/native";
import {TransitItem} from "../../components/TransitItem";
import {fetchDeparture} from "../../redux/slices/departureSlice";

export const TransitPlacesListScreen = ({route, navigation}) => {
    const [visibleDamaged, setVisibleDamaged] = useState(false);
    const [place, setPlace] = useState(false);
    const {ID} = route.params;
    const limit = 30;
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    useEffect(() => {
        if (isFocused){
            dispatch(fetchDeparture({id: ID}))
            loadPacksHandler()
        }
    }, [isFocused, ID])

    const {packs, loading, total} = useSelector((state) => state.departurePacks);
    const {departure} = useSelector(state => state.departure)
    const onRefresh = useCallback(() => {
        loadPacksHandler();
    }, []);

    const loadPacks = () => {
        if (packs.length === total || loading) return;
        const offset = (packs.length / limit) * limit;
        dispatch(fetchDeparturePacks({limit, offset, departureID: ID}))
    };
    const loadPacksHandler = () => dispatch(reloadDeparturePacks({limit, departureID: ID}));
    const handleAccept = () => navigation.navigate('LoadZoneWarehouse', {departureID: ID, scannedCount: departure.packsCount - packs.length});
    const openModalDamaged = (pack) => {
        if (!visibleDamaged) {
            setVisibleDamaged(true)
            setPlace(pack)
        }
    }
    const watchPlaceInfo = () => navigation.navigate("ShipmentPlaceInfo", {packID: place.ID})
    const closePage = () => navigation.goBack()
    const onLoad = () => {
        loadPacksHandler()
        dispatch(fetchDeparture({id: ID}))
    }
    return (
        <>
            {isFocused ? <SafeAreaView style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color="black"/>
                        </TouchableOpacity>
                        <Text style={styles.carNum}>{departure.carNumber}</Text>
                        <Text style={styles.count}>{departure.packsCount - packs.length} / {departure.packsCount}</Text>
                    </View>
                    <PlaceDamagedAndInfo visible={visibleDamaged} setVisible={setVisibleDamaged} place={place}
                                         onPress={watchPlaceInfo} onLoad={onLoad}/>
                    <ScrollList loading={loading} onScroll={loadPacks} onRefresh={onRefresh}>
                        {packs.length ?
                            packs.map(pack => (
                                <TransitItem key={pack.ID} pack={pack} onPress={openModalDamaged}/>
                            ))
                            :
                            <Empty visible={!loading}/>
                        }
                    </ScrollList>
                    <AppButton label="Принять места" onPress={handleAccept}/>
                    <AppButton mode="outlined" label="Завершить" onPress={closePage}/>
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
        backgroundColor: '#FFF',
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
    },
    scrollList: {
        marginHorizontal: 15,
    },
    place: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // paddingRight: 15,
    },
    itemText: {
        marginLeft: 15,
        fontSize: 18,
    },
    downloadText: {
        alignSelf: 'center',
        fontSize: 16,
        color: '#3E00A4',
    },
    acceptBtn: {
        marginBottom: 15,
        marginHorizontal: 15,
    },
});
