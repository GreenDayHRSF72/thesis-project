/*
Recommendation Algorithm Planning

High-level idea: 
- factors involved
	- users past history (activities)
	- what the user's interests are (yours, maybe people invite)?
	- cost 
	- time complexity
	- location convenience? Might not be possible
	- commute 
	- complementary activities, movies/meal? 
	- whats going on nao
	- what the user 
	- what the people are on the trip? 
	- search the yelp api 
	- your past votes

ideas (do a point system ?);

how would you rank the parameters for suggestion ?



*/
// get all the activities that you have done
// SELECT * FROM ACTIVITIES [JOIN] WHERE users.id = part

/*
>>>>DB sample queries<<<<

// get all the activities that you have done
// SELECT * FROM ACTIVITIES [JOIN] WHERE users.id = part

// get all you the user interests
	SELECT name FROM interests where where 

*/



// 

/* Suggestion wizard

q1: where are you looking to go?
	- current location (use geolocation)
	- other location (use google geocoding)
		- enter nearby address
q1a How far are you looking to go?
	- It's gotta be in 
	- 
	- 
q2: How much are you looking to spend? yelp $ rating
	- I'm broke!
	- Looking for something reasonable
	- I think I can splurge a bit
	- Make it rain!
q3: is there anything you absolutely dont want to do?
	- fill in?


*/

