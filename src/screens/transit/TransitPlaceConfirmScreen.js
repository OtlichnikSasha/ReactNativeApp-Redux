import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { ScanComponent } from '../../components/ScanComponent';
import {
  addAcceptPacks,
  sendAcceptedPackIDs,
} from '../../redux/slices/transit/departurePacksSlice';

export const TransitPlaceConfirmScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { packs } = useSelector((state) => state.departurePacks);

  const [isShow, setIsShow] = useState(false);
  const [scannedPacks, setScannedPacks] = useState([]);

  const scanCode = (data) => {
    if (!data) return;

    setIsShow(true);
    setTimeout(() => {
      setIsShow(false);
    }, 1000);
    const newData = [...scannedPacks, data];
    setScannedPacks(newData);
  };

  const sendIDs = () => {
    const data = { packIDs: [] };

    packs.forEach((pack) => {
      if (scannedPacks.includes(pack.code)) {
        data.packIDs.push(pack.ID);
      }
    });

    dispatch(addAcceptPacks(data));
    dispatch(sendAcceptedPackIDs());
    navigation.goBack();
  };

  const pack = scannedPacks[scannedPacks.length - 1];

  return (
    <View style={styles.container}>
      <ScanComponent
        label={`Место ${pack} - Принято`}
        isShow={isShow}
        type={'success'}
        title="Подтверждение получения места"
        description="Отсканируйте код места, чтобы отметить его принятым"
        scanCode={scanCode}
        closeScanner={sendIDs}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
