import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Nav.css";

const Nav = ({ onSelectGenre }) => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("all");

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get("https://api.themoviedb.org/3/genre/movie/list?api_key=2dca580c2a14b55200e784d157207b4d");
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
    onSelectGenre(genreId);
  };

  return (
    <nav className="nav">
      <h1>Movie-ology</h1>
      <ul className="genre-list">
        <li>
          <button className={`genre-button ${selectedGenre === "all" ? "selected" : ""}`} onClick={() => handleGenreClick("all")}>
            All
          </button>
        </li>
        {genres.map((genre) => (
          <li key={genre.id}>
            <button className={`genre-button ${selectedGenre === genre.id ? "selected" : ""}`} onClick={() => handleGenreClick(genre.id)}>
              {genre.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
