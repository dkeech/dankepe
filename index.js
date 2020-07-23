var express = require('express');
var mysql = require('./dbcon.js');
var CORS = require("cors")

var app = express();
app.set('port', 1776);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(CORS());

const getAllBrandsQuery = 'SELECT * FROM brands';
const getAllCustomersQuery = 'SELECT * FROM customers';
const insertBrandQuery = "INSERT INTO brands (`brandname`) VALUES (?)";
const insertCustomerQuery = "INSERT INTO customers (`firstname`, `lastname`, `email`, `street_address`, `city`, `state`, `zip`) VALUES (?,?,?,?,?,?,?)";
const updateBrandQuery = "UPDATE brands SET brandname=? WHERE brandid=?" ;
const updateCustomerQuery = "UPDATE customers SET firstname=?, lastname=?, email=?, street_address=?, city=?, state=?, zip=? WHERE customerid=? ";
const deleteBrandQuery= "DELETE FROM brands WHERE brandid=?";
const deleteCustomerQuery= "DELETE FROM customers WHERE customerid=?";
const dropTableBrandsQuery = "DROP TABLE IF EXISTS brands";
const dropTableCustomersQuery = "DROP TABLE IF EXISTS customers";
const makeBrandsTableQuery= "CREATE TABLE brands(brandid INT AUTO_INCREMENT NOT NULL, brandname VARCHAR(50) NOT NULL UNIQUE, PRIMARY KEY(brandid));";
const makeCustomersTableQuery = "CREATE TABLE customers(customerid INT AUTO_INCREMENT, firstname VARCHAR(50) NOT NULL, lastname VARCHAR(50) NOT NULL, email VARCHAR(50) NOT NULL, street_address VARCHAR(50) NOT NULL, city VARCHAR(50) NOT NULL, state VARCHAR(50) NOT NULL, zip VARCHAR(50) NOT NULL, PRIMARY KEY(customerid))";

// Unit of 0 is lbs, unit of 1 is kg


const GetTable = (res) => {
  mysql.pool.query(getAllQuery, (err, rows, fields) => {
    if(err){
      next(err);
      return;
    }
    res.json({rows: rows});
  })
}

const GetBrands = (res) => {
  mysql.pool.query(getAllBrandsQuery, (err, rows, fields) => {
    if(err){
      next(err);
      return;
    }
    res.json({rows: rows});
  })
}

const GetCustomers = (res) => {
  mysql.pool.query(getAllCustomersQuery, (err, rows, fields) => {
    if(err){
      next(err);
      return;
    }
    res.json({rows: rows});
  })
}

app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query(getAllQuery, (err, rows, fields) => {
    if(err){
      next(err);
      return;
    }
    res.json({rows: rows});
  });
});

app.get('/brands',function(req,res,next){
  var context = {};
  mysql.pool.query(getAllBrandsQuery, (err, rows, fields) => {
    if(err){
      next(err);
      return;
    }
    res.json({rows: rows});
  });
});

app.get('/customers',function(req,res,next){
  var context = {};
  mysql.pool.query(getAllCustomersQuery, (err, rows, fields) => {
    if(err){
      next(err);
      return;
    }
    res.json({rows: rows});
  });
});


app.post('/',function(req,res,next){
  var {name, reps, weight, unit, date} = req.body;
  mysql.pool.query(insertQuery, [name, reps, weight, unit, date], (err, result) => {
    if(err){
      next(err);
      return;
    }
    GetTable(res);
  });
});

app.post('/brands',function(req,res,next){
  var {brandname} = req.body;
  mysql.pool.query(insertBrandQuery, [brandname], (err, result) => {
    if(err){
      next(err);
      return;
    }
    GetBrands(res);
  });
});

app.post('/customers',function(req,res,next){
  var {firstname, lastname, email, street_address, city, state, zip} = req.body;
  mysql.pool.query(insertCustomerQuery, [firstname, lastname, email, street_address, city, state, zip], (err, result) => {
    if(err){
      next(err);
      return;
    }
    GetCustomers(res);
  });
});


app.delete('/',function(req,res,next){
  var {id} = req.body;
  mysql.pool.query(deleteQuery, [id], (err, result) => {
    if(err){
      next(err);
      return;
    }
    GetTable(res);
  });
});

app.delete('/brands',function(req,res,next){
  var {brandid} = req.body;
  mysql.pool.query(deleteBrandQuery, [brandid], (err, result) => {
    if(err){
      next(err);
      return;
    }
    GetBrands(res);
  });
});

app.delete('/customers',function(req,res,next){
  var {customerid} = req.body;
  mysql.pool.query(deleteCustomerQuery, [customerid], (err, result) => {
    if(err){
      next(err);
      return;
    }
    GetCustomers(res);
  });
});


///simple-update
app.put('/',function(req,res,next){
  var {name, reps, weight, unit, date, id} = req.body;
  mysql.pool.query(updateQuery,
    [name, reps, weight, unit, date, id], (err, result) => {
    if(err){
      next(err);
      return;
    }
    GetTable(res);
  });
});

///simple-update brands
app.put('/brands',function(req,res,next){
  var {brandname, brandid} = req.body;
  mysql.pool.query(updateBrandQuery,
    [brandname, brandid], (err, result) => {
    if(err){
      next(err);
      return;
    }
    GetBrands(res);
  });
});

///simple-update brands
app.put('/customers',function(req,res,next){
  var {firstname, lastname, email, street_address, city, state, zip, customerid} = req.body;
  mysql.pool.query(updateCustomerQuery,
    [firstname, lastname, email, street_address, city, state, zip, customerid], (err, result) => {
    if(err){
      next(err);
      return;
    }
    GetCustomers(res);
  });
});


app.get('/reset-table',function(req,res,next){
  mysql.pool.query(dropTableQuery, function(err){
    mysql.pool.query(makeTableQuery, function(err){
      res.send("table reset to default");
    })
  });
});

app.get('/brands/reset-brands',function(req,res,next){
  mysql.pool.query(dropTableBrandsQuery, function(err){
    mysql.pool.query(makeBrandsTableQuery, function(err){
      res.send("brands table reset to default");
    })
  });
});

app.get('/customers/reset-customers',function(req,res,next){
  mysql.pool.query(dropTableCustomersQuery, function(err){
    mysql.pool.query(makeCustomersTableQuery, function(err){
      res.send("customers table reset to default");
    })
  });
});




app.use(function(req,res){
  res.status(404);
  res.send('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.send('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
