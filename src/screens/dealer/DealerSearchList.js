import React from 'react';
import {SafeAreaView, StyleSheet, TouchableOpacity, View, ScrollView} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Empty} from "../../components/Empty";
import {useIsFocused} from "@react-navigation/native";
import {DealerSearchItem} from "../../components/DealerSearchItem";

export const DealerSearchList = ({navigation, route}) => {
    const {packs, loading} = route.params;
    const isFocused = useIsFocused();
    const navigationToItem = (pack) => {
        if(pack['entity'] === 'subOrder'){
            if(pack.data.deliveryStatus === 'PRODUCTION') {
                return navigation.navigate('PackInfoManufactured', {order: pack.data.orderID, subOrder: pack.data})
            }
            return navigation.navigate('PackInfoShipped', {order: pack.data.orderID, subOrder: pack.data})
        }
        if(pack['entity'] === 'order') return navigation.navigate('OrderScreen', {pack})
        return navigation.navigate('PackInfoShippedDetails', {
            pack: pack.data, order: pack.data.orderID, subOrder: pack.data
        })
    }
    return (
        <>
            {isFocused ? <SafeAreaView style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        {packs.length ?
                            packs.map(pack => (
                                <DealerSearchItem key={pack.data.ID} pack={pack} onClick={navigationToItem}/>
                            ))
                            :
                            <Empty visible={!loading} />
                        }
                    </ScrollView>
                </SafeAreaView>
                :
                <></>}
        </>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingHorizontal: 10
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