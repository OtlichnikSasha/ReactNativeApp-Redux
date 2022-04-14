import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {AntDesign, Feather, FontAwesome5} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const AddPhotoForCar = ({uri, setVisible, setUri, fileIDs, setFileIDs}) => {
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) setUri([...uri, result.uri]);
    };

    const removeFromFileIDs = (p) => {
        for (let i = 0; i < uri.length; i++) {
            if (uri[i] === p) {
                fileIDs.splice(i, 1)
                console.log('fileIDs', fileIDs)
                setFileIDs([])
                setFileIDs(fileIDs)
                return console.log('fileIDs', fileIDs)
            }
        }
    }

    const removeImage = (p) => {
        console.log('p/uri', p, uri)
        removeFromFileIDs(p)
        setUri(uri.filter((path) => path !== p));
    };

    const openImagePickerModal = () => setVisible(true);
    return (
        <View style={styles.addPhotoContainer}>
            <Text style={styles.addPhotoTitle}>Добавить фотографии</Text>
            <View style={styles.cameraBtnContainer}>
                <TouchableOpacity style={styles.pickerButton} onPress={pickImage}>
                    <FontAwesome5 name={'folder'} size={25}/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={openImagePickerModal}
                >
                    <Feather name={'camera'} size={25}/>
                </TouchableOpacity>
                {uri.length
                    ? uri.map((path, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.pickerButton}
                            onPress={() => removeImage(path)}
                        >
                            <AntDesign style={styles.icon} name={'close'} size={20}/>
                            <Image style={styles.image} source={{uri: path}}/>
                        </TouchableOpacity>
                    ))
                    : null}
            </View>
        </View>
    );
};
export default AddPhotoForCar
const styles = StyleSheet.create({
    addPhotoContainer: {
        marginHorizontal: 15,
    },
    addPhotoTitle: {
        fontSize: 16,
        color: '#585858',
    },
    cameraBtnContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        marginVertical: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        backgroundColor: '#C4C4C4',
    },
    icon: {
        position: 'absolute',
        top: '30%',
        elevation: 1,
    },
    pickerButton: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        marginBottom: 15,
        height: 50,
        width: 50,
        overflow: 'hidden',
        backgroundColor: '#C4C4C4',
    },
});
