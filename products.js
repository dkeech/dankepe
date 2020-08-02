module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function serveProducts(req, res){
        console.log("Serving up the products")
        var query = 'SELECT p.productid, p.modelyear, b.brandname, p.model, p.price, p.quantity ' + 
        'FROM products p ' +
        'JOIN brands b';
        var mysql = req.app.get('mysql');
        var context = {};

        function handleRenderingOfProducts(error, results, fields){
          console.log(error)
          console.log(results)
          // console.log(fields)
          //take the results of that query and store it inside context
          context.products = results;
          context.title = 'Products';
          context.jsscripts = ['deleteproduct.js', 'selectedproduct.js'];
          //pass it to handlebars to put inside a file
          res.render('products', context)
        }
        //execute the sql query
        mysql.pool.query(query, handleRenderingOfProducts)

      }

    router.get('/', serveProducts);
    return router;
}();
