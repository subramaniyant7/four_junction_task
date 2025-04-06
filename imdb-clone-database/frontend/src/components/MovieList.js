import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography,
  Box,
  IconButton
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import movieStore from "../store/movieStore";

const MovieList = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    movieStore.fetchMovies();
  }, []);

  const handleEdit = (id) => {
    navigate(`/movies/edit/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      movieStore.deleteMovie(id);
    }
  };

  if (movieStore.loading && !movieStore.movies.length) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (movieStore.error) {
    return (
      <Typography color="error" align="center" mt={4}>
        Error: {movieStore.error}
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Year of Release</TableCell>
            <TableCell>Producer</TableCell>
            <TableCell>Actors</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movieStore.movies.map((movie) => (
            <TableRow key={movie.id}>
              <TableCell>{movie.name}</TableCell>
              <TableCell>{movie.year_of_release}</TableCell>
              <TableCell>{movie.producer?.name}</TableCell>
              <TableCell>
                {movie.actors?.map(actor => actor.name).join(", ")}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(movie.id)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(movie.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default MovieList;