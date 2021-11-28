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
        url: 'https://<your-api-gateway-url-here>.amazonaws.com/dev/proxy',
        data: JSON.stringify({ 
            'Image': data
        }),
        dataType: 'json',
        contentType: "application/json",
        success: function(msg){
            console.log('Success ');
            putLine('Document Type:', msg.document_type, 'Document Data:', msg.detected_text);
        }
    });
}

function putLine(type, msg, type2, msg2) {
    info_list = '<table class="table table-hover table-sm table-bordered"><thead><tr class="table-active"><th scope="col">Kolom</th><th scope="col">Nilai</th></tr></thead><tbody>'
    for (const property in msg2) {
        info_list = info_list + `<tr><th scope="row">${property}</th><td> ${msg2[property]}</td></tr>`;
      }
    
    info_list = info_list + ' </tbody></table>';

    document.getElementById('detected-text').innerHTML = '<p style="color:black">' + type + '<br><b><font size=18>'  + msg + '</font></b><br>' + type2 + '<br>' + info_list + ' <p>';

    console.log(msg2)
}


$(document).on("click", ".browse", function() {
  var file = $(this).parents().find(".file");
  file.trigger("click");
});
$('input[type="file"]').change(function(e) {
  var fileName = e.target.files[0].name;
  $("#file").val(fileName);

var FR= new FileReader();
    
FR.addEventListener("load", function(e) {
    document.getElementById("preview").src       = e.target.result;
    var data = e.target.result.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
    console.log(data)
    sentAPIGW(data)
  }); 
FR.readAsDataURL( this.files[0] );
});
 

