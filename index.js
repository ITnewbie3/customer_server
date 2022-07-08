const express = require("express");
const cors = require('cors')
const app = express();
const port = 3001;
const mysql = require('mysql');
const fs = require("fs") // 파일을 읽어오도록 해줌

const dbinfo = fs.readFileSync('./database.json');
//받아온 json데이터를 객체형태로 변경 JSON.parse
const conf = JSON.parse(dbinfo)

// connection mysql연결 createConnection()
// connection.connect() 연결하기
// connection.end() 연결종료
// connection.query('쿼리문', callback함수)
// callback(error, result, result의 field정보)

const connection = mysql.createConnection({
    host:conf.host,
    user:conf.user,
    password:conf.password,
    port:conf.port,
    database:conf.database
})

app.use(express.json());
app.use(cors());

app.get('/customers', async (req,res) => {
    connection.query(
        "select * from customers_table",
        (err,rows,fields)=>{
            res.send(rows);
        }
    )
})
app.get('/customer/:id', async (req,res) => {
    const params = req.params;
    connection.query(
        `select * from customers_table where no = ${params}`,
        (err,rows,fields)=>{
            res.send(rows);
        }
    )
})
app.post('/createcustom', async (req,res) => {
      const body = req.body;
      connection.query(
        "insert into customers_table (`name`, `phone`, `birth`, `gender`, `add1`, `add2`) value(?,?,?,?,?,?)", 
        [body.c_name,body.c_phone,body.c_birth,body.c_gender,body.c_add,body.c_adddetail],
        (err,rows,fields)=>{
            if (err) {
            console.log("DB저장 실패");
            }else{
            console.log("DB저장 성공");
            };
        }
      )
})    
    // connection.end();

//서버실행
app.listen(port, () => {
    console.log("서버 동작 중")
})