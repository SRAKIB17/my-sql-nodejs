const express = require('express');
const csvtojson = require('csvtojson');

const app = express()

const csv = require('fast-csv')
const mysql = require('mysql');

app.use(express.static('./public'))
app.use(express.json())
require('dotenv').config()

const database = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.password,
    port: 3306,
    // database: 'world'
    database: "movie_details"
})

database.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }

    console.log('Connected to the MySQL server.');

    database.connect(function (err) {
        if (err) {
            console.log(err.message)
        };
        // FOR Database Create
        // database.query("CREATE DATABASE movie_details", function (err, result) {
        //     if (err) {
        //         console.log(err.message)
        //     };
        //     console.log("Database created");
        // });

        // const sql = "CREATE TABLE ratings (tconst CHAR(10), averageRating VARCHAR(255), numVotes int)";
        // // // var sql = "ALTER TABLE customers ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY";

        // database.query(sql, function (err, result) {
        //     if (err) {
        //         console.log(err.message)
        //     };
        //     console.log("Table created");
        // });



        // let query = `insert into customers (${cols.toString()}) values (${(inputs).join(',')})`;
        // const query = 'ALTER TABLE movies RENAME COLUMN runTime TO runtimeMinutes; '

        // database.query(query, function (err, result) {
        //     if (err) {
        //         console.log(err.message)
        //     }
        //     console.log(result)
        // });

        // const file = 'csv/ratings.csv'

        // csvtojson().fromFile(file).then(source => {
        //     for (let k in source) {
        //         const aa = {}
        //         const newArr = (Object.values(source[k]));
        //         const keys = Object.keys(source[k])

        //         const getJson = JSON.stringify((newArr))

        //         let query = `insert into ratings (${keys.toString()}) values (${getJson.slice(1, getJson.length - 1)})`;


        //         database.query(query, function (err, result) {
        //             if (err) {
        //                 console.log(err.message)
        //             }
        //             console.log(result)
        //         });


        //     }

        // })

        app.get('/api/v1/longest-duration-movies', (req, res) => {
            const sql = `SELECT * FROM movies ORDER BY runtimeMinutes DESC LIMIT 10`

            database.query(sql, function (err, result, fields) {
                if (err) {
                    console.log(err)
                }
                res.send(result)
            });


        })

        app.get('/api/v1/movies', (req, res) => {
            const sql = `SELECT * FROM movies`

            database.query(sql, function (err, result, fields) {
                if (err) {
                    console.log(err)
                }
                res.send(result)
            });


        })
        app.get('/api/v1/top-rated-movies', (req, res) => {
            const sql = `SELECT * FROM ratings WHERE averageRating > 6.0 ORDER BY averageRating`

            database.query(sql, function (err, result, fields) {
                if (err) {
                    console.log(err)
                }
                res.send(result)
            });


        })

        app.post('/api/v1/new-movie', (req, res) => {
            // const sql = `SELECT * FROM ratings WHERE averageRating > 6.0 ORDER BY averageRating`
            console.log(req.body)
            const cols = []
            const inputs = []
            for (const key in req.body) {
                cols.push(key);
                inputs.push(`"${req.body[key]}"`)
            }
            let query = `insert into movies (${cols.toString()}) values (${inputs.join(',')})`;


            database.query(query, function (err, result) {
                if (err) {
                    console.log(err.message)
                }
                if (result.affectedRows) {
                    res.send("success")
                }
                else {
                    res.send('something is wrong')
                }
            });





        })

    })
})

const port = process.env.PORT || 5001;


app.listen(port, () => {
    console.log(port)
})