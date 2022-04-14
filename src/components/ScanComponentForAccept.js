import React, {useState, useEffect} from 'react'
import {Text, View, StyleSheet, Dimensions} from 'react-native'
import {AppBarcodeScanner} from './AppBarcodeScanner'
import {AppToast} from './AppToast'
import {AppButton} from "./AppButton";
import {useIsFocused} from "@react-navigation/native";
import {InputScan} from "./InputScan";

export const ScanComponentForAccept = ({
                                           scanCode,
                                           title,
                                           description,
                                           label,
                                           isShow,
                                           type,
                                           scan_count,
                                           count,
                                           closeScanner
                                       }) => {
    const [visible, setVisible] = useState(false)
    const scan = (data) => scanCode(data)
    const openInpScan = () => setVisible(true)
    const isFocused = useIsFocused();
    const [disabled, setDisabled] = useState(true)
    const [counter, setCounter] = useState(0)
    useEffect(() => {
        if (isFocused) {
            setCounter(count)
            setDisabled(count !== scan_count)
        }
    }, [count])
    return (
        <>
            {isFocused ?
                <View style={styles.container}>
                    <InputScan setVisible={setVisible} visible={visible} title={title} scanCode={scanCode}/>
                    <View style={styles.header}>
                        <AppToast label={label} isShow={isShow} type={type} textCode={scan}/>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    <View style={styles.scanner}>
                        <AppBarcodeScanner scanCode={scan}/>
                    </View>
                    <View style={styles.wrapper}>
                        <Text style={styles.description}>{description}</Text>
                        {counter === scan_count ? <Text style={styles.count_data}>Всё отсканировано</Text>
                            :
                            <Text style={styles.count_data}>Отсканировано {counter} из {scan_count}</Text>
                        }
                        <AppButton label="Ввести код вручную" mode="outlined" onPress={openInpScan}/>
                        <AppButton label="Принять машину" onPress={closeScanner} disabled={disabled}/>
                    </View>
                </View>
                : <></>}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10
    },
    wrapper: {
        flex: 1,
        zIndex: 400,
        justifyContent: "flex-end"
    },
    scanner: {
        height: '50%',
        marginVertical: 10,
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 18,
        padding: 10,
        paddingBottom: 0,
        textAlign: "center"
    },
    count_data: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 5
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingVertical: 5
    }
})