# VALIDASI DOKUMEN
## Membuat document checking atau validasi dokumen menggunakan Amazon Textract

1. Buat Lambda Function manggunakan runtime Python 3.8 dan gunakan coding berikut ini:

```
import json
import boto3
import base64


def lambda_handler(event, context):
    eventBody = json.loads(json.dumps(event))['body']
    imageBase64 = json.loads(eventBody)['Image']
    # Amazon Textract client
    textract = boto3.client('textract')
    
    # Call Amazon Textract
    response = textract.detect_document_text(
        Document={
            'Bytes': base64.b64decode(imageBase64)
        })

    detectedText = ''
    doctype = 'UNKNOWN'

    # Print detected text
    for item in response['Blocks']:
        if item['BlockType'] == 'LINE':
            detectedText += item['Text'] + '|'   
    
    # get doc type from detected text
    if (detectedText.lower().find("nik") != -1 and detectedText.lower().find("agama") != -1 and detectedText.lower().find("kewarganegaraan") != -1 and detectedText.lower().find("darah") != -1):
        doctype = "KTP"
    if (detectedText.lower().find("surat izin mengemudi") != -1 and detectedText.lower().find("driving license") != -1 ):
        doctype = "SIM"
            
    result= {
        'document_type':doctype,
        'detected_text':detectedText
    }

    return {
        'statusCode': 200,
        'headers': {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(result)
    }
```

2. Dalam Lambda Editor, pilih menu "Configuration -> Permission" dan klik pada Role Name di bagian Execution Role, akan terbuka window baru untuk menu IAM

3. Di menu IAM, klik tombol "Attach Policies" dan tambahkan "AmazonTextractFullAccess" Policy

4. Buat API Gateway lambda proxy, enable CORS dan deploy

Masuk ke halaman API Gateway kemudian pilih `Create API` -> `REST API` -> `Build`. 

Pilih `New API`. Isi nama API dengan `Endpoint Type` Regional, lalu klik `Create API`. 

Masuk ke dashboard API Gateway, kemudian pilih API yang tadi kita buat. 

![API](img/apiname.png "API")

Kemudian, pada jendela di sebelah kiri, pilih Resources. Di Bagian Resources, pilih Create Resources

`Resource Name` isi proxy kemudian `Create Resource`. 

Klik methods `proxy` yang tadi kita buat, kemudian pada tombol `Actions` -> `Create Methods`. Pilih `Post`

Untuk setup methods pilih Integration type `Lambda Function`, centang untuk `Use Lambda Proxy Integration`, Lambda pilih fungsi yang kita buat di step 1 lalu klik `Save`

![API](img/lambda.png "API")

Untuk melakukan deployment API yang sudah kita buat, pilih `Actions` lalu `Deploy API`

Deployment stage pilih `New Stage`

Stage name dev lalu klik Deploy. Jika sukses maka kita akan mendapatkan URL API Gateway kita

![API](img/deploy.png "API")


5. Buat S3 bucket dan enable website hosting

Masuk ke halaman S3, kemudian pilih `create bucket`. Isi nama bucket kemudian uncheck block public access 

![Create Bucket](img/createbucket.png "Create Bucket")

Klik `create` 

![Bucket](img/bucket.png "Bucket")

Untuk enable webhosting di S3, klik nama bucket, kemudan pilih tab `Properties`. Scroll ke bawah di bagian `Static website hosting` kemudian pilih `Edit`

Pada `Static website hosting` pilih `enable`, kemudian `Hosting Type` pilih `Host a static website`, untuk `Index document` isi `index.html`

![Bucket](img/hosting.png "Bucket")

Kalau sudah, klik `Save changes`

6. donwload code html, js dan deploy ke S3

Untuk contoh code ada di `code` folder, download terlebih dahulu file yang ada di folder tersebut.

Rubah End Point dari API Gateway yang ada di javascript file di `js/script.js`

Pada halaman S3, pilih bucket yang sudah kita buat sebelumnya, kemudian klik `Upload` code yang sudah kita download.

![Bucket](img/upload.png "Bucket")

Klik tombol `Upload` untuk jika sudah selesai.

7. Testing website

Setelah melakukan setup, kita bisa mencoba website yang sudah kita buat dengan mengakses ke end point static website di S3 kita. Untuk mengetahui end point website, kita bisa masuk ke bucket kita, kemudian pilih tab `Properties` lalu scroll ke bawah untuk website end point kita.

![Bucket](img/endpoint.png "Bucket")
