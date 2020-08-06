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
      mysql.pool.query('SELECT modelyear FROM products', function(error, results, fields){
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
        
    // function getOrder(res, mysql, context, complete){
    //   mysql.pool.query('SELECT TOP 1 orderid, date, name FROM orders ORDER BY orderid DESC', function(error, results, fields){
    //     if(error){
    //       res.write(JSON.stringify(error));
    //       res.end();
    //     }
    //     context.thisOrder = results;
    //     complete();
    //   })
    // }
    
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
      var callbackCount = 0;
      var context = {};
      context.jsscripts = [];
      var mysql = req.app.get('mysql');
      getCustomers(res, mysql, context, complete);
      getBrands(res, mysql, context, complete);
      getModels(res, mysql, context, complete);
      // getOrder(res, mysql, context, complete);
      function complete(){
        callbackCount ++;
        if(callbackCount >= 4){
          res.render('order', context);
        }
      }
    });

   
    return router;
}();
