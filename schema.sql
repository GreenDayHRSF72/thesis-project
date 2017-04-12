DROP DATABASE IF EXISTS friendly;

CREATE DATABASE friendly;

USE friendly;

/*
Column parameters
name type null status defaults/specail comments 

*/
CREATE TABLE if NOT EXISTS test (
	id int NOT NULL AUTO_INCREMENT,
	value varchar(100) NOT NULL DEFAULT 'im a variable number of characters',
	PRIMARY KEY (id)
);

/* fake information for test purposes */
INSERT INTO test (value) VALUES ('Hello there');
INSERT INTO test (value) VALUES ('What is going on?');
INSERT INTO test (value) VALUES ('I dont know what I am doing');
INSERT INTO test (value) VALUES ('why is coding so hard?');
INSERT INTO test (value) VALUES ('Hello seriously why is it so hard?');

CREATE TABLE IF NOT EXISTS users (
  id int NOT NULL AUTO_INCREMENT,
  username varchar(100) NOT NULL DEFAULT 'Guest',
  email varchar(50),
  phone varchar(20),
  photourl varchar(250),
  PRIMARY KEY (id)
);

INSERT INTO users (username, email, phone, photourl) VALUES ('Test Person', 'smmakowski@yahoo.com', '9736538792', 'https://s-media-cache-ak0.pinimg.com/736x/dd/03/7e/dd037e42b51536f31171309c73372805.jpg');
INSERT INTO users (username, email, phone, photourl) VALUES ('Test Friend', 'smmakowski@me.com', '9736538792', 'https://s-media-cache-ak0.pinimg.com/736x/dd/03/7e/dd037e42b51536f31171309c73372805.jpg');

CREATE TABLE IF NOT EXISTS interests (
	id int NOT NULL AUTO_INCREMENT,
	name varchar(50),
	user_id int NOT NULL,
	PRIMARY KEY (id)
);

ALTER TABLE interests ADD FOREIGN KEY (user_id) REFERENCES users(id);

INSERT INTO interests (name, user_id) VALUES ('bars', 1);
INSERT INTO interests (name, user_id) VALUES ('burritos', 1);
INSERT INTO interests (name, user_id) VALUES ('bacon', 1);
INSERT INTO interests (name, user_id) VALUES ('guns', 1);
INSERT INTO interests (name, user_id) VALUES ('sushi', 1);

CREATE TABLE IF NOT EXISTS events (
	id int NOT NULL AUTO_INCREMENT,
	name varchar(100),
	creator_id int NOT NULL, /* id IN users*/
	description varchar(250),
	eventDate date,
	location varchar(200),
	active boolean NOT NULL DEFAULT 1,
	private boolean NOT NULL DEFAULT 0,
	startTime time,
	endTime time, 
	/*
	startTime
	endTime
	*/
	PRIMARY KEY (id)
);

ALTER TABLE events ADD FOREIGN KEY (creator_id) REFERENCES users(id);

INSERT INTO events (name, creator_id, description, eventDate, location, startTime, endTime)
VALUES ('Test 1', 1, 'First event use to test out algorithm', '2017-04-27', 'San Francisco', '13:13:12', '16:12:12');
INSERT INTO events (name, creator_id, description, eventDate, active, location, startTime, endTime)
VALUES ('Test 2', 1, 'Second event use to test out algorithm', '2017-01-27', 0, 'San Francisco', '13:13:12', '16:12:12');
INSERT INTO events (name, creator_id, description, eventDate, active, location, startTime, endTime)
VALUES ('Test 3', 1, 'I\'m n not quite sure event use to test out algorithm', '2017-02-27', 0, 'San Francisco', '13:13:12', '16:12:12');
INSERT INTO events (name, creator_id, description, eventDate, active, location, startTime, endTime)
VALUES ('Test 4', 1, 'Just testing out the algortithm', '2017-03-27', 0, 'San Francisco', '13:13:12', '16:12:12');


CREATE TABLE IF NOT EXISTS participants (
	id int NOT NULL AUTO_INCREMENT,
	user_id int,
	event_id int,
	status varchar(20) NOT NULL DEFAULT 'maybe',
	PRIMARY KEY (id)
);

