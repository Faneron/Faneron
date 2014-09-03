/*
Dependencies:
AWS Browser SDK
<script src="https://sdk.amazonaws.com/js/aws-sdk-2.0.0-rc13.min.js"></script>
jQuery
<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>

*/

/*
@constructor AWS_S3  Uploads the file selected in file_chooser to AWS S3 when
upload_button is clicked. The URL is pre-signed by the server, then uploaded
by the browser.

@param file_chooser  A DOM input element of type "file"
@param upload_button  A DOM input element of type "submit"
*/
function AWS_S3(file_chooser, upload_button) {
    var _file_chooser = file_chooser;
    var _upload_button = upload_button;

    /*
    @callback _finish_callback
    @param {FileList} file_list  The FileList object that was used to select the file
    @param {string}} message  A response message
    */
    var _finish_callback;
    /*
    @callback _error_callback
    @param {string} error_message
    */
    var _error_callback;

    /*
    Obtains the presigned URL from the server for the S3 Bucket "faneron-test".

    @constructor
    @param {Filelist} file_chooser  Should have one and only one file
    @param {function} success_callback(data, textStatus, jqXHR) 
    @param {_error_callback} err_callback
    */
    function get_presigned_url(file_chooser, success_callback, err_callback) {
        var file = file_chooser.files[0];
        var data = {
            "file_name": file.name,
            "file_type": file.type,
        }
        $.ajax({
            url: "/sign_s3",
            type: "POST",
            success: function(data, textStatus, jqXHR) {
                if(success_callback) success_callback(data, textStatus, jqXHR);
            },
            error: function(xhr, textStatus, errorThrown) {
                if(err_callback) err_callback(textStatus);
            }
        })
    }

    /*
    Uploads the selected file to the S3 bucket.

    @constructor
    @param {string} url  A presigned url
    @param {File} file  The file to upload
    @param {_finish_callback} success_callback
    @param {_error_callback} err_callback
    */
    function upload_to_s3(presigned_url, file_chooser, success_callback, err_callback) {
        var file = file_chooser.files[0];
        var file_reader = new FileReader();
        file_reader.onload = (function() {
            $.ajax({
                url: presigned_url,
                data: {
                    "file": this.result
                },
                type: "POST",
                success: function(data, textStatus, jqXHR) {
                    if(success_callback) success_callback(data, textStatus, jqXHR);
                },
                error: function(xhr, textStatus, errorThrown) {
                    console.log(xhr, textStatus, errorThrown)
                    if(err_callback) err_callback(textStatus);
                }
            });
        });
        file_reader.readAsText(file);
    }

    return {
        // @function onFinish
        // @link _finish_callback
        onFinish = function(callback) {
            _finish_callback = callback;
        },
        // @function onError
        // @link _error_callback
        onError = function(callback) {
            _error_callback = callback;
        },
        // Starts listening for when the upload button is clicked
        // @function execute
        execute = function() {
            $(_upload_button).click(function(event) {
                get_presigned_url(
                    _file_chooser,
                    function(data, textStatus, jqXHR) {
                        upload_to_s3(
                            data.presigned_url, 
                            _file_chooser,
                            _finish_callback,
                            _error_callback,
                        )
                    },
                    _error_callback,
                );

            });
        },
    }
}