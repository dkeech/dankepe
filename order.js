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
        complete();
      })
    }
    
    function getNextOrderId(res, mysql, context, complete){
      mysql.pool.query('SELECT orderid FROM orders ORDER BY orderid DESC LIMIT 1', function(error, results, fields){
        if(error){
          res.write(JSON.stringify(error));
          res.end();  
        }
        if(results.length > 0){
          next_order = (results[0].orderid + 1);
        } else {next_order = 1;}
        
        context.next_order = next_order;
        complete();
        
      })
    }

    function postOrder(inserts, res, mysql, context, complete){
      mysql.pool.query('INSERT INTO orders (customerid, date, price, tax, total) VALUES (?,?,?,?,?); ', inserts, function(error, results, fields){
        if(error){
          res.write(JSON.stringify(error));
          res.end();
        } 
        complete();
      });
    }

    function postOrderProducts(productid, order_number, res, mysql, context, complete){
      var sql = `INSERT INTO orders_products(orderid, productid) VALUES ((SELECT orderid FROM orders WHERE orderid = ${order_number}),${productid}); `
      
      mysql.pool.query(sql, function(error, results, fields){
        if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
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
      getVehicles(res, mysql, context, complete);
      function complete(){
        callbackCount ++;
        if(callbackCount >= 6){
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
      var callbackCount = 0;
      console.log(req.body);
      var context = {};
      context.jsscripts = ['createorder.js'];
      var mysql = req.app.get('mysql');
      var inserts = [req.body.customerid, req.body.date, req.body.price, req.body.tax, req.body.total];
      postOrder(inserts, res, mysql, context, complete);
      
     
      var arr = JSON.parse(req.body.items_array);
      var callbacks = arr.length + 1 ;
      var order_number = req.body.order_number;
      for(i of arr){
        postOrderProducts(i, order_number, res, mysql, context, complete);
      }
      function complete(){
        callbackCount ++;
        if(callbackCount >= callbacks){
          res.redirect('/order');
          
        }
      }    
    });
      
    return router;
}();
