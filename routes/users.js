var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')
const userHelpers = require('../helpers/user.helpers');

let checkUser=(req,res,next)=>{
  if (req.session.user){
    next()
  }else{
    res.render('user/login')
  }

}



/* GET home page. */
router.get('/', function (req, res, next) {

  let user = req.session.user

  productHelpers.getAllPoducts().then((products) => {
    res.render('./user/view-products', { products, user });
  })
  

});





router.get('/signup', (req, res) => {
  if (req.session.user){
    res.redirect('/')
  }else{
    res.render('user/signup')
  }
  
})


router.post('/signup', (req, res) => {

  
  userHelpers.addUser(req.body, (response) => {
    
    productHelpers.createCart(response._id)
    if (req.session.user){
      res.redirect('/')
    }else{
      res.render('user/login')
    }
    
  })


})

router.get('/login', (req, res) => {
 
  if (req.session.loggedIn){
    

    res.redirect('/')
  }else{
    res.render('user/login',{'loginErr': req.session.loginErr})
    req.session.loginErr=false
  }
  
})


router.post('/login', (req, res) => {

  userHelpers.userLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user

      res.redirect('/')
    } else {
      req.session.loginErr=true


      res.redirect('/login')
    }
  })

})
router.get('/logout',(req,res)=>{
  
  req.session.destroy()
  res.redirect('/')
})

router.get('/cart',async(req,res)=>{
  
  let user=req.session.user
  
  if(user){
   
    let products=await productHelpers.getCart(user._id)
    
      res.render('user/cart',{products})
    
    
  }
  else{
    res.redirect("/login")
  }
})
router.get('/addtocart/:id',checkUser,async(req,res)=>{
  let ProductId= req.params.id
  let user= req.session.user._id
  
  

  await productHelpers.addToCart(ProductId,user)
  res.redirect('/')
})
module.exports = router;
