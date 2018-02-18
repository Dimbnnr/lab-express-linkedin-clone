var express = require('express');
var router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");


router.get("/signup", (req,res)=>{
  res.render("signup", {error:null});
});


router.post("/signup", (req,res)=>{
  //comprobar que el correo no este en uso
  User.findOne({email:req.body.email}, (err,doc)=>{
    if(err) return res.send(err);
    if(doc) return res.render("signup", {error:"mail already taken"});
  });

  //hasheamos el pass
  const salt = bcrypt.genSaltSync(256);
  const hashPass = bcrypt.hashSync(req.body.password, salt);
  //crea un usuario nuevo
  const user = new User({
    name:req.body.name,
    username:req.body.userName,
    email:req.body.email,
    password: hashPass
  });
  user.save((err, result)=>{
    if(err) return res.send(err);
    return res.redirect("/"); //cambia esto por el perfil
  });

});

//login
router.get("/login", (req,res)=>{
  res.render("login", {error:null});
});

// router.post("/login", (req,res)=>{
//   User.findOne({username:req.body.username}, (err,doc)=>{
//     if(err) return res.send(err);
//     if(!doc) return res.render("login_form",{error:"tu usuario no existe"});
//     if(!bcrypt.compareSync(req.body.password, doc.password)) return res.render("login_form",{error:"tu password no es correcto"});
//     req.session.currentUser = doc;
//     res.redirect("/") //cambiar esto por el perfil
//   });
// });

// router.post("/logout", (req,res)=>{
//   req.session.destroy();
//   res.redirect("/")
// });






/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Linkedin Clone' });
});

module.exports = router;
