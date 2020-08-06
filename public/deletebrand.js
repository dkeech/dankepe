function deleteBrand(brandid){
    $.ajax({
        url: '/brands/' + brandid,
        type: 'DELETE',
        success: function(result){
            console.log(brandid)
            window.location.reload(true);
        }
    })
};


