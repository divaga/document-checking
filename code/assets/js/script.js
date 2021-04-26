$(function(){

    var ul = $('#upload ul');

    $('#drop a').click(function(){
        $(this).parent().find('input').click();
    });


    $('#upload').fileupload({

        dropZone: $('#drop'),

        add: function (e, data) {

            getBase64Image( data.files[0] );

        },

        progress: function(e, data){


        },

        fail:function(e, data){
            data.context.addClass('error');
        }

    });


    $(document).on('drop dragover', function (e) {
        e.preventDefault();
    });

    function formatFileSize(bytes) {
        if (typeof bytes !== 'number') {
            return '';
        }

        if (bytes >= 1000000000) {
            return (bytes / 1000000000).toFixed(2) + ' GB';
        }

        if (bytes >= 1000000) {
            return (bytes / 1000000).toFixed(2) + ' MB';
        }

        return (bytes / 1000).toFixed(2) + ' KB';
    }

    function getBase64Image(img) {
        var reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onload = function () {
            var data = reader.result.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
            document.getElementById('imgupload')
                .setAttribute(
                    'src', reader.result
                );
            sentAPIGW(data);
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    function putLine(type, msg, type2, msg2) {
        document.getElementById('detected-text').innerHTML = '<p style="color:white"><b>' + type + '</b>'  + msg + '<br><b>' + type2 + '</b>' + msg2 + '</p>';

        console.log(msg2)
    }

    function sentAPIGW(data) {
        $.ajax({
            type: 'POST',
            crossDomain: true,
            headers: {
                // 'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
                // "Access-Control-Allow-Origin": "*",
                // "Content-Type": "application/json"
                "X-Api-Key": 'blablabla'
                // "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
            },
            url: 'https://gv69yuq6p9.execute-api.ap-southeast-1.amazonaws.com/dev/proxy',
            data: JSON.stringify({ 
                'Image': data
            }),
            dataType: 'json',
            contentType: "application/json",
            success: function(msg){
                console.log('Success ');
                putLine('Document Type:', msg.document_type, 'Document Text:', msg.detected_text.replaceAll("|", "\n"));
            }
        });
    }

});
