import React, {useRef, useEffect, useState} from 'react';
import {DrawerLayoutAndroid, Text, StyleSheet, View, TouchableHighlight} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {FontAwesome5} from '@expo/vector-icons';
import {AppHeaderIcon} from '../components/AppHeaderIcon';
import LoginScreen from '../screens/LoginScreen';
import {ShipmentStack} from '../screens/shipment/ShipmentStack';
import {TransitNavigation} from './TransitNavigation';
import {DealerNavigation} from './DealerNavigation';
import {MainStack} from '../screens/MainStack';
import {setRole, setName} from '../redux/slices/userSlice';
import * as SecureStore from 'expo-secure-store';
import {useDispatch, useSelector} from 'react-redux';
import {getUser} from '../http';
import {DealerSearch} from '../components/DealerSearch';

const Stack = createStackNavigator()
export const AppNavigation = ({navigation}) => {
    const [openSearch, setOpenDealerSearch] = useState(false)
    const drawer = useRef(null);
    const dispatch = useDispatch();

    const logout = async () => {
        await SecureStore.deleteItemAsync('access_token')
        await SecureStore.deleteItemAsync('refresh_token')
        dispatch(setRole(null));
        dispatch(setName(null))
        drawer.current.closeDrawer();
    };
    const role = useSelector((state) => state.user.role);
    const name = useSelector((state) => state.user.name);

    useEffect(async () => {
        const user = await getUser()
        if (user) {
            dispatch(setRole(user.role))
            dispatch(setName(user.login))
        }
    }, [])

    const searchNavigation = (packs, loading, q) => {
        if(q) {
            setOpenDealerSearch(false)
            navigation.navigate("DealerSearchList", {packs, loading, q})
        }
    }

    const openShipmentScan = () => {
        drawer.current.closeDrawer();
        navigation.navigate('ShipmentScanForSearch')
    }

    const openDealerSearch = () => setOpenDealerSearch(true)

    const navigationView = () => {
        return (
            <View style={[styles.container, styles.navigationContainer]}>
                <View style={styles.top_place}>
                    <TouchableHighlight activeOpacity={0.0} underlayColor="rgba(129,129,129,0.0)"
                                        onPress={() => drawer.current.closeDrawer()} style={styles.touchablePlace}>
                        <View style={styles.flex_menu}>
                            <FontAwesome5 name="arrow-left" size={16}/>
                            <Text style={styles.menuText}>
                                Меню
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>
                {role !== 'dealer' ?
                    <TouchableHighlight activeOpacity={0.0} underlayColor="rgba(129,129,129,0.0)"
                                        onPress={openShipmentScan} style={styles.touchablePlace}>
                        <View style={styles.flex_menu}>
                            <FontAwesome5 name="search" size={16}/>
                            <Text style={styles.menuText}>
                                Поиск информации через сканирование
                            </Text>
                        </View>
                    </TouchableHighlight>
                    :
                    <></>}
                <TouchableHighlight activeOpacity={0.0} underlayColor="rgba(129,129,129,0.0)" onPress={logout} style={styles.touchablePlace}>
                <View style={styles.flex_menu}>
                    <FontAwesome5 name="sign-out-alt" size={16}/>
                    <Text onPress={logout} style={styles.menuText}>
                        Выйти
                    </Text>
                </View>
                </TouchableHighlight>
            </View>
        )
    }


    return (
        <DrawerLayoutAndroid
            ref={drawer}
            drawerWidth={300}
            drawerPosition={'left'}
            renderNavigationView={navigationView}
        >
            <DealerSearch visible={openSearch} setVisible={setOpenDealerSearch} search={searchNavigation}/>
            <Stack.Navigator>
                {!role ? (
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{
                            headerShown: false
                        }}
                    />
                ) : (
                    <></>
                )}
                {role === 'loader' ? (
                    <Stack.Screen
                        name="Warehousing"
                        component={MainStack}
                        options={{
                            headerTitle: () => (
                                <View>
                                    <Text style={styles.roleTitle}>
                                        Складирование
                                    </Text>
                                    <Text style={styles.userName}>{name}</Text>
                                </View>
                            ),
                            headerLeft: () => (
                                <HeaderButtons HeaderButtonComponent={AppHeaderIcon}>
                                    <Item
                                        title="Take search"
                                        iconName="menu"
                                        onPress={() => drawer.current.openDrawer()}
                                    />
                                </HeaderButtons>
                            ),
                            // headerRight: () => (
                            //     <HeaderButtons HeaderButtonComponent={AppHeaderIcon}>
                            //         <Item
                            //             title="Take search"
                            //             iconName="search"
                            //             onPress={() => console.log('hello')}
                            //         />
                            //         <Item
                            //             title="Take reload"
                            //             iconName="reload"
                            //             onPress={() => console.log('reload')}
                            //         />
                            //     </HeaderButtons>
                            // )
                        }}
                    />
                ) : (
                    <></>
                )}
                {role === 'logistic' ? (
                    <Stack.Screen
                        name="ShipmentStack"
                        component={ShipmentStack}
                        options={{
                            headerTitle: () => (
                                <View>
                                    <Text style={styles.roleTitle}>
                                        Отгрузка
                                    </Text>
                                    <Text style={styles.userName}>{name}</Text>
                                </View>
                            ),
                            headerLeft: () => (
                                <HeaderButtons HeaderButtonComponent={AppHeaderIcon}>
                                    <Item
                                        title="Take search"
                                        iconName="menu"
                                        onPress={() => drawer.current.openDrawer()}
                                    />
                                </HeaderButtons>
                            ),
                            // headerRight: () => (
                            //     <HeaderButtons HeaderButtonComponent={AppHeaderIcon}>
                            //         <Item
                            //             title="Take search"
                            //             iconName="search"
                            //             onPress={() => console.log('hello')}
                            //         />
                            //         <Item
                            //             title="Take reload"
                            //             iconName="reload"
                            //             onPress={() => console.log('reload')}
                            //         />
                            //     </HeaderButtons>
                            // )
                        }}
                    />

                ) : (
                    <></>
                )}
                {role === 'transit' ? (
                    <Stack.Screen
                        name="TransitNavigation"
                        component={TransitNavigation}
                        options={{
                            headerTitle: () => (
                                <View>
                                    <Text style={styles.roleTitle}>
                                        Приемка транзитного склада
                                    </Text>
                                    <Text style={styles.userName}>{name}</Text>
                                </View>
                            ),
                            headerLeft: () => (
                                <HeaderButtons HeaderButtonComponent={AppHeaderIcon}>
                                    <Item
                                        title="Take search"
                                        iconName="menu"
                                        onPress={() => drawer.current.openDrawer()}
                                    />
                                </HeaderButtons>
                            ),
                            // headerRight: () => (
                            //     <HeaderButtons HeaderButtonComponent={AppHeaderIcon}>
                            //         <Item
                            //             title="Take search"
                            //             iconName="search"
                            //             onPress={() => console.log('hello')}
                            //         />
                            //         <Item
                            //             title="Take reload"
                            //             iconName="reload"
                            //             onPress={() => console.log('reload')}
                            //         />
                            //     </HeaderButtons>
                            // )
                        }}
                    />
                ) : (
                    <></>
                )}
                {role === 'dealer' ? (
                    <Stack.Screen
                        name="DealerNavigation"
                        component={DealerNavigation}
                        options={{
                            headerTitle: () => (
                                <View>
                                    <Text style={styles.roleTitle}>Дилер</Text>
                                    <Text style={styles.userName}>{name}</Text>
                                </View>
                            ),
                            headerLeft: () => (
                                <HeaderButtons HeaderButtonComponent={AppHeaderIcon}>
                                    <Item
                                        title="Take search"
                                        iconName="menu"
                                        onPress={() => drawer.current.openDrawer()}
                                    />
                                </HeaderButtons>
                            ),
                            headerRight: () => (
                                <HeaderButtons HeaderButtonComponent={AppHeaderIcon}>
                                    <Item
                                        title="Take search"
                                        iconName="search"
                                        onPress={openDealerSearch}
                                    />
                                    {/*<Item*/}
                                    {/*    title="Take reload"*/}
                                    {/*    iconName="reload"*/}
                                    {/*    onPress={() => console.log('reload')}*/}
                                    {/*/>*/}
                                </HeaderButtons>
                            )
                        }}
                    />
                ) : (
                    <></>
                )}
            </Stack.Navigator>
        </DrawerLayoutAndroid>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
        paddingTop: 40
    },
    navigationContainer: {
        backgroundColor: '#ecf0f1'
    },
    paragraph: {
        padding: 16,
        fontSize: 15,
        textAlign: 'center'
    },
    top_place: {
        height: 40,
        borderBottomWidth: 2,
        borderStyle: 'solid',
        borderBottomColor: '#999999',
        width: '100%'
    },
    touchablePlace:{
        width: "100%"
    },
    flex_menu: {
        flexDirection: 'row',
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    menuText: {
        fontWeight: 'bold',
        marginLeft: 10,
        fontSize: 14
    },
    userName: {
        color: '#4D4D4D',
        fontSize: 15
    },
    roleTitle: {
        fontSize: 14
    }
});
