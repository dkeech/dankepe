function updateCustomer(customerid){
    $.ajax({
        url: '/customers/' + customerid,
        type: 'PUT',
        data: $('#update-customer').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
