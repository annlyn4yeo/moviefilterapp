import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import MovieCard from "../MovieCard/MovieCard";
import "./MovieList.css";

const MovieList = ({ selectedGenre }) => {
  const [sections, setSections] = useState({ 2012: { year: 2012, movies: [] } });
  const [currentYear, setCurrentYear] = useState(2012);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  const handleObserver = (entries) => {
    const target = entries[0];
    if (target.isIntersecting && !loading) {
      const nextYear = currentYear + 1;
      if (nextYear <= 2023 && !sections[nextYear]) {
        setCurrentYear(nextYear);
        fetchMovies(nextYear);
      }
    } else if (target.isIntersecting && !loading && currentYear > 2011) {
      const prevYear = currentYear - 1;
      if (!sections[prevYear]) {
        setCurrentYear(prevYear);
        fetchMovies(prevYear);
      }
    }
  };

  const fetchMovies = async (year) => {
    try {
      setLoading(true);
      const genreFilter = selectedGenre ? `&with_genres=${selectedGenre}` : "";

      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=2dca580c2a14b55200e784d157207b4d&sort_by=popularity.desc&primary_release_year=${year}&page=1&vote_count.gte=100${genreFilter}`
      );

      setSections((prevSections) => {
        const updatedSections = { ...prevSections };
        updatedSections[year] = { year, movies: response.data.results.filter((movie) => movie.vote_count >= 100) };
        return updatedSections;
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading, sections, currentYear, selectedGenre]);

  useEffect(() => {
    const fetchAllMovies = async () => {
      const years = Object.keys(sections);
      const updatedSections = {};

      for (const year of years) {
        await fetchMovies(year);
      }
    };

    fetchAllMovies();
  }, [selectedGenre]);

  return (
    <div className="movie-list">
      {Object.values(sections).map((section) => (
        <div key={section.year} className={`year-section ${section.year === currentYear ? "current-year" : ""}`}>
          <h2>
            Top Movies for <span>{section.year}</span>
          </h2>
          <div className="container-outer">
            <div className="movie-container">
              {section.movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        </div>
      ))}
      {loading && <p className="loading">Loading...</p>}
      <div ref={loaderRef} style={{ height: "20px" }}></div>
    </div>
  );
};

export default MovieList;
