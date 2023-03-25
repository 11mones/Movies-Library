'use stict'
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const app = express()
const movieData = require('./data.json');
app.use(cors());
const PORT = process.env.PORT;
const apiKey = process.env.API_KEY


// creating a constructor for movies
function Movies(title, poster, overview) {
    this.title = title;
    this.poster = poster;
    this.overview = overview;
}

//creating a constructor for Popular movies
function Popular(title, overview, releaseDate, vote) {
    this.title = title;
    this.overview = overview;
    this.releaseDate = releaseDate;
    this.vote = vote;
}

//creating a constructor for Trending movies 
function Trending(id, title, releaseDate, poster, overview) {
    this.id = id;
    this.title = title;
    this.releaseDate = releaseDate;
    this.poster = poster;
    this.overview = overview;
}

//creating top rated Tv-Shows constructor
function TV(name, originCountry, lang, vote, overview) {
    this.name = name;
    this.originCountry = originCountry;
    this.lang = lang;
    this.vote = vote;
    this.overview = overview;
}


app.get('/favorite', favoritePageHandler);
app.get('/', homePageHandler);
app.get('/trending', trendingPageHandler);
app.get('/search', searchHandler);
app.get('/popular', popularHandler);
app.get('/top-rated-tv-shows', tvShowsHandler);
app.get('*', handleNotFoundErr);



function tvShowsHandler(req, res) {
    let url = `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}&language=en-US&page=1`;
    axios.get(url)
        .then((result) => {
            console.log(result.data.results);
            let shapedData = result.data.results.map((topRated) => {
                return new TV(topRated.name, topRated.origin_country, topRated.original_language, topRated.vote_average, topRated.overview)
            })
            res.json(shapedData);
        })
        .catch((err) => { console.log(err); })
}

function popularHandler(req, res) {
    let url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
    axios.get(url)
        .then((result) => {
            let shapedData = result.data.results.map((popular) => {
                return new Popular(popular.title, popular.overview, popular.release_date, popular.vote_average);
            })
            res.json(shapedData);
        })
        .catch((err) => {
            console.log(err);
        })
}

function searchHandler(req, res) {
    let clientRequest = req.query.title;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${clientRequest}&page=2`;
    axios.get(url)
        .then((result) => {
            let requestedMovie = result.data.results.map((movies) => {
                return new Movies(movies.title, movies.poster_path, movies.overview)
            })
            res.json(requestedMovie);
        })
        .catch((err) => {
            console.log(err);
        })
}

function trendingPageHandler(req, res) {
    let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`;
    axios.get(url)
        .then((result) => {
            let shapedData = result.data.results.map((movies) => {
                //The data from the API database for certain movies has {name} instead of {title} tried to use 'key' in 'obj' check but it did not work  
                if ('name' in movies) {
                    return new Trending(movies.id, movies.name, movies.release_date, movies.poster_path, movies.overview)
                }
                if ('title' in movies) {
                    return new Trending(movies.id, movies.title, movies.release_date, movies.poster_path, movies.overview)
                }
            })
            res.json(shapedData);
        })
        .catch((err) => {
            console.log(err);
        })

}

function favoritePageHandler(req, res) {
    res.send("Welcome to Favorite Page");
}


function homePageHandler(req, res) {
    // res.send("Welcome to Home Page!");
    //res.json(movieData);
    let result = [];
    let newMovie = new Movies(movieData.title, movieData.poster_path, movieData.overview);
    result.push(newMovie);
    res.send(result);
}

//Handle 404 Error
function handleNotFoundErr(req, res) {
    res.status(404).send("Not Found");
}

//Handle 500 Error
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send({
        status: 500,
        responseText: 'Sorry, something went wrong'
    });
});



//run the server and make it listen all the time to port 3000
app.listen(PORT, () => {
    console.log(`the server is listening to port ${PORT}`);
})