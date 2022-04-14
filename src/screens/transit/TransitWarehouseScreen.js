import {
    SafeAreaView,
    StyleSheet,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ScrollList} from '../../components/ScrollList';
import {Empty} from '../../components/Empty';
import {fetchWarehousePacks, reloadWarehousePacks} from '../../redux/slices/transit/transitWhSlice';
import {AppButton} from "../../components/AppButton";
import {useIsFocused} from "@react-navigation/native";
import {PlaceDamagedAndInfo} from "../../components/PlaceDamagedAndInfo";
import {TransitItem} from "../../components/TransitItem";

export const TransitWarehouseScreen = ({navigation}) => {
    const [disabled, setDisabled] = useState(true);
    const [visible, setVisible] = useState(false);
    const [place, setPlace] = useState(false);
    const dispatch = useDispatch();
    const limit = 30;
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) loadPacksHandler();
        if(packs.length) setDisabled(false)
    }, [isFocused]);
    const {packs, loading, total} = useSelector((state) => state.warehousePacks);
    const onRefresh = useCallback(() => {
        loadPacksHandler();
    }, []);

    const loadPacks = () => {
        if (packs.length === total || loading) return;
        const offset = (packs.length / limit) * limit;
        dispatch(fetchWarehousePacks({limit, offset}));
    };
    const loadPacksHandler = () => dispatch(reloadWarehousePacks({limit}));
    const handleAccept = () => navigation.navigate('LoadZoneDealer');
    const openModalDamaged = (pack) => {
        if (!visible) {
            setVisible(true)
            setPlace(pack)
        }
    }
    const watchPlaceInfo = () => navigation.navigate("ShipmentPlaceInfo", {packID: place.ID})
    return (
        <SafeAreaView style={styles.container}>
            <PlaceDamagedAndInfo visible={visible} setVisible={setVisible} place={place} onPress={watchPlaceInfo} onLoad={loadPacksHandler}/>
            <ScrollList loading={loading} onScroll={loadPacks} onRefresh={onRefresh}>
                <ScrollList loading={loading} onScroll={loadPacks} onRefresh={onRefresh}>
                    {packs.length ?
                        packs.map((pack, i) => (
                            <TransitItem key={i} pack={pack} onPress={openModalDamaged}/>
                        ))
                        :
                        <Empty visible={!loading} />
                    }
                </ScrollList>
            </ScrollList>
            <AppButton onPress={handleAccept} label="Отгрузить места дилеру" disabled={disabled}/>
        </SafeAreaView>
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
    addPhotoContainer: {
        marginHorizontal: 15,
    },
    addPhotoTitle: {
        fontSize: 16,
        color: '#585858',
    },
    cameraBtnContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginVertical: 5,
    },
    cameraBtn: {
        marginRight: 15,
        padding: 10,
        backgroundColor: '#C4C4C4',
    },
    acceptBtn: {
        margin: 15,
    },
});
