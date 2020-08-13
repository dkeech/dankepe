module.exports = function(){
    var express = require('express');
    var router = express.Router();

    var invoicesQuery = 'SELECT o.orderid, c.firstname, c.lastname, o.total ' + 
    'FROM orders o ' + 
    'JOIN customers c on c.customerid = o.customerid ';

    var nullinvoices = 'SELECT orderid, total FROM orders where customerid is NULL;'


    function getInvoices(res, mysql, context, complete){
      mysql.pool.query(invoicesQuery, function(error, results, fields){
        if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
        context.invoices = results;
        complete();
      })
    }

    function getnullInvoices(res, mysql, context, complete){
      mysql.pool.query(nullinvoices, function(error, results, fields){
        if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
        context.nullinvoices = results;
        complete();
      })
    }
  

    function getInvoice(res, mysql, context, orderid, complete){
      var sql = 'SELECT o.orderid, c.firstname, c.lastname, p.modelyear, b.brandname, p.model, o.price, o.tax, o.total ' + 
      'FROM orders o ' + 
      'JOIN orders_products op ON op.orderid = o.orderid ' + 
      'JOIN products p on op.productid = p.productid ' + 
      'JOIN brands b on p.brandid = b.brandid ' + 
      'JOIN customers c on c.customerid = o.customerid ' +
      'WHERE o.orderid = ?';
      var inserts = [orderid];
      mysql.pool.query(sql, inserts, function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.order = results[0];
          complete();
      });
    }

    function getProductsinOrder(res, mysql, context, orderid, complete){
      var sql = 'SELECT o.orderid, c.firstname, c.lastname, p.modelyear, b.brandname, p.model, p.price as productprice, o.price, o.tax, o.total ' + 
      'FROM orders o ' + 
      'JOIN orders_products op ON op.orderid = o.orderid ' + 
      'JOIN products p on op.productid = p.productid ' + 
      'JOIN brands b on p.brandid = b.brandid ' + 
      'JOIN customers c on c.customerid = o.customerid ' +
      'WHERE o.orderid = ?';
      var inserts = [orderid];
      mysql.pool.query(sql, inserts, function(error, results, fields){
          if(error){
              res.write(JSON.stringify(error));
              res.end();
          }
          context.orders = results;
          complete();
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
      context.jsscripts = ['searchorders.js', 'deleteorder.js'];
      var mysql = req.app.get('mysql');
      getInvoices(res, mysql, context, complete);
      getnullInvoices(res, mysql, context, complete);
      function complete(){
        
        callbackCount ++;
        console.log(callbackCount);
        if(callbackCount >=2){
          console.log(context)
        res.render('invoices', context)
        }
      }
    });

    router.get('/view/:orderid', function(req, res){
      callbackCount = 0;
      var context = {};
      var mysql = req.app.get('mysql');
      getProductsinOrder(res, mysql, context, req.params.orderid, complete);
      function complete(){
          callbackCount++;
          if(callbackCount >= 1){
              console.log(context)
              res.render('orderproducts', context);
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


    router.delete('/:orderid', function(req, res){
      var mysql = req.app.get('mysql');
      var sql1 = "DELETE FROM orders_products WHERE orderid = ?";
      var sql2 = "DELETE FROM orders WHERE orderid = ?"
      var inserts = [req.params.orderid];
      remove_orders_products = mysql.pool.query(sql1, inserts, function(error, results, fields){
          if(error){
              console.log(error)
              res.write(JSON.stringify(error));
              res.status(400);
              res.end();
          }else{
            remove_order= mysql.pool.query(sql2, inserts, function(error, results, fields){
              if(error){
                  console.log(error)
                  res.write(JSON.stringify(error));
                  res.status(400);
                  res.end();
              }else{
                  res.status(202).end();
              }
          })
          }
      })
    })

    router.get('/:orderid', function(req, res){
      callbackCount = 0;
      var context = {};
      context.jsscripts = ["updateorder.js"];
      var mysql = req.app.get('mysql');
      getInvoice(res, mysql, context, req.params.orderid, complete);
      function complete(){
          callbackCount++;
          if(callbackCount >= 1){
              res.render('update-order', context);
          }

      }
    });


    router.put('/:orderid', function(req, res){
      var mysql = req.app.get('mysql');
      var inserts = [req.body.price, req.body.tax, req.body.total, req.params.orderid];
      var sql = "UPDATE orders SET price=?, tax=?, total=? WHERE orderid=?";
      sql = mysql.pool.query(sql,inserts,function(error, results, fields){
          if(error){
              console.log(error)
              res.write(JSON.stringify(error));
              res.end();
          }else{
              res.status(200);
              res.end();
          }
      });
    });

    router.put('/null/:orderid', function(req, res){
      var mysql = req.app.get('mysql');
      var inserts = [req.body.price, req.body.tax, req.body.total, req.params.orderid];
      var sql = 'UPDATE orders SET customerid=NULL, price=?, tax=?, total=? WHERE orderid=?';
      sql = mysql.pool.query(sql,inserts,function(error, results, fields){
          if(error){
              console.log(error)
              res.write(JSON.stringify(error));
              res.end();
          }else{
              res.status(200);
              res.end();
          }
      });
    });

    
    return router;
}();
