DROP DATABASE IF EXISTS whydontwe;

CREATE DATABASE whydontwe;

USE whydontwe;

/*
Column parameters
name type null status defaults/specail comments 

*/

CREATE TABLE IF NOT EXISTS users (
  id  int NOT NULL AUTO_INCREMENT,
  username varchar(100) NOT NULL DEFAULT 'Guest',
  email varchar(50),
  phone varchar(20),
  tokeyn
  /*
  friends
  activeEvents
  pastEvents
  interests
  */
);

f

CREATE TABLE IF NOT EXISTS events (
	id
	name
	description
	eventDate
	location
	active
	private
	startTime
	endTime
	/*
	participants
	startTime
	endTime
	*/
);

CREATE TABLE IF NOT EXISTS activities (
	id
	name
);

CREATE TABLE IF NOT EXISTS comments (
	activity_id 
	user_id
	body
);


/*
Format for altering table 
ALTER TABLE table ADD FOREIGN KEY (column)
REFERENCES othertable(column);
*/