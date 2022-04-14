import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { AppButton } from './AppButton';
import { useDispatch } from 'react-redux'
import { setErrors } from '../redux/slices/userSlice'

const Login = ({ getLogin, loading, hasError, loginError }) => {
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const [isHidePassword, setHidePassword] = useState(true);

	const dispatch = useDispatch()

	const onChangeLogin = (text) => {
		setLogin(text.trim())
		if (hasError || loginError) {
			dispatch(setErrors())
		}
	};

	const onChangePassword = (text) => {
		setPassword(text.trim())
		if (hasError || loginError) {
			dispatch(setErrors())
		}
	};

	const loginHandler = () => {
		const data = {
			login,
			password
		};
		getLogin(data);
	};

	return (
		<View style={styles.loginForm}>
			<Text style={styles.title}>Авторизация</Text>
			{
				loginError
					? <Text style={styles.error}>Неверный логин или пароль</Text>
					: <Text style={styles.empty}> </Text>
			}
			<TextInput
				style={styles.input}
				label="Логин"
				value={login}
				onChangeText={onChangeLogin}
			/>
			<TextInput
				style={styles.input}
				label="Пароль"
				secureTextEntry={isHidePassword}
				value={password}
				onChangeText={onChangePassword}
				right={
					<TextInput.Icon
						onPress={() => {
							setHidePassword(!isHidePassword);
						}}
						name="eye"
					/>
				}
			/>
			<AppButton label="Войти" loading={loading} onPress={loginHandler}/>
		</View>
	);
};

const styles = StyleSheet.create({
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 30
	},
	loginForm: {
		padding: 20
	},
	input: {
		marginTop: -15,
		marginBottom: 30
	},
	error: {
		fontSize: 16,
		color: 'red',
		textAlign: 'center',
		marginBottom: 20
	},
	empty: {
		height: 42
	}
});

export default Login;
