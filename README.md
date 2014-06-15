Faneron Project
===============

To do:
	- Tie together projects, comments, users
	- Amazon S3... down the line lol

Models:

	User Schema:
		- First Name
		- Last Name
		- Username (really nice for urls, and adds some flavor)
		- Experience (numerical value, gained from comments, upvotes, etc...)
		- Level (some function of experience)
		- Profile Picture (image url/id/whatever from Amazon)
		- Methods:
			function edit(text) // edit text fields, such as first name, last name, username

	Project Schema:
		- User ID (who created this project)
		- Time Stamp
		- Title
		- Subheading/tagline
		- Main Description
		- Gameplay Description
		- Lore Description
		- Main Image Tag (url/ID/whatever for the "cover" image of the project)
		- Additional Image Tags (array of Image object IDs/urls/whatever)
		- Views (how many HTTP GET's to this project)
		- Score (upvotes)
		- Comments (array of Comment object IDs)
		// - Other media down the line (i.e. videos, sound bytes, whatever) ***
		- Methods:
			function editText(field, text) // edit a text field such as title, subheading, descriptions...
			function addImage(url) // upload local file to Amazon, add image to the project
			function addComment(text) // add a comment to the project
			function deleteImage(url)

	Comment Schema:
		- User ID (who wrote the comment)
		- Project ID (what comment this project is on)
		- Time Stamp (when was it created)
		- Score (upvotes)
		- Replies
		- Removed (boolean)
		- Methods:
			function edit(text) // edit the text of the comment
			function delete() // remove this comment from the project (will actually just remove the text, a la reddit)


