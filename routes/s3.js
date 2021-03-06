var AWS = require('aws-sdk');
var Project = require('../models/project').Project;
var User = require('../models/user').User;
var nconf = require('nconf');
var fs = require('fs');
var sizeOf = require('image-size');

/* Helper method to upload a local file to S3
 * @constructor upload_to_s3
 * @param {string} path  The path to the file
 * @param {string} key  The name to give the file in S3
 * @param {string} mime_type  The mime type of the file
 * @callback anonymous(err, data)  Callback after the function completes.
 *      The error and data params both are responses from S3.
 */
function upload_to_s3(path, key, mime_type, callback) {
    aws_config = nconf.get("AWS");
	console.log(aws_config);
    var bucket= aws_config.BUCKET_NAME;
	console.log(bucket);
    var file = fs.createReadStream(path);
	console.log(file);

    var params = {
        Bucket: bucket,
        Key: key,
        ContentType: mime_type,
        Body: file,
        ACL: 'public-read'
    };

    var auth = {
        "accessKeyId": aws_config.ACCESS_KEY_ID,
        "secretAccessKey": aws_config.SECRET_ACCESS_KEY
    }
	console.log(auth);

    AWS.config.update(auth);
	console.log('got to AWS config');
    var s3 = new AWS.S3();
	console.log('blah blah');
    s3.putObject(params, function(err, data) {
        callback(err, data);
    });
}

/* Expects a file and project_id. Ensure that the HTML form that posts to
 * this route has an option 'enctype="multipart/form-data"'
 * The image URL is saved to the corresponding project model.
 * @example An example HTML form to accompany this route (in Jade):
    form(role="form", action="/upload", method="post", enctype="multipart/form-data")
        input(name="project_id", hidden)
        input(name="file", type="file")
        input(type="submit", value="Submit")
 */
exports.upload = function(req, res) {
    // Get the image file from the request object
    var multer_file = req.files['file'];
    var filename = multer_file.name;
    var mime_type = multer_file.mimetype;
    var path = multer_file.path;
	console.log(multer_file);

    upload_to_s3(path, filename, mime_type, function(err, data) {

        if(err) {
            console.log(err);
            res.send(500);
			return;
        }
		// delete from uploads folder after sending to Amazon
		fs.unlink(path);
		var project_id = req.body.project_id;
        Project.findById(project_id, function(err, project) {
            if(err) {
				console.log(err);
				res.send(500);
			}
            var aws_url_to_image = "https://s3-us-west-2.amazonaws.com/" + nconf.get("AWS").BUCKET_NAME + "/" + filename;
			User.findById(project._user, function(err, data) {
				data.art.push(aws_url_to_image);
				data.save();
			});
            project.image.push(aws_url_to_image);
            project.save(function(err, data) {
                if(err){
					console.log(err);
					res.send(500);
				}                
			//res.send(aws_url_to_image);
			res.redirect('/projects/' + project_id + '/art');
            });
        });
    });
}

exports.uploadCover = function(req, res) {
    var multer_file = req.files['file'];
    var filename = multer_file.name;
    var mime_type = multer_file.mimetype;
    var path = multer_file.path;
	console.log(multer_file);

    upload_to_s3(path, filename, mime_type, function(err, data) {
		if (err) {
			console.log(err);
			res.send(500);
			return;
		}
		var dimensions = sizeOf(path);
		var height = dimensions.height / dimensions.width;
		fs.unlink(path);
		var project_id = req.body.project_id;
		Project.findById(project_id, function(err, project) {
			if (err) {
				console.log(err);
				res.send(500);
			}
			console.log('Project found');
            var aws_url_to_image = "https://s3-us-west-2.amazonaws.com/" + nconf.get("AWS").BUCKET_NAME + "/" + filename;
			User.findById(project._user, function(err, data) {
				data.art.push(aws_url_to_image);
				data.save();
			});
			project.coverImage = aws_url_to_image;
			project.image.push(aws_url_to_image);
			project.coverHeight = height;
			project.save(function(err, data) {
				if (err) {
					console.log(err);
					res.send(500);
				}
				res.redirect('/projects/' + project_id);
			});
		})
	});
}

exports.uploadProfile = function(req, res) {
    var multer_file = req.files['file'];
    var filename = multer_file.name;
    var mime_type = multer_file.mimetype;
    var path = multer_file.path;
	console.log(multer_file);
	upload_to_s3(path, filename, mime_type, function(err, data) {
		if (err) {
			console.log(err);
			res.send(500);
			return;
		}
		fs.unlink(path);
		var username = req.body.username;
		console.log(username);
		User.find({'info.username': username}, function(err, user) {
			console.log(user);
            var aws_url_to_image = "https://s3-us-west-2.amazonaws.com/" + nconf.get("AWS").BUCKET_NAME + "/" + filename;
			user[0].profile = aws_url_to_image;
			user[0].save(function(err, data) {
				if (err) {
					console.log(err);
					res.send(500);
				}
				res.redirect('/users/' + username);
			});
		});
	});
}
