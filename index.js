const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const { application } = require("express");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Dhanyam@123",
  database: "onito",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/v1/longest-duration-movies", (req, res) => {
  const sql =
    "select A.tconst, primaryTitle, runtimeMinutes , genres from movies A inner join ratings B on A.tconst=B.tconst order by runtimeMinutes desc  limit 10";
  db.query(sql, (err, result) => {
    res.send(result);
  });
});

app.get("/api/v1/top-rated-movies", (req, res) => {
  const sql =
    "select A.tconst, primaryTitle, genres , averageRating from movies A inner join ratings B on A.tconst=B.tconst where averageRating>6 order by averageRating";
  db.query(sql, (err, result) => {
    res.send(result);
  });
});

function RegistrationNumber() {
  return new Promise(async (resolve, reject) => {
    const sql = "select count(*) as count from movies";
    db.query(sql, (err, number) => {
      let count = number[0].count + 2;
      var result = "";
      for (var i = 7 - count.toString().length; i > 0; i--) {
        result += "0";
      }
      regno = "tt" + result + count;    
      resolve(regno);
    });
  });
}

app.post("/api/v1/new-movie", async (req, res) => {
  let regno =await  RegistrationNumber();
 console.log("Regis" + regno);

  const { titleType, primaryTitle, runtimeMinutes, genres } = req.body;

  const sql=`insert into movies(tconst,titleType, primaryTitle,runtimeMinutes,genres) values(?,?,?,?,?)`;
  db.query(sql,[regno,titleType, primaryTitle,runtimeMinutes,genres],(err,result)=>{
    console.log(err)
      if(!err)
       res.send("Success")

  })
});
//////////////////////

app.post("/api/post", (req, res) => {
  const { heading, description } = req.body;
  const sql = `insert into todo(heading,description) values(?,?)`;
  db.query(sql, [heading, description], (err, result) => {
    console.log("error" + err);
  });
});

app.delete("/api/remove/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = `delete from todo where id= ?`;
  db.query(sqlRemove, id, (err, result) => {
    console.log("error" + err);
  });
});

app.get("/api/get/:id", (req, res) => {
  const { id } = req.params;
  const sql = "select * from todo where id=?";
  db.query(sql, id, (err, result) => {
    res.send(result);
    if (err) console.log(err);
  });
});

app.put("/api/update/:id", (req, res) => {
  const { id } = req.params;
  const { heading, description, status, comment } = req.body;

  const sql =
    "update todo set heading=?,description=?,status=?,comment=? where id=?";
  db.query(sql, [heading, description, status, comment, id], (err, result) => {
    res.send(result);
    if (err) console.log(err);
  });
});

app.listen(5000, () => {
  console.log("Server is running on prt 5000");
});