const express=require('express');
const bodyParser=require('body-parser');
const mysql=require('mysql');
var app=express();
const cors=require('cors');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(express.json());

const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"karmegam"
});
app.get('/',(req,res)=>
{
const sql="SELECT * FROM employee";
db.query(sql,(err,data)=>{
    if(err) throw err;
    console.log(data);
    res.json(data);
})
})

    app.post('/create',(req,res)=>{

        const sql = "INSERT INTO employee (`Name`, `Age`, `Position`, `Place`, `Date`) VALUES (?, ?, ?, ?, ?)";
        db.query(sql,[req.body.name,req.body.age,req.body.position,req.body.place,req.body.date],(err,data)=>{
            if(err) throw err;
            // console.log(data);
            console.log("Employee added successfully");
            res.json(data);
        })
        })

        app.put('/update/:id', (req, res) => {
            const employeeId = req.params.id;
            const { name, age, position, place, date } = req.body;
          
            const sql = "UPDATE employee SET `Name` = ?, `Age` = ?, `Position` = ?, `Place` = ?, `Date` = ? WHERE `ID` = ?";
            
            db.query(sql, [name, age, position, place, date, employeeId], (err, data) => {
              if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
              } else {
                console.log("Employee updated successfully");
                res.json(data);
              }
            });
          });
          app.delete('/deleteStudent/:id', (req, res) => {
            const employeeId = req.params.id;
          
            const sql = "delete from employee where ID=?";
            
            db.query(sql, [employeeId], (err, data) => {
              if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
              } else {
                console.log("Employee deleted successfully");
                res.json(data);
              }
            });
          });
          
app.listen(5000,()=>{
    console.log('Server started at port:5000');
})