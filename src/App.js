import React, { useState } from "react";
import MovieList from "./Components/MovieList/MovieList";
import "./App.css";
import Nav from "./Components/Nav/Nav";

const App = () => {
  const [selectedGenre, setSelectedGenre] = useState("all");

  const handleSelectGenre = (genre) => {
    setSelectedGenre(genre);
  };

  return (
    <div className="app">
      <Nav onSelectGenre={handleSelectGenre} />
      <MovieList selectedGenre={selectedGenre} />
    </div>
  );
};

export default App;
