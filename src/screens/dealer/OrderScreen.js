import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import React from 'react';
import {Ionicons} from "@expo/vector-icons";

export const OrderScreen = ({navigation, route}) => {
    const order = route.params.pack.data;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <ScrollView>
                {order ?
                    <TouchableOpacity
                        style={styles.listItem}
                        onPress={() => navigation.navigate('PackInfo', {order})}
                    >
                        <Text style={styles.item}>
                            {`${order.contractNumber} Заказ ${order.number}`}
                        </Text>
                    </TouchableOpacity>
                    :
                    <></>
                }
            </ScrollView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    listItem: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginVertical: 5,
        marginHorizontal: 15,
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: '#9B9B9B44',
        borderRadius: 5,
    },
    item: {
        fontSize: 14,
    },
    header: {
        paddingLeft: 15
    }
});
