import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useIsFocused} from "@react-navigation/native";
import {fetchDepartures, reloadDepartures} from "../redux/slices/transit/departuresSlice";
import {StyleSheet, SafeAreaView} from "react-native";
import {DepartureItem} from "../components/DepartureItem";
import {Empty} from "../components/Empty";
import {ScrollList} from "../components/ScrollList";
import {fetchTransitWarehouses} from "../redux/slices/transitWarehousesSlice";
import {fetchCells} from "../redux/slices/cellsSlice";
import {fetchSections} from "../redux/slices/sections/sectionsSlice";
import {fetchPacksCount} from "../redux/slices/packsCountSlice";
export const DeparturesListScreen = ({navigation}) => {
    const isFocused = useIsFocused();
    const limit = 30
    const status = "CREATED"
    const dispatch = useDispatch()
    useEffect(() => {
        if(isFocused) {
            dispatch(fetchTransitWarehouses({}))
            dispatch(fetchCells({}))
            dispatch(fetchSections({}))
            loadDeparturesHandler()
            dispatch(fetchPacksCount({}))
        }
    }, [isFocused])

    const {departures, loading, total} = useSelector(state => state.departures)
    const loadDeparturesHandler = () => dispatch(reloadDepartures({limit, status}))
    const fetchDeparturesHandler = (offset) => {
        dispatch(fetchDepartures({limit, offset, status}))
    }
    const onRefresh = React.useCallback(() => {
        loadDeparturesHandler()
        dispatch(fetchTransitWarehouses({}))
        dispatch(fetchPacksCount({}))
        dispatch(fetchSections({}))
    }, [])

    const loadDepartures = () => {
        if (loading || departures.length === total) return
        const offset = (departures.length / limit) * limit
        fetchDeparturesHandler(offset)
    }
    const navigateToDeparture = (departure) => navigation.navigate("SectorScreen", {departure})
    const {warehouses} = useSelector(state => state.transitWarehousesSlice)
    useEffect(() => {
        if(!warehouses.length) dispatch(fetchTransitWarehouses({}))
    }, [warehouses])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollList loading={loading} onScroll={loadDepartures} onRefresh={onRefresh}>
                {departures.length
                    ? departures.map(departure => (
                        <DepartureItem key={departure.ID} departure={departure} onPress={navigateToDeparture}/>
                    ))
                    : <Empty visible={!loading}/>
                }
            </ScrollList>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    buttonInner: {
        marginVertical: 5,
        marginHorizontal: 10
    }
})
