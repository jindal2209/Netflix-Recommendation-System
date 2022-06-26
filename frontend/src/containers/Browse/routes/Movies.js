import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { fetchMoviesByGenre, selectMoviesByGenre } from 'store/reducers/slices/moviesByGenreSlice'
import BrowseContent from '../BrowseContent/BrowseContent'
import LoadingScreen from 'components/StaticPages/LoadingScreen/LoadingScreen'
import ErrorPage from 'components/StaticPages/ErrorPage/ErrorPage'

import {
    fetchRating,
    selectAllRatingVideos,
    selectRatingError,
} from "store/reducers/slices/ratingSlice";

const Movies = () => {
    const { genres, status, error } = useSelector(selectMoviesByGenre)
    const ratingVideos = useSelector(selectAllRatingVideos);
    const ratingError = useSelector(selectRatingError);
    const dispatch = useDispatch()

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchMoviesByGenre())
            dispatch(fetchRating());
        }
    }, [dispatch, status])

    let browseContent
    if (status === 'success' && !ratingError) {
        let videoSections = [...genres];
        videoSections.unshift({
            title: "You Might Also like(recommended)",
            videos: ratingVideos,
        });
        browseContent = <BrowseContent videoSections={videoSections} />
    } else if (status === 'idle' || status === 'loading') {
        browseContent = <LoadingScreen />
    } else if (status === 'error') {
        browseContent = <ErrorPage errors={error} />
    }

    return browseContent
}

export default Movies