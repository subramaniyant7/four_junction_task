import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { Button, Container, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MovieList from "../components/MovieList";
import movieStore from "../store/movieStore";

const HomePage = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    movieStore.fetchMovies();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Movie Database
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate("/movies/add")}
        >
          Add New Movie
        </Button>
      </Box>
      <MovieList />
    </Container>
  );
});

export default HomePage;