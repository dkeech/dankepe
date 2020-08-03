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

    function getModels(res, mysql, context, complete){
      mysql.pool.query('SELECT model FROM products', function(error, results, fields){
        if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
        context.models = results;
        complete();
      });
      }
        

    router.get('/', function(req, res){
      var callbackCount = 0;
      var context = {};
      context.jsscripts = [];
      var mysql = req.app.get('mysql');
      getCustomers(res, mysql, context, complete);
      getBrands(res, mysql, context, complete);
      getModels(res, mysql, context, complete);
      function complete(){
        callbackCount ++;
        if(callbackCount >= 3){
          res.render('order', context);
        }
      }
      
    });
    return router;
}();
