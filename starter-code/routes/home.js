var express = require('express');
var router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//Sign up
router.get("/signup", (req, res) => {
  res.render("authentication/signup", {
    error: null
  });
});


router.post("/signup", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let password2 = req.body.password2;

  if (username === "" || password === "") {
    res.render("authentication/signup", {
      error: "Indicate a username and a password to sign up"
    });
    return;
  }
  if (password !== password2) {
    res.render("authentication/signup", {
      error: "Indicate the same password"
    });
    return;
  }

  User.findOne({
    "username": username
  }, "username", (err, doc) => {
    if (doc !== null) {
      res.render("signup", {
        error: "The username already exists"
      });
      return;
    };
    User.findOne({
      "email": email
    }, "email", (err, doc) => {
      if (doc !== null) {
        res.render("authentication/signup", {
          error: "The email already exists"
        });
        return;
      };

      //comprobar que el correo no este en uso

      // User.findOne({"email":req.body.email}, (err,doc)=>{
      //   if(err) return res.send(err);
      //   if(doc) return res.render("signup", {error:"mail already taken"});
      // });

      //hasheamos el pass
      const salt = bcrypt.genSaltSync(256);
      const hashPass = bcrypt.hashSync(req.body.password, salt);
      //crea un usuario nuevo
      const user = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hashPass
      });
      user.save((err, result) => {
        if (err) return res.send(err);
        return res.redirect("/"); //cambia esto por el perfil
      });
    });
  });
});



// //login
// router.get("/login", (req, res) => {
//   res.render("login", {
//     error: null
//   });
// });

// router.post("/login", (req, res) => {
//   User.findOne({
//     username: req.body.username
//   }, (err, doc) => {
//     if (err) return res.send(err);
//     if (!doc) return res.render("login", {
//       error: "tu usuario no existe"
//     });
//     if (!bcrypt.compareSync(req.body.password, doc.password)) return res.render("login", {
//       error: "tu password no es correcto"
//     });
//     req.session.currentUser = doc;
//     res.redirect("/") //cambiar esto por el perfil
//   });
// });

// router.post("/logout", (req, res) => {
//   req.session.destroy();
//   res.redirect("/")
// });

//Login
router.get("/login", (req, res, next) => {
  res.render("authentication/login", {error: null});
  
});

router.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("authentication/login", {
      error: "Indicate a username and a password to log in"
    });
    return;
  }

  User.findOne({ "username": username },
    "_id username password",
    (err, doc) => {
      if (err || !doc) {
        res.render("authentication/login", {
          error: "The username doesn't exist"
        });
        return;
      } else {
        if (bcrypt.compareSync(password, doc.password)) {
          req.session.currentUser = doc;
          res.redirect("/profile");
          // logged in
        } else {
          res.render("authentification/login", {
            error: "Incorrect password"
          });
        }
      }
  });
});


router.get("/logout", (req, res, next) => {
  if (!req.session.currentUser) { res.redirect("/"); return; }

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("authentication/login");
    }
  });
});





/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home', {
    title: 'Linkedin Clone'
  });
});

module.exports = router;