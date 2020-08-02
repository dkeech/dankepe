function deleteBrand(id){
    $.ajax({
        url: '/brands/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};


