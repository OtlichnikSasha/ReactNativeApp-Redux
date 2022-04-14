import React, {useState} from 'react'
import {Text, View, StyleSheet, Dimensions} from 'react-native'
import { AppButton } from './AppButton'
import { AppBarcodeScanner } from './AppBarcodeScanner'
import { AppToast } from './AppToast'
import {InputScan} from "./InputScan";

export const ScanComponent = ({ closeScanner, scanCode, title, description, label, isShow, type }) => {
	const [visible, setVisible] = useState(false)
	const scan = (data) => scanCode(data)
	const openInpScan = () => setVisible(true)
	return (
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
				<AppButton label="Ввести код вручную" mode="outlined" onPress={openInpScan}/>
				<AppButton label="Завершить" onPress={closeScanner}/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
        padding: 10
	},
	wrapper: {
		flex: 1,
		justifyContent: 'flex-end',
		zIndex: 500
	},
	scanner: {
		height: '45%',
		width: Dimensions.get('window').width,
		backgroundColor: "rgba(197, 197, 197, 0.59)"
	},
	title: {
		textAlign: 'center',
		fontSize: 18,
		fontWeight: 'bold'
	},
	description: {
		fontSize: 18,
		textAlign: "center"
	},
	header: {
		flex: 1,
		justifyContent: 'flex-end',
		paddingVertical: 5
	}
})