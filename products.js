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
      mysql.pool.query('SELECT * FROM products INNER JOIN brands ON products.brandid = brands.brandid', function(error, results, fields){
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

    

      router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO products (`brandid`, `model`, `modelyear`, `price`, `quantity`) VALUES (?,?,?,?,?)";
        var inserts = [req.body.brandid, req.body.model, req.body.modelyear, req.body.price, req.body.quantity];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/products');
            }
        });
    });


    return router;
}();
