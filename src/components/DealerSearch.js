import React, {useState, useEffect} from 'react'
import {StyleSheet, View, TextInput, TouchableHighlight} from 'react-native'
import {FontAwesome5} from "@expo/vector-icons";
import {useDispatch, useSelector} from "react-redux";
import {reloadDealerSearch, clearPacks} from "../redux/slices/dealer/dealerSearch";
import {useIsFocused} from "@react-navigation/native";

export const DealerSearch = ({visible, setVisible, search}) => {
    const [q, setQ] = useState('')
    const [startSearch, setStartSearch] = useState(false)
    const dispatch = useDispatch()
    const isFocused = useIsFocused();

    useEffect(() => {
        if(isFocused) dispatch(clearPacks())
    }, [isFocused])

    const changeHandler = (text) => setQ(text);
    const finishHandler = (event) => {
        event.persist();
        setStartSearch(true)
    }
    const closeSearch = () => setVisible(false)
    const {packs, loading} = useSelector(state => state.dealerSearch)

    useEffect(async () => {
        if (q && startSearch) {
            try{
                await dispatch(reloadDealerSearch({q}))
            }
            catch (e){
               console.log(e)
            }
            finally {
                setStartSearch(false)
            }
        }
    }, [startSearch])


    useEffect(() => {
        if(packs && !loading) search(packs, loading, q)
    }, [packs])

    return (
        <>
            {visible ?
                <View style={styles.container}>
                    <TextInput style={styles.input}
                               placeholder="Введите название заказа или упаковки"
                               onEndEditing={finishHandler}
                               onChangeText={changeHandler}
                    />
                    <TouchableHighlight activeOpacity={0.0} underlayColor="rgba(129,129,129,0.0)" onPress={closeSearch}>
                        <FontAwesome5 name="times" size={16}/>
                    </TouchableHighlight>
                </View>
                : <></>
            }
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: "5.5%",
        left: "13%",
        width: "75%",
        zIndex: 9999,
        backgroundColor: "#FFF",
        flexDirection: "row",
        alignItems: "center",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#8E8E8E",
        borderRadius: 5
    },
    input: {
        color: "#000000",
        width: "92%",
        padding: 5,
        textTransform: "uppercase",
        fontSize: 12,
    }
})