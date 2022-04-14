import React from 'react'
import { ToastAndroid } from 'react-native'

export const FlashMessage = ({ visible, message }) => {
	if (visible) {
		ToastAndroid.showWithGravityAndOffset(message, ToastAndroid.LONG, ToastAndroid.TOP, 0, 25)
		return null
	}
	return null
}