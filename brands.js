module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function serveBrands(req, res){
        console.log("Serving up the brands")
        var query = 'SELECT * FROM brands';
        var mysql = req.app.get('mysql');
        var context = {};

        function handleRenderingOfBrands(error, results, fields){
          console.log(error)
          console.log(results)
          console.log(fields)
          //take the results of that query and store it inside context
          context.brands = results;
          context.title = 'Brands';
          context.jsscripts = ['deletebrand.js', 'selectedbrand.js'];
          //pass it to handlebars to put inside a file
          res.render('brands', context)
        }
        //execute the sql query
        mysql.pool.query(query, handleRenderingOfBrands)

        //res.send('Here you go!');
    }

    router.get('/', serveBrands);
    return router;
}();
