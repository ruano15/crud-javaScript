const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const handleBars = require('express-handlebars');
const { rootCertificates } = require('tls');

const app = express();
const urlEncodeParser = bodyParser.urlencoded({extended:false});
const sql = mysql.createConnection({
    host: 'localHost',
    user: 'root',
    password: '941784',
    port: 3306
});
app.use('/img', express.static('img'));
app.use('/css',express.static('css'));
app.use('/js',express.static('js'));

sql.query("use crud");

//Template Engine
app.engine("handlebars", handleBars.engine({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//Routes and Templates
app.get("/", function(req,res){res.render('index');})
app.get("/inserir", function(req, res){res.render("inserir");});
app.post("/controllerForm", urlEncodeParser, function(req, res){
    sql.query("insert into user values (?,?,?)", [req.body.id, req.body.name, req.body.age]);
    res.render('controllerForm');
})
app.get("/select/:id?", function(req, res){
    if(!req.params.id){
    sql.query("select * from user", function(err, resultado){
        res.render('select', {data:resultado})
    });
    }else{
    sql.query("select * from user where id=?",[req.params.id], function(err, resultado){
        res.render('select', {data:resultado})
    })
}});
app.get('/deletar/:id',function(req,res){
    sql.query("delete from user where id=?",[req.params.id]);
    res.render('deletar');
});
app.get("/update/:id",function(req,res){
    sql.query("select * from user where id=?",[req.params.id],function(err,results,fields){
        res.render('update',{id:req.params.id,name:results[0].name,age:results[0].age});
    });
});
app.post("/controllerUpdate",urlEncodeParser,function(req,res){
   sql.query("update user set name=?,age=? where id=?",[req.body.name,req.body.age,req.body.id]);
   res.render('controllerUpdate');
});

//start server
app.listen(3000, function(req, res){console.log('servidor ativo!')})
