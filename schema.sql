DROP DATABASE IF EXISTS whydontwe;

CREATE DATABASE whydontwe;

USE whydontwe;

/*
Column parameters
name type null status defaults/specail comments 

*/
CREATE TABLE if NOT EXISTS test (
	id int NOT NULL AUTO_INCREMENT,
	value varchar(100) NOT NULL 'im a variable number of characters',
	PRIMARY KEY(id)
);

/* fake information for test purposes */
INSERT INTO test (value) VALUES ('Hello there');
INSERT INTO test (value) VALUES ('Hello there');
INSERT INTO test (value) VALUES ('Hello there');
INSERT INTO test (value) VALUES ('Hello there');
INSERT INTO test (value) VALUES ('Hello there');

CREATE TABLE IF NOT EXISTS users (
  id int NOT NULL AUTO_INCREMENT,
  username varchar(100) NOT NULL DEFAULT 'Guest',
  email varchar(50),
  phone varchar(20),
  /*
  friends?
  activeEvents
  pastEvents
  interests
  */
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS interests (
	id  int  NOT NULL  AUTO_INCREMENT,
	name varchar(50),
	user_id  int NOT NULL,
	PRIMARY KEY (id),
);

CREATE TABLE IF NOT EXISTS events (
	id  int  NOT NULL  AUTO_INCREMENT,
	name varchar(100),
	creator_id int NOT NULL, /* id IN users*/
	description varchar(250),
	eventDate date,
	location varchar(200),
	active  /
	private
	startTime
	endTime
	/*
	participants
	startTime
	endTime
	*/
	PRIMARY KEY(id)
);

CR

CREATE TABLE IF NOT EXISTS activities (
	id  int  NOT NULL  AUTO_INCREMENT,
	name
	category 
	description
	event_id
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS  votes (
	id  int  NOT NULL  AUTO_INCREMENT,
	activity_id int NOT NULL,
	user_id int NOT NULL,
	vote int DEFAULT 0,
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS comments (
	id  int  NOT NULL  AUTO_INCREMENT,
	activity_id int NOT NULL,
	user_id int NOT NULL,
	body varchar(250),
	PRIMARY KEY(id) 
);

/*
Format for altering table 
ALTER TABLE table ADD FOREIGN KEY (column)
REFERENCES othertable(column);
*/