var express = require('express');
var fs = require('fs');
var postmark = require("postmark")(process.env.POSTMARK_API_KEY);


var app = express.createServer(express.logger());

app.use(express.bodyParser());

app.get('/', function(request, response) {
  var htmlBuffer = fs.readFileSync('index.html', 'utf-8');
  response.send(htmlBuffer);
});

app.post('/contact', function(request, response) {
  var name = request.body.name;
  var email = request.body.email;
  var mobile = request.body.mobile;
  var out = "성명: " + name + "\t이메일: " + email + "\t휴대폰: " + mobile + "\n";
  postmark.send({
    "From": "zumbi@cdoseoul.kr",
    "To": "info@cdoseoul.kr",
    "Subject": "Free Class Signup Form Submission",
    "TextBody": out,
    "Tag": "registrant"
  }, function(error, success) {
       if(error) {
          console.error("Unable to send via postmark: " + error.message);
         return;
       }
    console.info("Sent to postmark for delivery")
  });

  response.redirect('back');
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
