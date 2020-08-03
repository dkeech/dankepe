module.exports = function(){
    var express = require('express');
    var router = express.Router();

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

    function getProducts(res, mysql, context, complete){
      mysql.pool.query('SELECT p.productid, p.modelyear, b.brandname, p.model, p.price, p.quantity ' + 
      'FROM products p JOIN brands b', function(error, results, fields){
        if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
        context.products = results;
        complete();
      })
    }

      router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ['deleteproduct.js', 'selectedproduct.js'];
        context.title = "Products"
        var mysql = req.app.get('mysql');
        getBrands(res, mysql, context, complete);
        getProducts(res, mysql, context, complete);
        
        function complete(){
          callbackCount ++;
          if(callbackCount >= 2){
            res.render('products', context);
          }
        }
        
      });
    return router;
}();
