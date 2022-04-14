import React from 'react'
import {StyleSheet, View, Button} from 'react-native';

export const AppButton = ({mode = 'contained', onPress, label, loading, disabled, style = {}}) => {
    return (
        <View style={{paddingBottom: 5}}>
            <Button
                loading={loading}
                disabled={!!disabled}
                onPress={onPress}
                title={label}
                color={mode === 'contained' ? '#1890FF' : "#919090"}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    buttonContained: {
        backgroundColor: '#1890FF',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 4
    },
    buttonLoading: {
        backgroundColor: "#545454",
        justifyContent: 'center',
        padding: 8,
        borderRadius: 4
    },
    buttonDisabled: {
        backgroundColor: "#9f9e9e",
        justifyContent: 'center',
        padding: 8,
        borderRadius: 4
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
        textAlign: "center",
        textTransform: "uppercase",
        paddingVertical: 10
    },
});