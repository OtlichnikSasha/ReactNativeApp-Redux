import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  ImageBackground,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export function ImagePickerLayout({ uri, onPress, iconName }) {
  return (
    <ImageBackground style={styles.imageBackground}>
      <View style={styles.img_place}>
        <Image style={styles.image} source={uri ? { uri } : ''} />
        {uri === '' ? (
          <TouchableOpacity style={styles.icon} onPress={onPress}>
            <FontAwesome5 name={iconName} size={20} />
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
    marginRight: 10,
  },
  img_place: {
    position: 'relative',
    height: 50,
    width: 50,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#C4C4C4',
  },
  icon: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
