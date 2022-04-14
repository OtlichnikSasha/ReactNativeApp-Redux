import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'

export const AppBarcodeScanner = ({ scanCode }) => {
	const [hasPermission, setHasPermission] = useState(null)
	const [scanned, setScanned] = useState(false)

	useEffect(async () => {
			const {status} = await BarCodeScanner.requestPermissionsAsync()
			setHasPermission(status === 'granted')
		}, [])


	const handleBarCodeScanned = ({ data }) => {
		setScanned(true)
		scanCode(data)
		setTimeout(() => {
			setScanned(false)
		}, 2000)
	}

	if (hasPermission === null) {
		return <View style={styles.textWrapper}><Text style={styles.text}>Включение камеры...</Text></View>
	}
	if (hasPermission === false) {
		return <View style={styles.textWrapper}><Text style={styles.text}>Нет доступа к камере</Text></View>
	}

	return (
		<View style={styles.wrapper}>
			<BarCodeScanner
				onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
				style={StyleSheet.absoluteFillObject}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	wrapper: {
		height: '100%',
		width: '100%',
		flex: 1
	},
	textWrapper: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	text: {
		fontSize: 20
	}
})