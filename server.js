var session = require('express-session');
var http = require('http');
var express = require('express');
var app = express();
var mongojs = require('mongojs');
var bodyParser = require('body-parser');

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	next();
});

app
.use(express.static(__dirname + '/public'))
.use(bodyParser.json({limit: '50mb'}))
.use(session(
		{ 
			secret: 'keyboard cat', 
			cookie: { maxAge: 0.5*60*1000 },  //5 minutes
			resave: true, 
			saveUninitialized: true 
		}
	)
)
.use(bodyParser.urlencoded({extended: true}))
.listen(3000)
;

var api_path = '../website_researchmoz1/api/';

var api_files = [
	{api : api_path + 'countries.js'},
	{api : api_path + 'publishers.js'},
	{api : api_path + 'main_categories.js'},
	{api : api_path + 'sub_categories.js'},
	{api : api_path + 'articles.js'},
	{api : api_path + 'press_releases.js'},
	{api : api_path + 'reports.js'},
	{api : api_path + 'user.js'},
	{api : api_path + 'email.js'},
];

var db = mongojs('db_website_researchmoz1', 
	[
	 	'collection_user',
	 	'collection_countries',
	 	'collection_publishers',
	 	'collection_main_categories',
	 	'collection_sub_categories',
	 	'collection_articles',
	 	'collection_press_releases',
	 	'collection_reports',
	 	
	]
);

api_files.forEach(function(each_item){
	require(each_item.api)(app, db);
});

console.log("Server running on port 3000");