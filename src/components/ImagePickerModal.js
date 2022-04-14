import React, { useState } from 'react';
import {Dimensions, StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import { Camera } from 'expo-camera';
import {FontAwesome} from "@expo/vector-icons";

export const ImagePickerModal = ({ isVisible, setVisible, setUri, uri }) => {
  const [camera, setCamera] = useState(null);

  const takePhoto = async () => {
    const photoData = await camera.takePictureAsync({
      aspect: [4, 3],
    });
    const photo = photoData.uri;
    setVisible(false);
    return setUri([...uri, photo]);
  };
  const closeCamera = () => setVisible(false)
  if (isVisible) {
    return (
        <View isVisible={isVisible} style={styles.container}>
          <TouchableOpacity style={styles.closeCamera} onPress={closeCamera}>
            <FontAwesome name="times" size={20} color={"#fa1a3a"}/>
          </TouchableOpacity>
          <Camera ref={setCamera} style={styles.camera}>
            <TouchableOpacity
                onPress={takePhoto}
                style={styles.snapContainer}
            />
          </Camera>
        </View>
    );
  }
  return null
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    borderRadius: 5,
    zIndex: 9000,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(129,129,129,0.6)",
  },
  closeCamera: {
    position: "absolute",
    top: "5%",
    right: 10,
    zIndex: 9999,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#696868",
    justifyContent: "center",
    alignItems: "center"
  },
  camera: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  snapContainer: {
    width: 70,
    height: 70,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#222',
    borderRadius: 50,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 90,
  },
});
