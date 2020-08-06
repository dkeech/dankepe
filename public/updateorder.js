function updateOrder(orderid){
    $.ajax({
        url: '/invoices/' + orderid,
        type: 'PUT',
        data: $('#update-order').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};

function updateOrdernull(orderid){
    $.ajax({
        url: '/invoices/null/' + orderid,
        type: 'PUT',
        data: $('#update-order').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};