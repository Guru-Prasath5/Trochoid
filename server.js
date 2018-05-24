const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
var email = require('./email');
var S = require('string');


app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());



// If an incoming request uses
// a protocol other than HTTPS,
// redirect that request to the
// same url but with HTTPS

const forceSSL = function() {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(
       ['https://', req.get('Host'), req.url].join('')
      );
    }
    next();
  }
}
// Instruct the app
// to use the forceSSL
// middleware
// app.use(forceSSL());

app.use((req , res , next) => {
  res.setHeader(`Access-Control-Allow-Origin` , `*`);
  res.setHeader(`Access-Control-Allow-Credentials` , `true`);
  res.setHeader(`Access-Control-Allow-Methods` , `GET, HEAD , OPTIONS, POST , DELETE`);
  res.setHeader(`Access-Control-Allow-Headers`, `Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers`);

 next();  
});


// Run the app by serving the static files
// in the dist directory

app.use(express.static(__dirname + '/'));


app.get('/*', function(req, res) {
	console.log(__dirname)
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/sendEmail' , function (req , res) {
  console.log(req.body);
  email.mail({email : 'viveksm6@gmail.com' , from : req.body.email , subject : `From ${req.body.email} : ${req.body.subject}` , desc : req.body.desc}).then(data => {
    console.log('deii' , data)
    thankyou = S(thankyou).replaceAll('$[name]' , req.body.name).s;
    thankyou = S(thankyou).replaceAll('$[subject]' , req.body.subject).s;
    email.mail({email:req.body.email , from : 'no-reply' , subject : 'Your application to The Colosseum Sports' , desc : thankyou})
      .then(data => {
        console.log('Yep' , data)
      res.status(200).send('Thank You!! we will get back to you.');
      }).catch(err => {
        console.log(err)
        res.status(200).send('Thank You!! we will get back to you.')
      });

  }).catch(err => {
    console.log('oops' , err);
    res.status(200).send(`Aw!!, Unfortunately our Mailer messed up. Mail  @ xyz@gmail.com`);
  });
})

// Start the app by listening on the default
// Heroku port

app.listen(process.env.PORT || 8080);
console.log('listening on port 8080')

var thankyou = `
Dear $[name],
 This letter is to let you know that We have received you applicatiion regarding $[subject]. We will get back to you as soon as possible.
Untill then please be paitent  your mail is important to us.

Regards,
The Colosseum Sports,
India
website : thecsports.com
`;