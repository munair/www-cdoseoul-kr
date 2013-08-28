var express = require('express');
var fs = require('fs');
var nodemailer = require("nodemailer");

var app = express.createServer(express.logger());

app.use(express.bodyParser());

app.get('/', function(request, response) {
  var htmlBuffer = fs.readFileSync('index.html', 'utf-8');
  response.send(htmlBuffer);
});

app.post('/contact', function(request, response) {
  contactlist = "class-request-contact-information.txt";
  var name = request.body.name;
  var email = request.body.email;
  var comments = request.body.comments;
  var out = "contact name: " + name + "\tcontact email: " + email + "\tcomments: " + comments + "\n";
  var transport = nodemailer.createTransport("SES", {
    AWSAccessKeyID: "AKIAJE4BML2KMDLY7MTQ",
    AWSSecretKey: "Aun2EYJ0FFFcfuUxyjNAsmTrjhGgLO0hzTFL4+OEItMF",
    ServiceUrl: "https://email-smtp.us-east-1.amazonaws.com"
  });

  var mailOptions = {
    from: "zumbi@cdoseoul.com", // sender address
    to: "zumbi@cdoseoul.com", // list of receivers
    subject: "Free Class Signup Form Submission", // Subject line
    text: out // plaintext body or use -> html: "<b>Hello world</b>" // html body
  }

  transport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }

    // if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages

    transport.close(); // shut down the connection pool, no more messages
  });

  fs.writeFileSync(contactlist, out);
  response.redirect('back');
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
