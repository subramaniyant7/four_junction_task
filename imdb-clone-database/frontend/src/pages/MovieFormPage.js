import React from "react";
import { Container } from "@mui/material";
import MovieForm from "../components/MovieForm";

const MovieFormPage = () => {
  return (
    <Container maxWidth="md">
      <MovieForm />
    </Container>
  );
};

export default MovieFormPage;