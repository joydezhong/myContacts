var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'public'));
app.engine('html',require('pug').__express)
app.set('view engine', 'html');

//contact DB
var databaseUrl = 'mongodb://localhost:27017/contacts';
var mongojs = require('mongojs');
var db = mongojs(databaseUrl,['contactList']);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());


app.get('/contactList',function(req,res){
    db.contactList.find(function(err,docs){
        console.log(docs);
        res.json(docs);
    });
});

app.post('/contactList',function (req,res) {
    console.log("this is a post request");
    console.log(req.body);
    db.contactList.insert(req.body,function(err,doc){
        res.json(doc);
    })
});

app.delete('/contactList/:id',function(req,res){
    var id = req.params.id;
    console.log(id);
    db.contactList.remove({_id: mongojs.ObjectId(id)},function(err,doc){
        res.json(doc);
    })
})

app.get('/contactList/:id',function(req, res){
    var id = req.params.id;
    console.log(id);
    db.contactList.findOne({_id: mongojs.ObjectId(id)},function(err,doc){
        res.json(doc);
    })
});

app.put('/contactList/:id',function(req,res){
    var id = req.params.id;
    console.log(req.body.name);

    db.contactList.findAndModify(
        {
            query:{_id: mongojs.ObjectId(id)},
            update:{$set: {name: req.body.name, email: req.body.email, number: req.body.number, role: req.body.role}},
            new: true
        },function(err,doc){
            res.json(doc);
        });

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
