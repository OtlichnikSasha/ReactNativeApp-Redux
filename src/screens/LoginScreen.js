import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Login from '../components/Login'
import { authLogin } from '../redux/slices/userSlice'
import { FlashMessage } from '../components/FlashMessage'

const LoginScreen = () => {
	const [visible, setVisible] = React.useState(false)
	const dispatch = useDispatch()
	const { loading, hasError, loginError } = useSelector(state => state.user)

	const getLogin = (data) => {
		dispatch(authLogin(data))
	}

	React.useEffect(() => {
		setVisible(false)
	}, [visible])

	React.useEffect(() => {
		if (hasError) {
			setVisible(true)
		}
	}, [hasError])

	return (
		<View style={styles.login}>
			<FlashMessage visible={visible} message="Не удалось авторизоваться"/>
			<Login getLogin={getLogin} loading={loading} hasError={hasError} loginError={loginError}/>
		</View>
	)
}

const styles = StyleSheet.create({
	login: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center'
	}
})

export default LoginScreen