import React, {useState} from 'react'
import { Provider } from 'react-redux'
import AppLoading from 'expo-app-loading'
import {NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import store from './src/redux/store'

import { AppNavigation } from './src/navigation/AppNavigation'
import { getUser } from './src/http'
const Stack = createStackNavigator()
export default function App () {
	const [isReady, setIsReady] = useState(false)

  if (!isReady) {
    return (
      <AppLoading
        startAsync={getUser}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );
  }

	return (
		<Provider store={store}>
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen
						name="Main"
						component={AppNavigation}
						options={{headerShown: false}}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</Provider>
	)
}
