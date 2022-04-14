import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {shipmentSendCar} from '../../../server'

const initialState = {
    result: null,
    loading: false,
    error: null,
    carNumber: null,
    seal: null,
    photos: [],
    sectionID: null
}

export const fetchShipmentSendCar = createAsyncThunk(
    'shipmentSendCar/fetchShipmentSendCar',
    async (args) => {
        console.log('args', args)
        return await shipmentSendCar(args)
    }
)


export const addShipmentCarData = createAsyncThunk(
    'shipmentSendCar/addShipmentCarData',
    (args) => {
        console.log('shipmentSendCarData', args)
        this.state.carNumber = args.carNumber
        this.state.seal = args.seal
        this.state.photos = args.photos
        this.state.sectionID = args.sectionID
    }
)

const shipmentSendAuto = createSlice({
    name: 'shipmentSendAuto',
    initialState,
    reducers: {
        clearData: state => {
            state.result = null
            state.error = null
        },
        clearCarData: state => {
            state.carNumber = null
            state.seal = null
            state.photos = []
            state.sectionID = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchShipmentSendCar.pending, state => {
                state.loading = true
            })
            .addCase(fetchShipmentSendCar.fulfilled, (state, action) => {
                console.log('action.payload', action.payload)
                state.loading = false
                state.result = action.payload.success
                state.error = action.payload.error
            })
            .addCase(fetchShipmentSendCar.rejected, state => {
                state.loading = false
            })
            .addDefaultCase(() => {
            })
    }
})

const {actions, reducer} = shipmentSendAuto
export default reducer
export const {
    clearData,
} = actions




