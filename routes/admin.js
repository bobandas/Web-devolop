var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user.helpers');

/* GET users listing. */
router.get('/', function (req, res, next) {

  productHelpers.getAllPoducts().then((products) => {
    res.render('admin/view-products', { products, admin: true });
  })



});
router.get('/users', function (req, res, next) {

 userHelpers.getAllUser().then((users) => {
  console.log(users);
    res.render('admin/view-users', { users, admin: true });
  })



});

router.get("/add-products", (req, res) => {
  res.render("admin/add-products")
})
router.post("/add-products", (req, res) => {
  productHelpers.addProduct(req.body, (id) => {

    let image = req.files.file_img;

    image.mv('./public/product-image/' + id + ".jpg", (err) => {
      if (!err) {
        res.render("admin/add-products")
      } else {
        console.log(err);
      }
    })

  })

})







module.exports = router;
