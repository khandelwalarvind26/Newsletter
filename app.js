const express = require('express');
const BS = require('body-parser');
const https = require('https');
const app = express();
app.use(BS.urlencoded({extended : true}));

app.use(express.static("public"));

app.get("/" , function(req,res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){
    const firstName = req.body.fname;
    console.log(firstName);
    const lastName = req.body.lname;
    console.log(lastName);
    const email = req.body.inputEmail;
    console.log(email);
    console.log("Request recieved");

    const data = {
        members:[
            {
                email_address: email,
                status : "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const url = "https://us9.api.mailchimp.com/3.0/lists/8f5e81563c";
    const jsonData = JSON.stringify(data);
    const options = {
        method : "POST",
        auth : "anyString:9891047d6fc909eb5db7843f92200623-us9"
    }

    const request = https.request(url, options, function(response) {
        if(response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html")
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data",function(data) {
            // if(data.error_count == 0) console.log("Success");
            // else console.log("Failure");
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
});

//api key 
// 9891047d6fc909eb5db7843f92200623-us9

// list id
// 8f5e81563c