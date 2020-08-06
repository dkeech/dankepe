function deleteOrder(orderid){
    $.ajax({
        url: '/invoices/' + orderid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
