
// This function will upload a chosen file to Faneron's 
// S3 account by getting a signature from the server
// and then uploading the file.
//
// This function has dependencies:
// jQuery 1.3+
// SWFObject 2.1+
//   src="http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"
// jQuery S3Upload: https://github.com/publicclass/s3upload
//   src="jquery.s3upload.js"
//
// dom_file_selector_string is a jQuery string selector of file
// selector element
function aws_s3(dom_file_selector_string) {
    'use strict';

    var s3_upload = new S3Upload({
        file_dom_selector: dom_file_selector_string,
        s3_sign_put_url: '/sign_s3',
        onFinishPut: function(public_url) {
            alert('Image uploaded successfully');
        },
        onError: function(status) {
            alert('Error with upload');
        }
    })
}

// Include the following code inside the file where
// files will be uploaded. Replace "files" with the
// id of the file selector.
/*
(function() {
    var input_element = document.getElementById("files");
    input_element.onchange = s3_upload;
})();
*/