import React, {useEffect, useState} from 'react'
import {View, Text, StyleSheet, Alert} from 'react-native'
import {IconButton, Colors, Divider} from 'react-native-paper'
import {useSelector} from 'react-redux'
import {fetchPoints} from "../redux/slices/pointsSlice";

export const PointItem = ({ pack, onPress }) => {
  const [point, setPoint] = useState('')
  const points = useSelector(state => state.points.points)
  useEffect(() => {
    if(!points.length) return dispatch(fetchPoints({}))
    const point = getPoint()
    setPoint(point)
  }, [pack])

  const getPoint = () => {
    return points?.find(point => point.ID === pack.pointID)?.name
  }

  const openPlaceDamaged = (pack) => {
    onPress(pack)
  }

  return (
    <View>
      {pack ?
          <View style={styles.pointItem}>
            <View style={styles.inner}>
              <Text style={styles.point}>
                {point}
              </Text>
              <Text style={styles.pack}>
                Место {pack.code}
              </Text>
            </View>
            <IconButton
                icon="dots-vertical"
                color={Colors.grey500}
                size={24}
                onPress={() => openPlaceDamaged(pack)}
            />
          </View>
          :
          null
      }
      <Divider/>
    </View>
  )
}
const styles = StyleSheet.create({
  pointItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10
  },
  point: {
    fontSize: 16,
    width: "25%",
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pack: {
    fontSize: 16,
    width: "60%"
  }
})