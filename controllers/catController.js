var Cat = require('../models/author');

// Display List of all Cats.
const cat_list = (req, res) => {
    res.send('NOT IMPLEMENTED: Cat List');
};
// Display detail for a specific Cat.
const cat_detail = (req, res) => {
    res.send ('NOT IMPLEMENTED: Cat Detail: ' + req.params.id);
};
// Display Cat create form on GET.
const cat_create_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Cat create GET');
};
// Handle Cat create on POST.
const cat_create_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Cat create POST');
};
// Display Cat delete form on GET.
const cat_delete_get = (req, res) =>{
    res.send('NOT IMPLEMENTED: Cat delete GET');
};
//Handle Cat delete on POST.
const cat_delete_post = (req, res) =>{
    res.send('NOT IMPLEMENTED: Cat delete POST');
};
// Display Cat update form on GET.
const cat_update_get = (req, res) =>{
    res.send('NOT IMPLEMENTED: Cat update GET');
};
// Handle Cat update on POST.
const cat_update_post = (req, res) =>{
    res.send('NOT IMPLEMENTED: Cat update POST');
};

module.exports = {
    cat_list : cat_list,
    cat_detail : cat_detail,
    cat_create_get : cat_create_get,
    cat_create_post : cat_create_post,
    cat_delete_get : cat_delete_get,
    cat_delete_post : cat_delete_post,
    cat_update_get : cat_update_get,
    cat_update_post : cat_update_post
}