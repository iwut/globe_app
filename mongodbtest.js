module.exports = {
	//init : function(){
/*		varr : 0,

		increment : function(){
			console.log(this.varr);
			this.varr = this.varr + 1;
		},

		obj : function(varr){
			this.var1 = varr;
			varr = varr + 1;
		},

		makeobj : function(){
			this.increment();
			var obj1 = new this.obj(this.varr);
			return obj1;

			//var obj2 = new this.obj(this.varr,this.increment);
			//var obj3 = new this.obj(this.varr,this.increment);
			//var obj4 = new this.obj(this.varr,this.increment);
			//var obj5 = new this.obj(this.varr,this.increment);
			//var obj6 = new this.obj(this.varr,this.increment);
*//*
			console.log(
				"1:"+obj1.var1
				+", 2:"+obj2.var1
				+", 3:"+obj3.var1
				+", 4:"+obj4.var1
				+", 5:"+obj5.var1
				+", 6:"+obj6.var1
				);*/
/*		},

		smalltest : function(){
			this.makeobj();
			this.makeobj();
			this.makeobj();
			console.log("X: " + this.makeobj().var1);
			console.log("test: " + this.varr);
		}


userobject{
	username
	password
	email
	telephone
	sessionid
	pinobject{
				homeposition
				visits
				distances
				totalDistance
	}
}
*/
		MongoClient : 'undefined',
		pinincrement : 0,

		createuserdata : function(username,password,email,telephone){
			var mapdata = function(){
				this.homeposition = {};
				this.visits = {};
				this.distances = {};
				this.totalDistance = 0;
			};

			var userdata = function(username1,password1,email1,telephone1){
				this.username = username1;
				this.password = password1;
				this.email = email1;
				this.telephone = telephone1;
				this.sessionid = 0;
				this.pinobject = new mapdata();
			};

			var obj = new userdata(
					username,
					password,
					email,
					telephone
				);
			return obj;

		}




		
	/*
		pin : function(pinincrement,latitude,longitude,tag,string){
			this.pinid = pinincrement;
			this.latitude = latitude;
			this.longitude = longitude;
			this.tag = tag;
			this.string = string;

			console.log("created pin!");	
		},
*/
/*
		createuser: function(username, password){


			var user = function(username, password, sessionid, userdata){
				this.username = username;
				this.password = password;
				this.sessionid = sessionid;
				this.userdata = userdata;
			};

			var newuser = new user(
					username,
					password,
					0,
					""
				);
			return newuser;
		},
*/
/*

		insertuser : function(mongoC, user, callback){
			mongoC.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  				if(err) { return console.dir(err); }

  				var collection = db.collection('users');
  				collection.insert(user, function(err, result) {
  					console.log("inserting: " + JSON.stringify(user));
  				});
			});
		},

*/
/*

		createpin : function(latitude,longitude,tag,string){
			this.pinincrement = this.pinincrement + 1;
			var newpin = new this.pin(
							this.pinincrement,
							latitude,
							longitude,
							tag,
							string
							);
			return newpin;
		},

*/

		validateLogin : function(object, callback){
			var insertuser = this.insertuser;
			var createuser = this.createuser;
			var mongoC = this.MongoClient;
			mongoC.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  				if(err) { return console.dir(err); }


  				var collection = db.collection('users');
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
			console.log("get Map Resources , " + sessionidvar);
			var mongoC = this.MongoClient;

			mongoC.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  				if(err) { return console.dir(err); }

  				var collection = db.collection('userdata');
    			collection.findOne({sessionid:sessionidvar}, function(err, item) {	
    				if(typeof item === 'undefined'|| item==null){
    					item = {};
   						//console.log("'" + object.username + "/" + object.password + "' was undefined");
						item.username = 'null';
						//insertuser(mongoC,createuser(object.username, object.password),function(){});
   					};
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
  						pinobject = object.pinobject;
						};
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

			mongoC.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  				if(err) { return console.dir(err); }

  				var collection = db.collection('userdata');
    			collection.findOne({username:sessionidvar}, function(err, item) {	
    				if(typeof item === 'undefined'|| item==null){
    					//item = {};
   						//console.log("'" + object.username + "/" + object.password + "' was undefined");
						//item.username = 'null';
						console.log("no user existed! :)");
						collection.insert(newuser), {w:1}, function(err, result){
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
			console.log("connecting db...");
			this.MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  				if(err) { return console.dir(err); }

  				//db.collection('pins', function(err, collection) {});

  				//db.collection('test', {w:1}, function(err, collection) {});

  				db.createCollection('pins', function(err, collection) {
  					callback();
  				});

  				//db.createCollection('test', {w:1}, function(err, collection) {});
			});
		},












		getPins : function(callback){
			this.MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  				if(err) { return console.dir(err); }

  				var collection = db.collection('pins');
    			collection.find().toArray(function(err, items) {
    				//console.log("y");
    				//console.log("items: " + items);
    				callback(items);
    			});
    			//console.log("x");
			});
		},



		insertPin : function(pin, callback){
			this.MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  				if(err) { return console.dir(err); }

  				var collection = db.collection('pins');
  				collection.insert(pin, function(err, result) {});
			});
		},




		tests : function(){
		this.insertPin(this.createpin(0,1,"TAG","first pin!"), function(){});
		this.insertPin(this.createpin(2,3,"TAG","second pin!"), function(){});
		this.insertPin(this.createpin(4,5,"TAG","third pin!"), function(){});
		this.insertPin(this.createpin(6,7,"TAG","fourth pin!"), function(){});
		this.insertPin(this.createpin(8,9,"TAG","fifth pin!"), function(){});

		//var pinArray;
		//console.log("v");
		setTimeout(
			this.getPins(
				function(pinArray){
					for (var i = 0; i < pinArray.length; i++) {
  						console.log("found pin: " + pinArray[i].string);
					}
				}
			)
		,4000);

		}
		
	//}
}





