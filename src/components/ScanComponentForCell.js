import React, {useState} from 'react'
import {Text, View, StyleSheet, Dimensions} from 'react-native'
import { AppBarcodeScanner } from './AppBarcodeScanner'
import { AppToast } from './AppToast'
import {AppButton} from "./AppButton";
import {InputScan} from "./InputScan";

export const ScanComponentForCell = ({scanCode, title, description, label, isShow, type, onPress, goToCellSelection, disabled=false}) => {
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
            <Text style={styles.description}>{description}</Text>
            <View style={styles.wrapper}>
                <AppButton label="Ввести код вручную" mode="outlined" onPress={openInpScan}/>
                <AppButton
                    style={styles.button}
                    label="Выбрать ячейку склада"
                    mode="outlined"
                    onPress={goToCellSelection}
                    disabled={disabled}
                />
                <AppButton
                    style={styles.button}
                    label="Завершить"
                    onPress={onPress}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
        zIndex: 500,
        justifyContent: "flex-end"
    },
    scanner: {
        height: '40%',
        width: Dimensions.get('window').width,
        backgroundColor: "rgba(197, 197, 197, 0.59)",
        marginTop: -50
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
        textAlign: "center"
    },
    header: {
        flex: 1,
        paddingVertical: 5,
        justifyContent: "center"
    },
    button: {
        marginVertical: 5
    }
})