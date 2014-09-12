var aws = require('aws-sdk');
var Project = require('../models/project').Project;
var nconf = require('nconf');

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
    var bucket= aws_config.BUCKET_NAME;
    var file = fs.createReadStream(path);

    var params = {
        Bucket: bucket,
        Key: filename,
        ContentType: mime_type,
        Body: file,
        ACL: 'public-read'
    };

    var auth = {
        "accessKeyId": aws_config.ACCESS_KEY_ID,
        "secretAccessKey": aws_config.SECRET_ACCESS_KEY
    }
    AWS.config.update(auth);
    var s3 = new AWS.S3();
    s3.putObject(params, function(err, data) {
        callback(err, data);
    });
}

/* Expects a file. Ensure that the HTML form that posts to
 * this route has an option 'enctype="multipart/form-data"'
 * @example An example HTML form to accompany this route (in Jade):
    form(role="form", action="/upload", method="post", enctype="multipart/form-data")
        input(name="file", type="file")
        input(type="submit", value="Submit")
 */
exports.upload = function(req, res) {
    // Get the image file from the request object
    var multer_file = req.files['file'];
    var filename = multer_file.name;
    var mime_type = multer_file.mimetype;
    var path = multer_file.path;

    upload_to_s3(path, filename, mime_type, function(err, data) {

        if(err) {
            console.log(err);
            res.send(500);
        }
        var project_id = req.body.project_id;
        Project.findById(project_id, function(err, project) {
            if(err) res.send(500);
            var aws_url_to_image = "https://s3-us-west-2.amazonaws.com/" + nconf.get("AWS").BUCKET_NAME + "/" + filename;
            project.image.push(aws_url_to_image);
            res.send(aws_url_to_image);
        });
    });
}