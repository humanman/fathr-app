// -- EXPRESS --
var express 				= require('express');
var app 						= express();
var bodyParser 			= require('body-parser');
var morgan 					= require('morgan');
var methodOverride 	= require('method-override');
var request         = require('request')
var ejs             = require('ejs')
// -- MONGODB --
// var db 							= require('./config/db-dev.js');
// var MongoDB 				= require('mongodb');
// var MongoClient  		= MongoDB.MongoClient;
// var ObjectID 				= MongoDB.ObjectID;
var port 						= 5000;
var Alert 					= require('./models/alert.js');
// var mName  					= process.env.MONGO_NAME;
// var mPw	 						= process.env.MONGO_PASSWORD;
    
// var mUrl 						= "mongodb://" + mName + ":" + mPw + "@d@ds047592.mongolab.com:47592/fathr"
    
// -- TWILIO ---
var sid 						= process.env.TWILIO_ACCOUNT_SID;
var tok 						= process.env.TWILIO_AUTH_TOKEN;
var myNum       	 	= process.env.TWILIO_NUMBER;
var client          = require('twilio')(sid, tok);



// -- IMAGE MAGICK --
var fs              = require("fs");
var caption         = require('./caption-mod/index.js');
var im              = require('imagemagick');
// var gm              = require('gm')
var gm 							= require('gm').subClass({
    imageMagick: true
});
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


app.listen(process.env.PORT || port)

console.log('Charlie! You did it! ' + port);


// == SERVER ==
console.log('MongoDB unhooked');
console.log('Twilio unhooked');
//---- for dev
// MongoClient.connect( 'mongodb://localhost:27017/alerts', function(error, db){
//---- for prod
// MongoClient.connect(mUrl, function(error, db){
 // if(error){throw error}
 //   console.log('connected');

//--- temp db
	// var dataObj = {
	//   "alerts": [
	//     {
	//       "message"	: "Lorem ipsum",
	//       "phone"		: "7777777777",
	//       "due_at"		: "2015-10-11"
	//     }
	//   ]
	// };

// SERVER ROUTES ======================================
       
	app.get('/', function(req, res){
		var conj = randElement(conjArr);
 		var task = randElement(taskArr);
 		var sampleCaption = conj + " " + task;

 		
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
	         
	          console.log(body)
	       
	          // -- resize cat image and save
	          gm(imgUrl[1]).resize(500, 450, "!").write('image/memed1.jpg',function (err) {
	          	//-- format/write text onto image
	          	if (err) {
	                console.log(err);
	            } else {
	           //-- the bottomCaption should take from input form
	           	
	              var options = {
		              caption : insult.insult,
		              bottomCaption : sampleCaption
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
	  var message = req.body.message;
	  var date		= req.body.date;
	  var phone		= req.body.phone;
	 	var bDate		= new Date(date).toDateString();
		var bTime		= tConv(new Date(date));
	 	var phnFmt 	= formatNum(phone);
	 	
		res.json({message: message, date: bDate + " at " + bTime,  phone: phnFmt})
	  // console.log(req.body.due_at);

	  	//--- this doesn't fucking work!
  		// db.colleciton('alerts').find({due_at: {$lte: new Date()}})
	
	   
  	//---- for temp db
	  // dataObj.alerts.push({message: message, date: date, phone: phone});
  	

	  //---- for mongodb
		  // db.collection('alerts').insert({
		  // 	message : message,
		  // 	phone		: phone,
		  // 	due_at 	: date
		  // }, function(error, data){
		  // 	if(error){throw error}
		  //   	else{
		    		makeMeme(req.body.message, req.body.phone);
		  //   		console.log(message + "sending /alert data your way!")
		  //   		console.log(JSON.stringify(data));
		  //   }
		  // });

		
 });//app.post /newalert

 









// // == CLEANUP ==
	// 	process.on('exit', function(){
	// 	db.close();
	// });
// });//Mongo


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
	              bottomCaption : 'also, ' + message
	              }
	              caption.path('image/memed1.jpg',options,function(err,captionedImage){
	              	//--err will contain an Error object if there was an error
	            		// otherwise, captionedImage will be a path to a file.
	            			if (!err) {
	            				//change to send so it sends a json of the below to be caught by angular
	                  
	                		// console.log("path to meme: " +captionedImage)
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
	  from: "+18322517983", // A number you bought from Twilio and can use for outbound communication
	   // body of the SMS message
	  body: "",
	  mediaUrl: "https://blooming-ridge-7177.herokuapp.com/image/memed1-captioned.jpg"
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


var formatNum  = function(num){
	var numArr = num.split('');
	// console.log(numArr)
	numArr.splice(0, 0, "(");
	numArr.splice(4, 0, ")");
	numArr.splice(5,0, " ");
	numArr.splice(9,0, "-");
	console.log(numArr);
	return numArr.join('');
};

//----- option captions for landing page meme

var taskArr = [
	"return Linda's pitcher", 
	"buy chips for the party",
	"pickup birth control",
	"it's Alex's Birthday!",
	"exercise!",
	"call mom back(or don't)",
	"buy lipstick",
	"be alone with thoughts",
	"buy dogfood",
	"bring dinner home",
	"send resume now",
	"love yourself(no touching!)"
];



var conjArr = [
	"oh! and don't forget-", 
	"and remember to", 
	"also", 
	"also", 
	"and", 
	"and", 
	"...btw,",
	"...btw,"
];

//---- func to retrieve random bottom caption for sample meme on landing page
var randElement = function (arr) {
	return arr[Math.floor(Math.random() * arr.length)]
};

var tConv = function (date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}












