module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function serveCustomers(req, res){
        console.log("Serving up the customers")
        var query = 'SELECT * FROM customers';
        var mysql = req.app.get('mysql');
        var context = {};

        function handleRenderingOfBrands(error, results, fields){
          console.log(error)
          console.log(results)
          console.log(fields)
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

    router.get('/', serveCustomers);
    return router;
}();

// module.exports = function(){
//     var express = require('express');
//     var router = express.Router();



//     function getCustomers(res, mysql, context, complete){
//         mysql.pool.query("SELECT * FROM customers", function(error, results, fields){
//             if(error){
//                 res.write(JSON.stringify(error));
//                 res.end();
//             }
//             context.customers = results;
//             complete();
//         });
//     }



    // /* Find customers whose fname starts with a given string in the req */
    // function getCustomersWithNameLike(req, res, mysql, context, complete) {
    //   //sanitize the input as well as include the % character
    //    var query = "SELECT customers.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM customers INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id WHERE customers.fname LIKE " + mysql.pool.escape(req.params.s + '%');
    //   console.log(query)

    //   mysql.pool.query(query, function(error, results, fields){
    //         if(error){
    //             res.write(JSON.stringify(error));
    //             res.end();
    //         }
    //         context.customers = results;
    //         complete();
    //     });
    // }

    // function getCustomer(res, mysql, context, id, complete){
    //     var sql = "SELECT * from customers where firsname like 'bob'";
    //     var inserts = [id];
    //     mysql.pool.query(sql, inserts, function(error, results, fields){
    //         if(error){
    //             res.write(JSON.stringify(error));
    //             res.end();
    //         }
    //         context.customer = results[0];
    //         complete();
    //     });
    // }

    /*Display all customers. Requires web based javascript to delete users with AJAX*/

    // router.get('/', function(req, res){
    //     var callbackCount = 0;
    //     var context = {};
    //     context.jsscripts = ["deletecustomer.js","filtercustomers.js","searchcustomers.js"];
    //     var mysql = req.app.get('mysql');
    //     getCustomers(res, mysql, context, complete);
        
    //     function complete(){
    //         callbackCount++;
    //         if(callbackCount >= 2){
    //             res.render('customers', context);
    //         }

    //     }
    // });

    /*Display all customers from a given homeworld. Requires web based javascript to delete users with AJAX*/
    // router.get('/filter/:homeworld', function(req, res){
    //     var callbackCount = 0;
    //     var context = {};
    //     context.jsscripts = ["deletecustomer.js","filtercustomers.js","searchcustomers.js"];
    //     var mysql = req.app.get('mysql');
    //     getCustomersbyHomeworld(req,res, mysql, context, complete);
    //     getPlanets(res, mysql, context, complete);
    //     function complete(){
    //         callbackCount++;
    //         if(callbackCount >= 2){
    //             res.render('customers', context);
    //         }

    //     }
    // });

    // /*Display all customers whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    // router.get('/search/:s', function(req, res){
    //     var callbackCount = 0;
    //     var context = {};
    //     context.jsscripts = ["deletecustomer.js","filtercustomers.js","searchcustomers.js"];
    //     var mysql = req.app.get('mysql');
    //     getCustomersWithNameLike(req, res, mysql, context, complete);
    //     getPlanets(res, mysql, context, complete);
    //     function complete(){
    //         callbackCount++;
    //         if(callbackCount >= 2){
    //             res.render('customers', context);
    //         }
    //     }
    // });

    // /* Display one customer for the specific purpose of updating customers */

    // router.get('/:id', function(req, res){
    //     callbackCount = 0;
    //     var context = {};
    //     context.jsscripts = ["selectedplanet.js", "updatecustomer.js"];
    //     var mysql = req.app.get('mysql');
    //     getCustomer(res, mysql, context, req.params.id, complete);
    //     getPlanets(res, mysql, context, complete);
    //     function complete(){
    //         callbackCount++;
    //         if(callbackCount >= 2){
    //             res.render('update-customer', context);
    //         }

    //     }
    // });

    // /* Adds a customer, redirects to the customers page after adding */

    // router.post('/', function(req, res){
    //     console.log(req.body.homeworld)
    //     console.log(req.body)
    //     var mysql = req.app.get('mysql');
    //     var sql = "INSERT INTO customers (fname, lname, homeworld, age) VALUES (?,?,?,?)";
    //     var inserts = [req.body.fname, req.body.lname, req.body.homeworld, req.body.age];
    //     sql = mysql.pool.query(sql,inserts,function(error, results, fields){
    //         if(error){
    //             console.log(JSON.stringify(error))
    //             res.write(JSON.stringify(error));
    //             res.end();
    //         }else{
    //             res.redirect('/customers');
    //         }
    //     });
    // });

    // /* The URI that update data is sent to in order to update a customer */

    // router.put('/:id', function(req, res){
    //     var mysql = req.app.get('mysql');
    //     console.log(req.body)
    //     console.log(req.params.id)
    //     var sql = "UPDATE customers SET fname=?, lname=?, homeworld=?, age=? WHERE character_id=?";
    //     var inserts = [req.body.fname, req.body.lname, req.body.homeworld, req.body.age, req.params.id];
    //     sql = mysql.pool.query(sql,inserts,function(error, results, fields){
    //         if(error){
    //             console.log(error)
    //             res.write(JSON.stringify(error));
    //             res.end();
    //         }else{
    //             res.status(200);
    //             res.end();
    //         }
    //     });
    // });

    // /* Route to delete a customer, simply returns a 202 upon success. Ajax will handle this. */

    // router.delete('/:id', function(req, res){
    //     var mysql = req.app.get('mysql');
    //     var sql = "DELETE FROM customers WHERE character_id = ?";
    //     var inserts = [req.params.id];
    //     sql = mysql.pool.query(sql, inserts, function(error, results, fields){
    //         if(error){
    //             console.log(error)
    //             res.write(JSON.stringify(error));
    //             res.status(400);
    //             res.end();
    //         }else{
    //             res.status(202).end();
    //         }
    //     })
    // })

//     return router;
// }();


