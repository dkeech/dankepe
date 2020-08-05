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
          context.jsscripts = ['selectedbrand.js'];
          //pass it to handlebars to put inside a file
          res.render('brands', context)
        }
        //execute the sql query
        mysql.pool.query(query, handleRenderingOfBrands)

        //res.send('Here you go!');
    }

    router.get('/', serveBrands);
    

    // Route to add a new brand to the list
    router.post('/', function(req, res){
      console.log(req.body)
      var mysql = req.app.get('mysql');
      var sql = "INSERT INTO brands (brandname) VALUES (?)";
      var inserts = [req.body.brandname];
      sql = mysql.pool.query(sql,inserts,function(error, results, fields){
          if(error){
              console.log(JSON.stringify(error))
              res.write(JSON.stringify(error));
              res.end();
          }else{
              res.redirect('brands');
          }
      });
  });


return router;

}();


    
    

