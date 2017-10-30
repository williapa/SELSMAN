var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var AWS 	   = require("aws-sdk");
var path       = require('path');
//remove endpoint to use your default aws config
AWS.config.update({
  region: "us-west-2",
  dynamodb: 'latest',
  Endpoint: "http://127.0.0.1:8080"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var port = process.env.PORT || 8080; // set our port. dynamodb local runs on 8000

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

// middleware to use for all requests
app.use(function(req, res, next) {
	console.log("HELLO");
	console.log(req.method);
	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
      //respond with 200
      res.send(200);
    }
    else {
      //move on
      next();
    }
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));	
});

router.route('/movies')
	// create a movie (accessed at POST http://localhost:8080/movies)
	.post(function(req, res) {
		console.log("post movies request: ", req.body);
		var table = "Movies";
		var params = {
		    TableName:table,
		    Item:{
		        "year": req.body.year,
		        "title": req.body.title,
		        "info":{
		            "plot": "Nothing happens at all.",
		            "rating": 0
		        }
		    }
		};

		console.log("Adding a new item...");
		docClient.put(params, function(err, data) {
		    if (err) {
		        console.error("Unable to add item. Error JSON:", JSON.stringify(err));
		        res.send(err);
		    } else {
		        console.log("Added item:", JSON.stringify(data));
				res.json({ message: 'Movie was saved!', result: JSON.stringify(data) });
		    }
		});
	})

	// get every movies (accessed at GET http://localhost:8080/api/movies)
	.get(function(req, res) {

		var params = {
    		TableName: "Movies"
    	};

    	function onScan(err, data) {
			var movies = [];
		    if (err) {
		        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
		        res.send(err);
		    } else {
		        // print all the movies
		        console.log("Scan succeeded.");
		        data.Items.forEach(function(movie) {
		        	movies.push(movie);
		            console.log(
		                movie.year + ": ",
		                movie.title, "- rating:", movie.info.rating);
		        });
		        // continue scanning if we have more movies, because
		        // scan can retrieve a maximum of 1MB of data
		        if (typeof data.LastEvaluatedKey != "undefined") {
		            console.log("Scanning for more...");
		            params.ExclusiveStartKey = data.LastEvaluatedKey;
		            docClient.scan(params, onScan);
		        } else {
		        	res.json({"movies": JSON.stringify(movies)});
		        }
		    }
		}

    	docClient.scan(params, onScan);
	});

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);