
const express = require('express')
const movies = require('./data.json')
const app = express()
const port = 3001

app.get('/favorite', firstRoutHandler) ;
function firstRoutHandler(req,res){

    res.send("Welcome to Favorite Page");
 
}

app.get('/', moviesRoutHandler) ;
function moviesRoutHandler(req,res){
let arr = [];

    let mov = new movieCon(movies.title , movies.poster_path , movies.overview);
    arr.push(mov);



res.json(arr);
 
}
app.get('*', errHandler) ;
function errHandler(req,res){

    res.send("404 ERROR not found");
 
}


function movieCon(title , poster , overview){
    this.title = title;
    this. poster= poster;
    this.overview= overview;



}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})