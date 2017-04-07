DROP DATABASE IF EXISTS whydontwe;

CREATE DATABASE whydontwe;

USE whydontwe;

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
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS interests (
	id int NOT NULL AUTO_INCREMENT,
	name varchar(50),
	user_id int NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS events (
	id int NOT NULL AUTO_INCREMENT,
	name varchar(100),
	creator_id int NOT NULL, /* id IN users*/
	description varchar(250),
	eventDate date,
	location varchar(200),
	active boolean NOT NULL DEFAULT 1,
	private boolean NOT NULL DEFAULT 0,
	startTime datetime,
	endTime datetime, 
	/*
	startTime
	endTime
	*/
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS participants (
	id int NOT NULL AUTO_INCREMENT,
	user_id int,
	event_id int,
	status varchar(20) NOT NULL DEFAULT 'maybe',
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS activities (
	id  int  NOT NULL  AUTO_INCREMENT,
	name varchar(50),
	category varchar(50),
	description varchar(250) NOT NULL DEFAULT 'none',
	event_id int NOT NULL, 
	mainActivity boolean DEFAULT 0, 
	PRIMARY KEY(id)
);


CREATE TABLE IF NOT EXISTS votes (
	id  int  NOT NULL  AUTO_INCREMENT,
	activity_id int NOT NULL,
	user_id int NOT NULL,
	vote int NOT NULL DEFAULT 0,
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS comments (
	id  int  NOT NULL  AUTO_INCREMENT,
	event_id int NOT NULL,
	user_id int NOT NULL,
	body varchar(250),
	PRIMARY KEY(id) 
);

/*
Format for altering table 
ALTER TABLE table ADD FOREIGN KEY (column)
REFERENCES othertable(column);
*/