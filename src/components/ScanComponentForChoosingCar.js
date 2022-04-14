import React, {useState} from 'react'
import {Text, View, StyleSheet, Dimensions} from 'react-native'
import { AppBarcodeScanner } from './AppBarcodeScanner'
import { AppToast } from './AppToast'
import {AppButton} from "./AppButton";
import {InputScan} from "./InputScan";

export const ScanComponentForChoosingCar = ({scanCode, title, description, label, isShow, type, scan_count, count, closeScanner}) => {
    const scan = (data) => scanCode(data)
    const [visible, setVisible] = useState(false)
    const openInpScan = () => setVisible(true)
    return (
        <View style={styles.container}>
            <InputScan setVisible={setVisible} visible={visible} title={title} scanCode={scanCode}/>
            <AppToast label={label} isShow={isShow} type={type}/>
            <View style={styles.scanner}>
                <Text style={styles.title}>{title}</Text>
                <AppBarcodeScanner scanCode={scan}/>
            </View>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.count_data}>Отсканировано мест {count} из {scan_count}</Text>
            <View style={styles.wrapper}>
                <AppButton label="Ввести код вручную" mode="outlined" onPress={openInpScan}/>
                <AppButton label="Ввести гос.номер машины" onPress={closeScanner}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 18
    },
    wrapper: {
        flex: 1,
        zIndex: 500
    },
    scanner: {
        height: '65%',
        marginTop: 40,
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10
    },
    description: {
        fontSize: 18,
        padding:10,
        paddingBottom: 0,
        textAlign: "center"
    },
    count_data: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 10
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingVertical: 5
    }
})