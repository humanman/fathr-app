// -- EXPRESS --
var express 				= require('express');
var app 						= express();
var bodyParser 			= require('body-parser');
var morgan 					= require('morgan');
var methodOverride 	= require('method-override');
var request         = require('request')
var ejs             = require('ejs')
// -- MONGODB --
var db 							= require('./config/db');
var MongoDB 				= require('mongodb');
var MongoClient  		= MongoDB.MongoClient;
var ObjectID 				= MongoDB.ObjectID;
var port 						= 3000;
var Alert 					= require('./models/alert.js');
// -- TWILIO ---
var sid 						= process.env.TWILIO_ACCOUNT_SID;
var tok 						= process.env.TWILIO_AUTH_TOKEN;
var myNum       	 	= process.env.TWILIO_NUMBER;
var client          = require('twilio')(sid, tok);



// -- IMAGE MAGICK --
var fs              = require("fs");
var caption         = require('caption');
var im              = require('imagemagick');
var gm              = require('gm')

// -- BODY PARSER --
app.use(morgan('combined'));
app.use(bodyParser());
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded());
app.use(methodOverride('X-HTTP-Method-Override')); 
//this doesn't.fucking/work!
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname +'/'));


//-- this configs routes



app.set('view engine', 'ejs');


app.listen(port);

console.log('Charlie! You did it! ' + port);
//--- for when I clean up my structure

// == SERVER ==
console.log('connecting to MongoDB');
MongoClient.connect('mongodb://localhost:27017/fathr', function(error, db){
 if(error){throw error}
   console.log('connected');

// module.exports = function(app) {
// routes will go here


	 // server routes ======================================
        // handle things like api calls
        // cat api and insultme api will move here
        // authentication routes
	app.get('/', function(req, res){
			//-- let's get a cat! --
			request('http://thecatapi.com/api/images/get?format=xml&categories=kitten&type=jpg', function (error, response, body) {
					if (!error && response.statusCode == 200) {
						//this api does not return a json object so we must extract the img url by hand via regexp
						var re = /<url>(.*)<\/url>/
						var imgUrl = body.match(re)
	      		var actualImg = imgUrl[1].match(/.com\/(.*)/)
	      		//-- nested in the callback is our insulting top text
	      		request('http://pleaseinsult.me/api' , function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	          var insult = JSON.parse(body);
	          console.log(insult.insult) 
	          // -- resize cat image and save
	          gm(imgUrl[1]).resize(500, 450, "!").write('image/memed1.jpg',function (err) {
	          	//-- format/write text onto image
	          	if (err) {
	                console.log(err);
	            } else {
	           //-- the bottomCaption should take from input form
	              var options = {
	              caption : insult.insult,
	              bottomCaption : 'also, return Lindas pitcher' 
	              }
	              caption.path('image/memed1.jpg',options,function(err,captionedImage){
	              	//--err will contain an Error object if there was an error
	            		// otherwise, captionedImage will be a path to a file.
	            			if (!err) {
	            				//change to send so it sends a json of the below to be caught by angular
	                  // res.sendtojson?
	                  res.render('index', {name: insult.insult, img: captionedImage});
	                  console.log(captionedImage);
	                } else {
	                 	console.log(err);
	                };
	              });// caption
	            }
	          });// gm
	        }

	      });//request for insult
	    }
	  });//request for cat
	}); //app.get /

//-- this should add custom text to bottom of meme

	app.post('/alerts', function(req, res){

	  console.log(req.body.due_at);
	  var message = req.body.message;
	  var phone		= req.body.phone;
	  // try query.body if this doesn't work
	  //-- need to get value of datepicker <pre> which displays the selected date and time.
	  var date		= req.body.due_at;
	   
	  console.log(message + " is inserted");

	  db.collection('alerts').insert({
	  	message : message,
	  	phone		: phone,
	  	due_at 	: date
	  }, function(error, data){
	  	if(error){throw error}
	    	else{
	    		makeMeme(message, phone);
	    		console.log(message + "sending /alert data your way!")
	    		// res.send(JSON.stringify(data));
	    		console.log(JSON.stringify(data));

	    }
	  });


 });//app.post /newalert

 // ----frontend routes 
 // ----route to handle all angular requests
 // app.get('*', function(req, res) {
 //            res.sendfile('index'); // load our public/index.html file
 //        });










// == CLEANUP ==
		process.on('exit', function(){
		db.close();
	});
});//Mongo


var makeMeme = function(message, phone){
	request('http://thecatapi.com/api/images/get?format=xml&categories=kitten&type=jpg', function (error, response, body) {
					if (!error && response.statusCode == 200) {
						//this api does not return a json object so we must extract the img url by hand via regexp
						var re = /<url>(.*)<\/url>/
						var imgUrl = body.match(re)
	      		var actualImg = imgUrl[1].match(/.com\/(.*)/)
	      		//-- nested in the callback is our insulting top text
	      		request('http://pleaseinsult.me/api' , function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	          var insult = JSON.parse(body);
	          console.log(insult.insult) 
	          // -- resize cat image and save
	          gm(imgUrl[1]).resize(500, 450, "!").write('image/memed1.jpg',function (err) {
	          	//-- format/write text onto image
	          	if (err) {
	                console.log(err);
	            } else {
	           //-- the bottomCaption should take from input form
	              var options = {
	              caption : insult.insult,
	              bottomCaption : 'also' + message
	              }
	              caption.path('image/memed1.jpg',options,function(err,captionedImage){
	              	//--err will contain an Error object if there was an error
	            		// otherwise, captionedImage will be a path to a file.
	            			if (!err) {
	            				//change to send so it sends a json of the below to be caught by angular
	                  // res.sendtojson?
	                	
	                	 sendMeme(captionedImage, phone);
	                } else {
	                 	console.log("error from mememaker: " + err)
	                };
	              });// caption
	            }
	          });// gm
	        }

	      });//request for insult
	    }
	  });//request for cat

}; //makeMeme
	
var sendMeme = function(meme, num){
	//Send an SMS text message
	client.sendMessage({

	  to:'+1' + num, // Any number Twilio can deliver to
	  from: +18322517983, // A number you bought from Twilio and can use for outbound communication
	   // body of the SMS message
	  body: "",

	  mediaUrl: "https://ralphseastresgallery.files.wordpress.com/2014/05/random1.jpg"

	  

	}, function(err, responseData) { //this function is executed when a response is received from Twilio

	  if (!err) { // "err" is an error received during the request, if any

	      // "responseData" is a JavaScript object containing data received from Twilio.
	      // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
	      // http://www.twilio.com/docs/api/rest/sending-sms#example-1

	      console.log(responseData.from); // outputs "+14506667788"
	      console.log(responseData.mediaUrl); // outputs "word to your mother."

	  } else {
	  	console.log("error message from sendMeme: " + err[0])
	  }
	});// client.sendMessage

}; //sendMeme