module.exports = {

		MongoClient : 'undefined',
		pinincrement : 0,

		createuserdata : function(username,password,email,telephone){
			var mapdata = function(){
				this.homeposition = null;
				this.visits = [];
				this.distances = [];
				this.totalDistance = 0;
                this.travelPaths = [{name: "First path!", color: 'red', visits: []}];
			};

			var scrapdata = function(){
				this.bumpMapString = "earthbump1k.jpg";
				this.specularMapString = "earthspec1k.jpg";
				this.mapString = "earthmap1k.jpg";
				this.backgroundColor = "black";

			}

			var userdata = function(username1,password1,email1,telephone1){
				this.username = username1;
				this.password = password1;
				this.email = email1;
				this.telephone = telephone1;
				this.sessionid = ""+Math.floor(Math.random() * 100000000000000) + 1;
				this.pinobject = new mapdata();
				this.extra = new scrapdata();
			};

			var obj = new userdata(
					username,
					password,
					email,
					telephone
				);
			return obj;

		},




		validateLogin : function(object, callback){
			var insertuser = this.insertuser;
			var createuser = this.createuser;
			var mongoC = this.MongoClient;
			mongoC.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  				if(err) { return console.dir(err); }


  				var collection = db.collection('userdata');
    			collection.findOne({username:object.username, password:object.password}, function(err, item) {	
    				if(typeof item === 'undefined'|| item==null){
    					item = {};
   						console.log("'" + object.username + "/" + object.password + "' was undefined");
						item.sessionid = -1;
						//insertuser(mongoC,createuser(object.username, object.password),function(){});
   					};
    				//set new sessionid into the db
    				callback({sessionid: item.sessionid});
    			});
			});
			
		},


	/*
	takes session id parameter and returns result into callback function
	*/
		getMapResources : function(sessionidvar, callback){
			//console.log("get Map Resources , " + sessionidvar.sessionid);
			var mongoC = this.MongoClient;
			mongoC.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  				if(err) { return console.dir(err); }

  				var collection = db.collection('userdata');
    			collection.findOne({sessionid:sessionidvar.sessionid}, function(err, item) {	
    				if(typeof item === 'undefined'|| item==null){
    					//console.log('item!: '+item + ".... err: " + err);
    					item = {};
   						//console.log("'" + object.username + "/" + object.password + "' was undefined");
						item.username = 'null';
						//insertuser(mongoC,createuser(object.username, object.password),function(){});
   					}else{
   						//console.log("found shit! : " + JSON.stringify(item));
   					}
    				//set new sessionid into the db
    				callback(item);
    			});
			});
		},

		//takes entire data object and loads into
		updateMapResources : function(object, callback){
			console.log("update map resources " + JSON.stringify(object));
			var mongoC = this.MongoClient;

			mongoC.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  				if(err) { return console.dir(err); }

  				var collection = db.collection('userdata');
  				collection.update({sessionid:object.sessionid}, {
  					$set:{
  						pinobject : object.pinobject
						}
  					
  				}, function(err, result) {
  					console.log("update done.");
    				callback();
    			});
			});
		},

	/*
		takes a userobject, and if the username does not already exist,
		create a new userdata object in the collection.
	*/
		signup : function(userobject, callback){
			console.log("signup: " + JSON.stringify(userobject));
			var mongoC = this.MongoClient;
			var newuser = this.createuserdata(
							userobject.username,
							userobject.password,
							userobject.email,
							userobject.telephone);

			console.log('Trying to create: ' + JSON.stringify(newuser));

			mongoC.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  				if(err) { return console.dir(err); }

  				var collection = db.collection('userdata');
    			collection.findOne({username:userobject.username}, function(err, item) {	
    				if(typeof item === 'undefined'|| item==null){
    					//item = {};
   						//console.log("'" + object.username + "/" + object.password + "' was undefined");
						//item.username = 'null';
						console.log("no user existed! :)");
						collection.insert(newuser, {w:1}, function(err, result){
								console.log("insert error: "+err);
								callback({exists:false});
						});

						//insertuser(mongoC,createuser(object.username, object.password),function(){});
   					}else{
   						console.log("user already exists... :(");
   						callback({exists:true});
   					}
    				//set new sessionid into the db
    				
    			});
			});
		},


		connectDb : function(callback){
			this.MongoClient = require('mongodb').MongoClient;
			//console.log("connecting db...");
			this.MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  				if(err) { return console.dir(err); }

  				//db.collection('pins', function(err, collection) {});

  				//db.collection('test', {w:1}, function(err, collection) {});

  				db.createCollection('pins', function(err, collection) {
  					callback();
  				});

  				//db.createCollection('test', {w:1}, function(err, collection) {});
			});
		}







}





