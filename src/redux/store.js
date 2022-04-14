import { configureStore } from '@reduxjs/toolkit'

import pointPacks from './slices/pointPacksSlice'
import packOnPalletToSector from './slices/packOnPalletToSector';
import packOnPalletToStore from './slices/packOnPalletToStore';
import pointPalletPacks from './slices/pointsPalletsPacksSlice'
import points from './slices/pointsSlice'
import point from './slices/pointSlice'
import sectorPalletPacks from './slices/sectorPalletsPacksSlice'
import sectorPacks from './slices/sectorPackSlice'
import warehouses from './slices/warehouseSlice'
import cells from './slices/cellsSlice'
import cell from './slices/cellSlice'
import transitWarehousesSlice from './slices/transitWarehousesSlice'
import transitWarehouse from './slices/transitWarehouseSlice'
import pallets from './slices/palletsSlice'
import preparedPalletsSlice from './slices/preparedPalletsSlice'
import preparedPalletPlaces from './slices/preparedPalletPlaces'
import packToStore from './slices/packsToStore'
import packToSector from './slices/packToSector'
import packsCount from './slices/packsCountSlice'
import placeDamaged from './slices/placeDamaged'
import departure from './slices/departureSlice'
import uploadPhotoSlice from './slices/uploadPhotoSlice';
import sections from './slices/sections/sectionsSlice'
import sectionSlice from './slices/sections/sectionSlice'
import sectionForPlaceInfoSlice from './slices/sections/sectionForPlaceInfoSlice'
import shipmentPacks from './slices/shipments/shipmentPacksSlice'
import shipmentPartialPacksSlice from './slices/shipments/partialDeliveryPacks'
import shipmentPalletPacks from './slices/shipments/shipmentPalletPacks'
import shipmentPacksSearch from './slices/shipments/shipmentPacksForCellSearch'
import shipmentPack from './slices/shipments/shipmentPackSlice'
import packHistory from './slices/packHistorySlice'
import shipmentScanPack from './slices/shipments/shipmentScanPack'
import shipmentPacksDelivery from './slices/shipments/shipmentPacksDelivery'
import shipmentSendCar from './slices/shipments/shipmentSendCar'
import shipmentCell from './slices/shipments/shipmentCellSlice'
import shipmentPacksOnPallet from './slices/shipments/shipmentPacksOnPallet'
import shipmentPacksOnStore from './slices/shipments/shipmentPacksOnStore'
import shipmentSector from './slices/shipments/shipmentSectorSlice'
import subordersReturnToStore from './slices/shipments/subordersReturnToStore'
import user from './slices/userSlice'
import departurePacks from './slices/transit/departurePacksSlice';
import departures from './slices/transit/departuresSlice';
import warehousePacks from './slices/transit/transitWhSlice';
import acceptDepartures from './slices/transit/acceptDeparturesTransit';
import acceptDeparturesCar from './slices/transit/acceptDeparturesCar';
import sendAwayPackIDs from './slices/transit/sendAwayPacks';
import departuresForTransit from './slices/transit/departuresForTransitSlice';
import orders from './slices/dealer/ordersSlice';
import order from './slices/orderSlice';
import subOrders from './slices/dealer/subOrdersSlice';
import subOrder from './slices/subOrderSlice';
import dealerPacks from './slices/dealer/dealerPacksSlice';
import dealerSearch from './slices/dealer/dealerSearch';
import details from './slices/dealer/detailsSlice';
import placeHistory from './slices/placeHistoryPlace'
const store = configureStore({
  reducer: { pointPacks,point, points, packOnPalletToSector, packOnPalletToStore, pointPalletPacks,packsCount, sectorPalletPacks,
      cell, cells,transitWarehousesSlice,transitWarehouse, pallets,preparedPalletsSlice,preparedPalletPlaces, warehouses, sectorPacks, sections,sectionSlice,sectionForPlaceInfoSlice, user,
      packHistory, shipmentPacks, shipmentPartialPacksSlice, shipmentSector, shipmentPalletPacks, shipmentPack, shipmentPacksSearch, shipmentScanPack, shipmentCell, shipmentPacksDelivery, shipmentSendCar,
      shipmentPacksOnPallet,shipmentPacksOnStore,subordersReturnToStore, packToStore,
    packToSector, placeDamaged, departurePacks, warehousePacks,acceptDepartures,sendAwayPackIDs, departuresForTransit,
    uploadPhotoSlice, orders,order, subOrders,subOrder, dealerPacks, dealerSearch, details, acceptDeparturesCar, departures, departure, placeHistory},
  middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  devTools: process.env.NODE_ENV !== 'production'
})

export default store;