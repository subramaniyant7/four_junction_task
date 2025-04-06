const db = require("../models");
const Movie = db.movies;
const Actor = db.actors;
const Producer = db.producers;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      message: "Movie name can not be empty!"
    });
  }

  const transaction = await db.sequelize.transaction();

  try {
    let producer;
    if (req.body.producer.id) {
      producer = await Producer.findByPk(req.body.producer.id, { transaction });
    } else {
      producer = await Producer.create(req.body.producer, { transaction });
    }

    const movie = {
      name: req.body.name,
      year_of_release: req.body.year_of_release,
      plot: req.body.plot,
      poster: req.body.poster,
      producer_id: producer.id
    };

    const createdMovie = await Movie.create(movie, { transaction });

    // Handle actors
    if (req.body.actors && req.body.actors.length > 0) {
      const actorPromises = req.body.actors.map(async actorData => {
        let actor;
        if (actorData.id) {
          actor = await Actor.findByPk(actorData.id, { transaction });
        } else {
          actor = await Actor.create(actorData, { transaction });
        }
        return actor;
      });

      const actors = await Promise.all(actorPromises);
      await createdMovie.setActors(actors.map(a => a.id), { transaction });
    }

    await transaction.commit();

    const result = await Movie.findByPk(createdMovie.id, {
      include: [
        { model: Producer, as: "producer" },
        { model: Actor, as: "actors" }
      ]
    });

    res.send(result);
  } catch (err) {
    await transaction.rollback();
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Movie."
    });
  }
};

exports.findAll = (req, res) => {
  Movie.findAll({
    include: [
      { model: Producer, as: "producer" },
      { model: Actor, as: "actors" }
    ],
    order: [['year_of_release', 'DESC']]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving movies."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Movie.findByPk(id, {
    include: [
      { model: Producer, as: "producer" },
      { model: Actor, as: "actors" }
    ]
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Movie with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Movie with id=" + id
      });
    });
};


exports.update = async (req, res) => {
  const id = req.params.id;

  const transaction = await db.sequelize.transaction();

  try {
    const movie = await Movie.findByPk(id, { transaction });
    if (!movie) {
      await transaction.rollback();
      return res.status(404).send({
        message: `Cannot update Movie with id=${id}. Movie was not found!`
      });
    }

    let producer;
    if (req.body.producer.id) {
      producer = await Producer.findByPk(req.body.producer.id, { transaction });
    } else {
      producer = await Producer.create(req.body.producer, { transaction });
    }

    await movie.update({
      name: req.body.name,
      year_of_release: req.body.year_of_release,
      plot: req.body.plot,
      poster: req.body.poster,
      producer_id: producer.id
    }, { transaction });

    if (req.body.actors && req.body.actors.length > 0) {
      const actorPromises = req.body.actors.map(async actorData => {
        let actor;
        if (actorData.id) {
          actor = await Actor.findByPk(actorData.id, { transaction });
        } else {
          actor = await Actor.create(actorData, { transaction });
        }
        return actor;
      });

      const actors = await Promise.all(actorPromises);
      await movie.setActors(actors.map(a => a.id), { transaction });
    }

    await transaction.commit();

    const result = await Movie.findByPk(id, {
      include: [
        { model: Producer, as: "producer" },
        { model: Actor, as: "actors" }
      ]
    });

    res.send(result);
  } catch (err) {
    await transaction.rollback();
    res.status(500).send({
      message: "Error updating Movie with id=" + id
    });
  }
};


exports.delete = (req, res) => {
  const id = req.params.id;

  Movie.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Movie was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Movie with id=${id}. Maybe Movie was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Movie with id=" + id
      });
    });
};