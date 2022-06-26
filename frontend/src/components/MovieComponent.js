import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./MovieComponent.css";
import { CircularProgress } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { scrollTo } from "utils/animations";

function MovieComponent() {
  let { id, mediaType } = useParams();
  var [movieData, setMovieData] = useState("");
  var [recommendedMovies, setRecommendedMovies] = useState([]);
  var [loading, setLoading] = useState(false);
  const [disableScrolling, setDisableScrolling] = useState(false);
  const carouselRef = useRef();

  const scrollOnAbsoluteButtonClick = (scrollOffset) => {
    setDisableScrolling(true);
    scrollTo(
      carouselRef.current,
      carouselRef.current.scrollLeft + scrollOffset,
      1250,
      () => {
        setDisableScrolling(false);
      }
    );
  };

  useEffect(() => {
    // add to history
    let requestURL = `${process.env.REACT_APP_TMDB_BASE_URL}/movie/${id}?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&language=en-US`;
    setLoading(true);
    axios
      .get(requestURL)
      .then((response) => {
        setMovieData(response.data);
        axios
          .get(`${process.env.REACT_APP_SERVER_URL}/add_movie/${id}`)
          .then(() => {
            axios
              .post(
                `${process.env.REACT_APP_SERVER_URL}/recommend_movies_history/`,
                {
                  movie_name: response.data["title"],
                }
              )
              .then(async (res) => {
                let moData = [];
                for (let movie of res.data) {
                  let reqURL = `${process.env.REACT_APP_TMDB_BASE_URL}/movie/${movie["id"]}?api_key=${process.env.REACT_APP_MOVIEDB_API_KEY}&language=en-US`;
                  await axios.get(reqURL).then((d) => {
                    moData.push(d.data);
                  });
                }
                setRecommendedMovies(moData);
                setLoading(false);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch(() => {});
  }, [id, mediaType]);

  function toPercentage(str) {
    if (str === undefined) return "";
    let num = parseFloat(str);
    num *= 10;
    return num;
  }

  function releaseDateRunTimeHelper(date, time) {
    if (date === undefined) return "";
    let s = date.slice(0, 4);
    let mins = parseInt(time);
    let hrs = (mins / 60).toFixed();
    mins -= 60 * hrs;
    return `${s} ${hrs}h ${mins}m`;
  }

  function genresList(genres) {
    let s = [];
    let n = genres.length;
    for (let i = 0; i < n; i++) {
      let g = genres[i];
      s.push(`${g["name"]} ● `);
      if (i === n - 1) {
        s.pop();
        s.push(`${g["name"]}`);
      }
    }
    return s;
  }

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url(https://image.tmdb.org/t/p/w500/${movieData["backdrop_path"]})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="side-backdrop">
        {/* content */}
        <h1>{movieData["original_title"]}</h1>
        <h4>
          <span className="rating-block">{`Rating ${toPercentage(
            movieData["vote_average"]
          )}%`}</span>
          <span className="time-block">{`${releaseDateRunTimeHelper(
            movieData["release_date"],
            movieData["runtime"]
          )}`}</span>
        </h4>
        <h4 className="overview-block">{movieData["overview"]}</h4>
        <button
          className="Button btn"
          style={{
            backgroundColor: "rgb(255, 255, 255)",
            color: "rgb(24, 24, 24)",
          }}
        >
          <i className="fa-solid fa-play playbtn"></i> Play
        </button>
        <button
          className="Button btn"
          style={{
            backgroundColor: " #808080",
            color: "white",
          }}
        >
          More Info
        </button>
        <br></br>
        <br></br>
        <br></br>

        <div className="Carousels">
          <div className="CarouselParent">
            <div className="VideoCarousel" style={{ marginLeft: "0px" }}>
              <h3>Recommendations</h3>
              <div className="items">
                {loading === true ? (
                  <CircularProgress />
                ) : recommendedMovies.length === 0 ? (
                  <>
                    <h3> No movies to recommend</h3>
                  </>
                ) : (
                  recommendedMovies.map((val, key) => {
                    return (
                      <div key={key} className="item">
                        <Link
                          className="VideoCard"
                          style={{
                            backgroundImage: `url("https://image.tmdb.org/t/p/w500//${val["backdrop_path"]}`,
                            backgroundSize: "cover",
                            textDecoration: "inherit",
                            color: "inherit",
                          }}
                          to={`/movie/${val["id"]}/movie`}
                        >
                          <div className="VideoInfo">
                            <h6>{val["original_title"]}</h6>
                            <div className="horizontalStyle">
                              <span>
                                {`${toPercentage(val["vote_average"])}%`} &nbsp;
                              </span>
                              <span>{`${releaseDateRunTimeHelper(
                                val["release_date"],
                                val["runtime"]
                              )}`}</span>
                            </div>
                            <div className="horizontalStyle">
                              <span>{genresList(val["genres"])}</span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })
                )}
              </div>
              <button
                className="Left NavItem"
                disabled={disableScrolling}
                onClick={() => scrollOnAbsoluteButtonClick(-1250)}
              >
                <FontAwesomeIcon icon={faChevronLeft} size="2x" />
              </button>
              <button
                className="Right NavItem"
                disabled={disableScrolling}
                onClick={() => scrollOnAbsoluteButtonClick(-1250)}
              >
                <FontAwesomeIcon icon={faChevronRight} size="2x" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieComponent;
