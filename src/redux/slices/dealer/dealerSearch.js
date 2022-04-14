import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {dealerSearch} from '../../../server';

const initialState = {
    packs: [],
    total: null,
    loading: false,
};

export const fetchDealerSearch = createAsyncThunk(
    'searchDealerPacks/fetchDealerSearch',
    async (args) => {
        console.log('dealerSearch args', args);
        return await dealerSearch(args);
    }
);

export const reloadDealerSearch = createAsyncThunk(
    'reloadDealerSearch/reloadDealerSearch',
    async (args) => {
        console.log('dealerSearch args', args);
        return await dealerSearch(args);
    }
);

const dealerSearchSlice = createSlice({
    name: 'dealerSearch',
    initialState,
    reducers: {
        clearPacks: state => {
            state.packs = []
            state.loading = false
            state.total = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDealerSearch.pending, (state) => {
                console.log('pending');
                state.loading = true;
            })
            .addCase(reloadDealerSearch.fulfilled, (state, action) => {
                console.log("reloadDealerSearch", action.payload.data)
                state.packs = action.payload.data
                state.loading = false;
                state.total = action.payload.total;
            })
            .addCase(fetchDealerSearch.fulfilled, (state, action) => {
                state.packs = state.packs.concat(action.payload.data);
                state.loading = false;
                state.total = action.payload.total;
            })
            .addCase(fetchDealerSearch.rejected, (state) => {
                console.log('rejected');
                state.loading = false;
            })
            .addDefaultCase(() => {
            });
    },
});

const {actions, reducer} = dealerSearchSlice;

export default reducer;

export const {clearPacks} = actions;
