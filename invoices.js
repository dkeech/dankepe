module.exports = function(){
    var express = require('express');
    var router = express.Router();

    var invoicesQuery = 'SELECT o.orderid, c.firstname, c.lastname, p.modelyear, b.brandname, p.model, p.price, o.tax, o.total ' + 
      'FROM orders o ' + 
      'JOIN orders_products op ON op.orderid = o.orderid ' + 
      'JOIN products p on op.productid = p.productid ' + 
      'JOIN brands b on p.brandid = b.brandid ' + 
      'JOIN customers c on c.customerid = o.customerid';

    function getInvoices(res, mysql, context, complete){
      mysql.pool.query(invoicesQuery, function(error, results, fields){
        if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
        context.invoices = results;
        console.log("end of getInvoices");
        complete();
      })
    }

    function getCustomers(res, mysql, context, complete){
      mysql.pool.query('SELECT * FROM customers', function(error, results, fields){
        if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
        context.customers = results;
      });
    }


    function getOrdersByCustomerName(req, res, mysql, context, complete){
      var string = req.params.s;
      var query = 'SELECT o.orderid, c.firstname, c.lastname, p.modelyear, b.brandname, p.model, p.price, o.tax, o.total ' + 
        'FROM orders o ' + 
        'JOIN orders_products op ON op.orderid = o.orderid ' + 
        'JOIN products p on op.productid = p.productid ' + 
        'JOIN brands b on p.brandid = b.brandid ' + 
        'JOIN customers c on c.customerid = o.customerid ' + 
        'WHERE c.firstname LIKE ' + mysql.pool.escape(string + "%") +  ' OR c.lastname LIKE ' + mysql.pool.escape(string + "%");
      console.log(query);

      mysql.pool.query(query, function(error, results, fields){
        if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
        context.invoices = results;
        complete();
      })
    }

    router.get('/', function(req, res){
      console.log("rendering invoices");
      var callbackCount = 0;
      console.log("callbackCount is " + callbackCount)
      var context = {};
      context.jsscripts = ['searchorders.js'];
      var mysql = req.app.get('mysql');
      getInvoices(res, mysql, context, complete);
      
      function complete(){
        
        callbackCount ++;
        console.log(callbackCount);
        if(callbackCount >=1){
        res.render('invoices', context)
        }
      }
    });

    router.get('/search/:s', function(req, res){
      var callbackCount = 0;
      var context = {};
      context.jsscripts = ['searchorders.js'];
      var mysql = req.app.get('mysql');
      getOrdersByCustomerName(req, res, mysql, context, complete);
      function complete(){
        
        callbackCount ++;
        console.log(callbackCount)
        if(callbackCount >= 1){
          res.render('invoices', context);
        }
      }
    })

    
    return router;
}();
