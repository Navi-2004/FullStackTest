const express=require('express');
const bodyParser=require('body-parser');
const mysql=require('mysql');
var app=express();
const dotenv=require("dotenv")
const cors=require('cors');
const { Pool } = require('pg');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(express.json());
dotenv.config()

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  ssl:{
    rejectUnauthorized:false,
  },
  sslmode:'require',

});
app.get('/', (req, res) => {
  const sql = "SELECT * FROM employee";
  pool.query(sql, (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Internal Server Error');
      } else {
          console.log(result.rows);
          res.json(result.rows);
      }
  });
});

app.post('/create', (req, res) => {
  const sql = "INSERT INTO employee (name, age, position, place, date) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  
  const values = [req.body.name, req.body.age, req.body.position, req.body.place, req.body.date];

  pool.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Internal Server Error');
      } else {
          console.log("Employee added successfully");
          res.json(result.rows);
      }
  });
});


app.put('/update/:id', (req, res) => {
  const id = req.params.id;
  const { name, age, position, place, date } = req.body;

  const sql = 'UPDATE employee SET name = $1, age = $2, position = $3, place = $4, date = $5 WHERE id = $6 RETURNING *';

  const values = [name, age, position, place, date, id];

  pool.query(sql, values, (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          if (result.rowCount === 0) {
              res.status(404).json({ error: 'Employee not found' });
          } else {
              console.log("Employee updated successfully");
              res.json(result.rows);
          }
      }
  });
});
app.delete('/deleteStudent/:id', (req, res) => {
  const employeeId = req.params.id;

  const sql = 'DELETE FROM employee WHERE id = $1 RETURNING *';

  pool.query(sql, [employeeId], (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          if (result.rowCount === 0) {
              res.status(404).json({ error: 'Employee not found' });
          } else {
              console.log("Employee deleted successfully");
              res.json(result.rows);
          }
      }
  });
});

process.on('exit', () => {
  pool.end();
});
app.listen(5000,()=>{
    console.log('Server started at port:5000');
})