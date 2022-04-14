import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';

const SearchComponent = () => {
  const [value, setValue] = useState('');

  const handleInput = (text) => {
    setValue(text);
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={handleInput}
        placeholder="Ведите название заказа или упаковки"
      />
    </View>
  );
};

export default SearchComponent;

const styles = StyleSheet.create({
  inputContainer: {
    // flex: 1,
    width: '100%',
  },
  textInput: {
    // width: '100%',
    height: 30,
    borderWidth: 1,
    borderColor: '#8E8E8E',
    backgroundColor: '#FBFDFF',
    borderRadius: 4,
    // paddingLeft: '3%',
    // paddingVertical: '1%',
  },
});
