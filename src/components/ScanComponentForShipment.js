import React, {useState} from 'react'
import {Text, View, StyleSheet, Dimensions} from 'react-native'
import { AppBarcodeScanner } from './AppBarcodeScanner'
import { AppToast } from './AppToast'
import {AppButton} from "./AppButton";
import {InputScan} from "./InputScan";

export const ScanComponentForShipment = ({scanCode, title, description, label, isShow, type}) => {
    const scan = (data) => scanCode(data)
    const [visible, setVisible] = useState(false)
    const openInpScan = () => setVisible(true)
    return (
        <View style={styles.container}>
            <InputScan setVisible={setVisible} visible={visible} title={title} scanCode={scanCode}/>
            <View style={styles.header}>
                <AppToast label={label} isShow={isShow} type={type}/>
                <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.scanner}>
                <AppBarcodeScanner scanCode={scan}/>
            </View>
            <View style={styles.wrapper}>
                <Text style={styles.description}>{description}</Text>
                <AppButton label="Ввести код вручную" mode="outlined" onPress={openInpScan}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    wrapper: {
        flex: 1,
    },
    scanner: {
        height: '50%',
        width: Dimensions.get('window').width,
        backgroundColor: "rgba(197, 197, 197, 0.59)"
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10
    },
    description: {
        fontSize: 18,
        padding:20,
        textAlign: "center"
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingVertical: 5
    }
})