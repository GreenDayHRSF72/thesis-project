

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
// SELECT * FROM ACTIVITIES [JOIN] WHERE users.id = 

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
	- I'm too lazy to walk (val = 250m)
	- Don't mind a short stroll (val = 500m)
	- Let's go on an adventure! (val = 1600m)
q2: How much are you looking to spend? yelp $ rating
	- I'm broke! (val = 1)
	- Looking for something reasonable (val = 2)
	- I think I can splurge a bit (val = 3)
	- Make it rain! (val = 4)
q3: is there anything you absolutely dont want to do?
	- fill in? (split to array on space string or ,)


*/
/*
>>overall flow of suggestions
collect 
*/

// get all the information from db
var myInterests = [{name: 'bars'}, {name: 'whiskey'}, {name: 'bacon'}, {name: 'pomeranians'}];
var myVotes = [{name: 'Mikkeler', category: 'bars'}, ];
var myTrips = [];


// clump together interests, and categories for any activity or event participated in and put it
// in an array together

// then add all the interests of your friends to that same array

// filter that array, removing any interests that were blacklisted by you and your friends
// alternatively add blacklist columns to the user progile page so those things are


// generate a number to see how many terms to search for (up to 3)

// get all the information from the questionaire
var where = 'westfield mall, san francisco';
var howFar = 

// do a search with the terms you wanted to,

// when it comes back filter it using the names of places that you've already been to

/*
>>>>>>>>>>> ALGORITHM PSEUDOCODE <<<<<<<<<<<<<<<<<

*/