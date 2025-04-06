import { makeAutoObservable } from "mobx";
import axios from "axios";

class MovieStore {
  movies = [];
  actors = [];
  producers = [];
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchMovies() {
    this.loading = true;
    try {
      const response = await axios.get(`${backendServer}/movies`);
      this.movies = response.data;
      this.error = null;
    } catch (err) {
      this.error = err.response?.data?.message || err.message;
    } finally {
      this.loading = false;
    }
  }

  async fetchActors() {
    try {
      const response = await axios.get(`${backendServer}/actors`);
      this.actors = response.data;
    } catch (err) {
      this.error = err.response?.data?.message || err.message;
    }
  }

  async fetchProducers() {
    try {
      const response = await axios.get(`${backendServer}/producers`);
      this.producers = response.data;
    } catch (err) {
      this.error = err.response?.data?.message || err.message;
    }
  }


  async createMovie(movieData) {
    this.loading = true;
    try {
      const response = await axios.post(`${backendServer}/movies`, movieData);
      this.movies.push(response.data);
      this.error = null;
      return response.data;
    } catch (err) {
      this.error = err.response?.data?.message || err.message;
      throw err;
    } finally {
      this.loading = false;
    }
  }

  async updateMovie(id, movieData) {
    this.loading = true;
    try {
      const response = await axios.put(`${backendServer}/${id}`, movieData);
      const index = this.movies.findIndex(movie => movie.id === id);
      if (index !== -1) {
        this.movies[index] = response.data;
      }
      this.error = null;
      return response.data;
    } catch (err) {
      this.error = err.response?.data?.message || err.message;
      throw err;
    } finally {
      this.loading = false;
    }
  }

  async deleteMovie(id) {
    this.loading = true;
    try {
      await axios.delete(`${backendServer}/${id}`);
      this.movies = this.movies.filter(movie => movie.id !== id);
      this.error = null;
    } catch (err) {
      this.error = err.response?.data?.message || err.message;
    } finally {
      this.loading = false;
    }
  }
}

const movieStore = new MovieStore();
export default movieStore;