import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";

export const ratingAdapter = createEntityAdapter();

export const fetchRating = createAsyncThunk(
  "ratingSlice/fetchRating",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/recommend_movies_rating`
      );
      if (response) {
        let mData = [];

        for (let r of response.data) {
          const rr = await axios.get(`${process.env.REACT_APP_TMDB_BASE_URL}/movie/${r['id']}?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&language=en-US`)
          mData.push(rr.data);
        }
        return mData;
      }
    } catch (error) {
      if (!error.response) {
        throw error;
      }

      return rejectWithValue(error.response.data);
    }
  }
);

const ratingSlice = createSlice({
  name: "rating",
  initialState: ratingAdapter.getInitialState({ error: null }),
  reducers: {},
  extraReducers: {
    [fetchRating.fulfilled]: (state, action) => {
      ratingAdapter.upsertMany(state, action.payload);
    },

    [fetchRating.rejected]: (state, action) => {
      if (action.payload) {
        state.error = action.payload.status_message;
      } else {
        state.error = action.error;
      }
    },
  },
});

export const { selectAll: selectAllRatingVideos } = ratingAdapter.getSelectors(
  (state) => state.rating
);

export const selectRatingError = (state) => state.rating.error;

export default ratingSlice.reducer;
