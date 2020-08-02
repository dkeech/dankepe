module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function serveInvoices(req, res){
        console.log("Serving up the invoices")
        var query = 'select o.orderid, c.firstname, c.lastname, p.modelyear, b.brandname, p.model, p.price ' +
        'from orders o ' + 
        'join orders_products op on op.orderid = o.orderid ' + 
        'join products p on op.productid = p.productid ' +
        'join brands b on p.brandid = b.brandid ' +
        'join customers c on c.customerid = o.customerid'
        
        var mysql = req.app.get('mysql');
        var context = {};

        function handleRenderingOfInvoices(error, results, fields){
          console.log(error)
          console.log(results)
          console.log(fields)
          //take the results of that query and store it inside context
          context.invoices = results;
          context.title = 'Orders';
          context.jsscripts = ['deleteinvoice.js', 'selectedinvoice.js'];
          //pass it to handlebars to put inside a file
          res.render('invoices', context)
        }
        //execute the sql query
        mysql.pool.query(query, handleRenderingOfInvoices)

        //res.send('Here you go!');
    }

    router.get('/', serveInvoices);
    return router;
}();
