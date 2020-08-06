function deleteCustomer(customerid){
    $.ajax({
        url: '/customers/' + customerid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
