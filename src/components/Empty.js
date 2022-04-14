import React from 'react'
import {StyleSheet, Text, View} from 'react-native'

export const Empty = ({ visible }) => {

  if (!visible) {
    return null
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Пусто
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  text: {
    fontSize: 18,
    marginTop: "50%"
  }
})