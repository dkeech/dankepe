module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function serveCustomers(req, res){
        console.log("Serving up the customers")
        var query = 'SELECT * FROM customers';
        var mysql = req.app.get('mysql');
        var context = {};

        function handleRenderingOfBrands(error, results, fields){
          //take the results of that query and store it inside context
          context.customers = results;
          context.title = 'Customers';
          context.jsscripts = ['searchcustomers.js', 'updatecustomer.js', 'deleteCustomer.js'];
          //pass it to handlebars to put inside a file
          res.render('customers', context)
        }
        //execute the sql query
        mysql.pool.query(query, handleRenderingOfBrands)

        //res.send('Here you go!');
    }

    function getCustomer(res, mysql, context, customerid, complete){
        var sql = "SELECT * FROM customers WHERE customerid = ?";
        var inserts = [customerid];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customer = results[0];
            complete();
        });
    }

    router.get('/', serveCustomers);


    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO customers (`firstname`, `lastname`, `email`, `street_address`, `city`, `state`, `zip`) VALUES (?,?,?,?,?,?,?)";
        var inserts = [req.body.firstname, req.body.lastname, req.body.email, req.body.street_address, req.body.city, req.body.state, req.body.zip];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/customers');
            }
        });
    });

    router.delete('/:customerid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM customers WHERE customerid = ?";
        var inserts = [req.params.customerid];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })



    router.get('/:customerid', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatecustomer.js"];
        var mysql = req.app.get('mysql');
        getCustomer(res, mysql, context, req.params.customerid, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-customer', context);
            }

        }
    });



    router.put('/:customerid', function(req, res){
        var mysql = req.app.get('mysql');
        var inserts = [req.body.firstname, req.body.lastname, req.body.email, req.body.street_address, req.body.city, req.body.state, req.body.zip, req.params.customerid];
        var sql = "UPDATE customers SET firstname=?, lastname=?, email=?, street_address=?, city=?, state=?, zip=? WHERE customerid=? ";
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



