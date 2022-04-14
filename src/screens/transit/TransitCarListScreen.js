import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ScrollList} from '../../components/ScrollList';
import {Empty} from '../../components/Empty';
import {
    fetchDeparturesForTransit,
    reloadDeparturesForTransit
} from '../../redux/slices/transit/departuresForTransitSlice';
import {useIsFocused} from "@react-navigation/native";

export const TransitCarListScreen = ({navigation}) => {
    const dispatch = useDispatch();
    const limit = 30;
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) loadDeparturesHandler();
    }, [isFocused]);
    const {departures, loading, total} = useSelector(state => state.departuresForTransit);
    const onRefresh = useCallback(() => {
        loadDeparturesHandler();
    }, []);
    const loadDepartures = () => {
        if (loading || departures.length === total) return
        const offset = (departures.length / limit) * limit;
        dispatch(fetchDeparturesForTransit({limit, offset}));
    };
    const loadDeparturesHandler = () => dispatch(reloadDeparturesForTransit({limit}))
    return (
        <SafeAreaView style={styles.container}>
            <ScrollList
                loading={loading}
                onScroll={loadDepartures}
                onRefresh={onRefresh}
            >
                {departures.length ?
                    departures.map(departure => (
                        <TouchableOpacity
                            key={departure.ID}
                            style={styles.carItem}
                            onPress={() => navigation.navigate('PlacesList', {ID: departure.ID})}
                        >
                            <Text style={styles.carNum}>{departure.carNumber}</Text>
                            <Text>{departure.packsCount}</Text>
                        </TouchableOpacity>
                    ))
                 :
                    <Empty visible={!loading}/>
                }
            </ScrollList>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    carItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 15,
        padding: 20,
        backgroundColor: '#9B9B9B44',
        borderRadius: 5,
    },
    carNum: {
        fontSize: 18
    },
});
