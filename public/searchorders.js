function searchOrdersByName() {
    
    var search_string  = document.getElementById('search_string').value
    //construct the URL and redirect to it
    window.location = '/invoices/search/' + encodeURI(search_string)
}
