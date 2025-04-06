import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Autocomplete,
  Chip,
  Grid,
  Paper
} from "@mui/material";
import movieStore from "../store/movieStore";

const MovieForm = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    movieStore.fetchActors();
    movieStore.fetchProducers();

    if (id) {
      setIsEditing(true);
      const movie = movieStore.movies.find(m => m.id === parseInt(id));
      if (movie) {
        formik.setValues({
          name: movie.name,
          year_of_release: movie.year_of_release,
          plot: movie.plot || "",
          poster: movie.poster || "",
          producer: movie.producer || { id: "", name: "" },
          actors: movie.actors || []
        });
      }
    }
  }, [id]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    year_of_release: Yup.number()
      .required("Year of release is required")
      .min(1888, "Year must be after 1888")
      .max(new Date().getFullYear() + 5, `Year must be before ${new Date().getFullYear() + 5}`),
    plot: Yup.string(),
    poster: Yup.string().url("Must be a valid URL"),
    producer: Yup.object().shape({
      name: Yup.string().required("Producer name is required")
    }),
    actors: Yup.array().min(1, "At least one actor is required")
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      year_of_release: "",
      plot: "",
      poster: "",
      producer: { id: "", name: "" },
      actors: []
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const movieData = {
          name: values.name,
          year_of_release: values.year_of_release,
          plot: values.plot,
          poster: values.poster,
          producer: values.producer.id 
            ? { id: values.producer.id } 
            : { name: values.producer.name },
          actors: values.actors.map(actor => 
            actor.id ? { id: actor.id } : { name: actor.name }
          )
        };

        if (isEditing) {
          await movieStore.updateMovie(id, movieData);
        } else {
          await movieStore.createMovie(movieData);
        }
        navigate("/");
      } catch (error) {
        console.error("Error saving movie:", error);
      }
    }
  });

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        {isEditing ? "Edit Movie" : "Add New Movie"}
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Movie Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="year_of_release"
              name="year_of_release"
              label="Year of Release"
              type="number"
              value={formik.values.year_of_release}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.year_of_release && Boolean(formik.errors.year_of_release)}
              helperText={formik.touched.year_of_release && formik.errors.year_of_release}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="poster"
              name="poster"
              label="Poster URL"
              value={formik.values.poster}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.poster && Boolean(formik.errors.poster)}
              helperText={formik.touched.poster && formik.errors.poster}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="plot"
              name="plot"
              label="Plot"
              multiline
              rows={4}
              value={formik.values.plot}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.plot && Boolean(formik.errors.plot)}
              helperText={formik.touched.plot && formik.errors.plot}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              id="producer"
              options={movieStore.producers}
              getOptionLabel={(option) => option.name}
              freeSolo
              value={formik.values.producer}
              onChange={(event, newValue) => {
                formik.setFieldValue(
                  "producer",
                  typeof newValue === "string" 
                    ? { name: newValue } 
                    : newValue || { name: "" }
                );
              }}
              onBlur={() => formik.setFieldTouched("producer", true)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Producer"
                  error={formik.touched.producer && Boolean(formik.errors.producer?.name)}
                  helperText={formik.touched.producer && formik.errors.producer?.name}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              id="actors"
              options={movieStore.actors}
              getOptionLabel={(option) => option.name}
              freeSolo
              value={formik.values.actors}
              onChange={(event, newValue) => {
                formik.setFieldValue(
                  "actors",
                  newValue.map(value => 
                    typeof value === "string" ? { name: value } : value
                  )
                );
              }}
              onBlur={() => formik.setFieldTouched("actors", true)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Actors"
                  error={formik.touched.actors && Boolean(formik.errors.actors)}
                  helperText={formik.touched.actors && formik.errors.actors}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option.id || option.name}
                    label={option.name}
                    {...getTagProps({ index })}
                  />
                ))
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button 
                variant="outlined" 
                onClick={() => navigate("/")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={movieStore.loading}
              >
                {movieStore.loading ? (
                  <CircularProgress size={24} />
                ) : isEditing ? (
                  "Update Movie"
                ) : (
                  "Add Movie"
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
});

export default MovieForm;