ALTER TABLE participants ADD FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE participants ADD FOREIGN KEY (event_id) REFERENCES events(id);

INSERT INTO participants (user_id, event_id) VALUES (1, 1);
INSERT INTO participants (user_id, event_id) VALUES (2, 1);
INSERT INTO participants (user_id, event_id, status) VALUES (1, 2, 'yes');
INSERT INTO participants (user_id, event_id, status) VALUES (2, 2, 'yes');
INSERT INTO participants (user_id, event_id, status) VALUES (1, 3, 'yes');
INSERT INTO participants (user_id, event_id, status) VALUES (2, 3, 'yes');
INSERT INTO participants (user_id, event_id, status) VALUES (1, 1, 'yes');
INSERT INTO participants (user_id, event_id, status) VALUES (1, 1, 'yes');


CREATE TABLE IF NOT EXISTS activities (
	id  int  NOT NULL  AUTO_INCREMENT,
	name varchar(50),
	category varchar(50),
	description varchar(250) NOT NULL DEFAULT 'none',
	event_id int NOT NULL, 
	mainActivity boolean DEFAULT 0, 
	PRIMARY KEY (id)
);

ALTER TABLE activities ADD FOREIGN KEY (event_id) REFERENCES events(id);

INSERT INTO activities (name, category, description, event_id, mainActivity) 
VALUES ('Mikkeler Bar', 'Bars', 'Get beers and eat sausage', 1, 1);
INSERT INTO activities (name, category, description, event_id, mainActivity) 
VALUES ('Sushiritto', 'Japanese', 'Get burritos before movie', 2, 1);
INSERT INTO activities (name, category, description, event_id, mainActivity) 
VALUES ('Gamestop', 'Electronics', 'Pick up video games for home', 3, 1);
INSERT INTO activities (name, category, description, event_id, mainActivity) 
VALUES ('Golden Gate Park Archery Field', 'Archery', 'Get beers and eat sausage maybe do some shooting', 4, 1);



CREATE TABLE IF NOT EXISTS votes (
	id  int  NOT NULL  AUTO_INCREMENT,
	activity_id int NOT NULL,
	user_id int NOT NULL,
	vote int NOT NULL DEFAULT 1,
	PRIMARY KEY (id)
);

ALTER TABLE votes ADD FOREIGN KEY (activity_id) REFERENCES activities(id);
ALTER TABLE votes ADD FOREIGN KEY (user_id) REFERENCES users(id);

INSERT INTO votes (activity_id, user_id) VALUES (1, 1);
INSERT INTO votes (activity_id, user_id) VALUES (2, 1);
INSERT INTO votes (activity_id, user_id) VALUES (3, 2);
INSERT INTO votes (activity_id, user_id) VALUES (4, 1);
INSERT INTO votes (activity_id, user_id) VALUES (1, 2);


CREATE TABLE IF NOT EXISTS comments (
	id  int  NOT NULL  AUTO_INCREMENT,
	event_id int NOT NULL,
	user_id int NOT NULL,
	body varchar(250),
	PRIMARY KEY (id) 
);

ALTER TABLE comments ADD FOREIGN KEY (event_id) REFERENCES events(id);
ALTER TABLE comments ADD FOREIGN KEY (user_id) REFERENCES users(id);

/* Not quite sure if were goining to need this table */

CREATE TABLE IF NOT EXISTS reviews (
	id int NOT NULL AUTO_INCREMENT,
	event_id int NOT NULL,
	user_id int NOT NULL,
	review varchar(250) NOT NULL DEFAULT 'No comment',
	doAgain boolean NOT NULL DEFAULT 0,
	PRIMARY KEY (id)
);



/* Live feed items table
	- author of the event
	cont need to show the mess
	- what the activity is?
	- verb? Are they creating a new event, are they dending out activity
	- correspondijg event id (from the id)
	- if they are voting (
		- activity that they voted for)
	- what the target is? the target would vary (optional) (poss foriegb key)
	-if they click on the activity it should take them somewhere?
*/
/*
Format for altering table 
ALTER TABLE table ADD FOREIGN KEY (column)
REFERENCES othertable(column);
*/