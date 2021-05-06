const express = require('express');
var mysql = require('mysql');
const app = express();
const port = 3000;


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: 'kata_dasar'
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}


app.get('/', (req, res) => {
    res.send('Hello World, from express');
});

function checkWordLength(word)
{
    return word.length > 3;
}

function noWhiteSpace(s) {
    return s.indexOf(' ') <= 0;
  }

app.get('/ambil-kata-acak', (req, res) => {
    con.query('select katadasar from tb_katadasar', function (err, result) {
        var words = []
        var parsed_result = JSON.parse(JSON.stringify(result))

        for(let i =0; i<parsed_result.length; i++)
        {
            words.push(parsed_result[i].katadasar)
        }
        words = words.filter(noWhiteSpace)
        words = words.filter(checkWordLength)
        var rand = Math.floor(Math.random() * words.length -1);
        if (err) {
            res.send({
                'status': 404,
                'response': 'kata tidak ditemukan'
            });
            return;
        }
        res.send({
            'status': 200,
            'response': words[rand]
        });
    });
});

app.get('/cari-kata/:kata', (req, res) => {
    var kata = req.params.kata;
    var sql = "";
    if (kata.length <= 3) {
        res.send({
            'status': 503,
            'response': 'kata harus terdiri diatas tiga huruf'
        });
        return;
    }
    else {
        sql = 'select katadasar from tb_katadasar where katadasar = ?';
        con.query(sql, [kata], function (err, result) {
            if (err) {
                res.send({
                    'status': 404,
                    'response': 'kata tidak ditemukan'
                });
                return;
            }

            res.send({
                'status': 200,
                'response': 'kata ditemukan : ' + kata
            });
        });
    }



});

app.listen(port, () => {
    console.log(`app listening on port ${port}!`);
});