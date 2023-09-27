const db = require('../database/models');
const moment = require('moment');
const {validationResult} = require('express-validator');

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', { movies, title:'Listado de peliculas' })
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', { movie, title:'Detalle de pelicula' });
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order: [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', { movies, title:'Estrenos' });
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: { [db.Sequelize.Op.gte]: 8 }
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', { movies, title:'Recomendadas' });
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        return res.render('moviesAdd', {title:'Agregar una pelicula'})
    },
    create: function (req, res) {

        const errors = validationResult(req);

        if(errors.isEmpty()){
            const { title, rating, awards, release_date, length } = req.body
            db.Movie.create({
                title: title.trim(),
                rating,
                awards,
                release_date,
                length
            })
                .then(movie => {
                    console.log(movie);
                    return res.redirect('/movies')
                })
                .catch(error => console.log(error))
        } else{
            return res.render('moviesAdd',{
                errors: errors.mapped(),
                old: req.body,
                title:'Agregar una pelicula'
            })
        }

       
    },
    edit: function (req, res) {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                console.log();
                return res.render('moviesEdit', {
                    Movie: movie,
                    moment,
                    title:'Editar pelicula'
                })
            })
            .catch(error => console.log(error))

    },
    update: function (req, res) {
        const { title, rating, awards, release_date, length } = req.body

        db.Movie.update(
            {
                title: title.trim(),
                rating,
                awards,
                release_date,
                length
            },
            {
                where: {
                    id: req.params.id
                }
            })
            .then(response => {
                console.log(response);
                db.Movie.findByPk(req.params.id)
                    .then(movie => {
                        return res.render('moviesDetail', { movie, title:'Editar pelicula' })
                    })
            })
            .catch(error => console.log(error))
    },
    delete: function (req, res) {
        db.Movie.findByPk(req.params.id)
            .then((movie) => {
                return res.render('moviesDelete', {
                    movie,
                    title:'Eliminar pelicula'
                })
            })
            .catch(error => console.log(error))
    },
    destroy: function (req, res) {
        db.ActorMovie.destroy({
            where: {
                movie_id: req.params.id
            }
        })
            .then(() => {
                db.Actor.update(
                    {
                        favorite_movie_id: null
                    },
                    {
                        where: {
                            favorite_movie_id: req.params.id
                        }
                    }
                )
                    .then(() => {
                        db.Movie.destroy({
                            where: {
                                id: req.params.id
                            }
                        })
                            .then(() => {
                                return res.redirect('/movies' , {title:'Listado de peliculas'})
                            })
                    })
            })

            .catch(error => console.log(error))
    }

}

module.exports = moviesController;