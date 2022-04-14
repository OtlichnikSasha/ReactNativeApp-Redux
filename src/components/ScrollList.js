import React from 'react'
import {ScrollView, RefreshControl} from 'react-native'

export const ScrollList = ({ children, loading, onScroll, onRefresh }) => {
  const scrollHandler = (e) => {
    let y = e.nativeEvent.contentOffset.y
    let height = e.nativeEvent.layoutMeasurement.height
    let contentHeight = e.nativeEvent.contentSize.height
    if (y + height >= (contentHeight - 0.5) != 0) {
      onScroll()
    }
  }

  return (
    <ScrollView
      onScroll={(evt) => scrollHandler(evt)}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
        />
      }
    >
      {children}
    </ScrollView>
  )
}