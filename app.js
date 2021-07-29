const express = require("express");
const app = express();
const https = require("https");
const request = require("request");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req, res) {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const data = {
        members : [
            {
              email_address: email,
              status: "subscribed",
              merge_fields: {
                  FName: fname,
                  LName: lname
              }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us6.api.mailchimp.com/3.0/lists/a89346b5c81"

    const options = {
        method: "post",
        auth:"mkj:1b946fad2659efa68020f0eb9bb94de9-us6"
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode===200) {
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");

        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res) {
    res.redirect("/");
})


app.listen(process.env.PORT||3000, function() {
    console.log("server is running on 3000");
})
// list id = a89346b5c8
//  api key = 1b946fad2659efa68020f0eb9bb94de9-us6