import { useState, useCallback } from "react";

import { mediaTypeToVideoDetailTransformation } from "utils/transformations";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

// A custom hook which sets all VideoCard/Carousel click/hover behavior
const UseVideoInfoHandlers = () => {
  const [videoInfo, setVideoInfo] = useState();
  const [videoInfoError, setVideoInfoError] = useState(null);
  const [detailModal, setDetailModal] = useState(false);
  const history = useHistory();

  const cardClickHandler = useCallback((videoId, mediaType) => {
    history.push(`movie/${videoId}/${mediaType}/`);
  }, [history]);

  const cardHoverHandler = useCallback((videoId, mediaType) => {
    mediaTypeToVideoDetailTransformation(videoId, mediaType)
      .then((data) => {
        setVideoInfo(data);
      })
      .catch((error) => {
        setVideoInfoError(error);
      });
  }, []);

  const closeModalHandler = useCallback(() => {
    setDetailModal(false);
  }, []);

  return [
    videoInfo,
    videoInfoError,
    detailModal,
    cardClickHandler,
    cardHoverHandler,
    closeModalHandler,
  ];
};

export default UseVideoInfoHandlers;