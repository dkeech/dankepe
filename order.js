module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getCustomers(res, mysql, context, complete){
      mysql.pool.query('SELECT customerid, firstname, lastname FROM customers', function(error, results, fields){;
        if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
        context.customers = results;
        complete();
    });
  }

    function getBrands(res, mysql, context, complete){
      mysql.pool.query('SELECT brandid, brandname FROM brands', function(error, results, fields){
        if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
        context.brands = results;
        complete();
      });
    }

    function getYears(res, mysql, context, complete){
      mysql.pool.query('SELECT DISTINCT modelyear FROM products', function(error, results, fields){
        if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
        context.years = results;
        complete();
      });
    }


    function getModels(res, mysql, context, complete){
      mysql.pool.query('SELECT model, price FROM products', function(error, results, fields){
        if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
        context.models = results;
        complete();
      });
      }
    
    function getVehicles(res, mysql, context, complete){
      mysql.pool.query('SELECT p.productid, p.modelyear, b.brandname, p.model, p.price FROM products p INNER JOIN brands b ON p.brandid = b.brandid', function(error, results, fields){
        if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
        context.vehicles = results;
      })
    }
    
    function getNextOrderId(res, mysql, context, complete){
      mysql.pool.query('SELECT orderid FROM orders LIMIT 1', function(error, results, fields){
        if(error){
          res.write(JSON.stringify(error));
          res.end();  
        }
        next_order = results[0].orderid + 1;
        context.next_order = next_order;
        complete();
        
      })
    }

    router.get('/', function(req, res){
      var callbackCount = 0;
      var context = {};
      context.jsscripts = ['createorder.js'];
      var mysql = req.app.get('mysql');
      getCustomers(res, mysql, context, complete);
      getBrands(res, mysql, context, complete);
      getModels(res, mysql, context, complete);
      getYears(res, mysql, context, complete);
      getNextOrderId(res, mysql, context, complete);
      getVehicles(res, mysql, context, complete)
      function complete(){
        callbackCount ++;
        if(callbackCount >= 5){
          res.render('order', context);
        }
      }
    });

    router.post('/order/:id', function(req, res){
      callbackCount = 0;
      var context = {};
      context.jsscripts = ['createorder.js'];
      var mysql = req.app.get('mysql');
      getCustomers(res, mysql, context, complete);
      getBrands(res, mysql, context, complete);
      getModels(res, mysql, context, complete);
      res.render('/')
    })

    router.post('/', function(req, res){
      console.log(req.body);
      var context = {};
      context.jsscripts = ['createorder.js'];
      var mysql = req.app.get('mysql');
      var sql = 'INSERT INTO orders (customerid, date, price, tax, total) VALUES (?,?,?,?,?)';
      var inserts = [req.body.customerid, req.body.date, req.body.price, req.body.tax, req.body.total]
      console.log(inserts);
      sql = mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
          console.log(JSON.stringify(error));
          res.write(JSON.stringify(error));
          res.end();
        } else {
          res.redirect('/order')
        }
      })
        });
      

   
    return router;
}();
