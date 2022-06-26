import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import trendingReducer from './slices/trendingSlice'
import topRatedReducer from './slices/topratedSlice'
import netflixOriginalsReducer from './slices/netflixOriginalsSlice'
import moviesByGenresReducer from './slices/moviesByGenreSlice'
import latestVideoReducer from './slices/latestVideoSlice'
import ratingReducer from './slices/ratingSlice'

const store = configureStore({
    reducer: {
        rating: ratingReducer,
        trending: trendingReducer,
        toprated: topRatedReducer,
        netflixOriginals: netflixOriginalsReducer,
        moviesByGenre: moviesByGenresReducer,
        latestVideos: latestVideoReducer
    },
    // Clear this in production, as it is done by default 
    middleware: [...getDefaultMiddleware({ immutableCheck: false })]
})

export default store 
