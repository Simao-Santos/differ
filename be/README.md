# Differ Backend

Backend module for the Differ website automated testing application. This backend needs a connection to a PostgreSQL database to work correctly.

---
## Requirements

To run this server, you need [*Node.js*](https://nodejs.org/) and [*npm*](https://npmjs.org/) installed.

## Run in a Docker container

To run this server in a Docker container, just run `docker build -t differ:latest .`. This will create a container with all the needed dependencies installed. The run `docker run differ:latest` to run the container.

## Run "*Dockerlessly*"

### Configure app

Before you run the server, you need to install the dependencies through *npm* (referenced in the [package.json](/package.json) file).

`npm install`

You also need the following dependencies, that need to be installed separately from the *npm* installation (check [this link](https://github.com/puppeteer/puppeteer/issues/1345#issuecomment-343538927) for more information):

```
RUN apt-get update && apt-get install -y \
  wget unzip fontconfig locales gconf-service libasound2 libatk1.0-0 \
  libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 \
  libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 \
  libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 \
  libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 \
  libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates \
  fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

### Running the server

To run the server just do `npm start`.

## API Specification

This backend uses an API to communicate with the frontend.

### **GET** /urls/{id} - Get URLs

#### Parameters

* **id**\*: Integer

###### * optional

Examples:

`GET .../urls/`

or

`GET .../urls/2`

#### Response

* **type**: String (`'get_urls'` when successful, `'error'` when not successful)
* **urls**\*: Array (list of URLs)
    * **id**: Integer
    * **url**: String
* **msg**: String

###### * not always present

Examples:
```
{
    "type": "get_urls",
    "urls": [
        {
            "id": 1,
            "url": "http://localhost:8000/"
        },
        {
            "id": 3,
            "url": "http://localhost:3000/"
        }
    ],
    "msg": "Operation successful"
}
```

or

```
{
    "type": "error",
    "msg": "Couldn't access database"
}
```

### **POST** /urls/ - Add URL

#### Parameters

* **url**: String

Example:
```
- POST .../urls/

Body:
{
    "url": http://localhost:3000
}
```

#### Response

* **type**: String (`'post_url'` when successful, `'error'` when not successful)
* **urls**\*: Array (updated list of URLs)
    * **id**: Integer
    * **url**: String
* **msg**: String

###### * not always present

Examples:
```
{
    "type": "post_url",
    "urls": [
        {
            "id": 1,
            "url": "http://localhost:8000/"
        },
        {
            "id": 3,
            "url": "http://localhost:3000/"
        }
    ],
    "msg": "Operation successful"
}
```

or

```
{
    "type": "error",
    "msg": "No specified URL"
}
```

### **DELETE** /urls/{id} - Delete URLs

#### Parameters

* **id**: Integer

Examples:

`DELETE .../urls/{id}`

#### Response

* **type**: String (`'delete_url'` when successful, `'error'` when not successful)
* **id**: Integer (ID of the URL requested to be deleted)
* **msg**: String

###### * not always present

Example:
```
{
    "type": "delete_url",
    "id": 5,
    "msg": "Operation successful"
}
```

or

```
{
    "type": "error",
    "id": 5,
    "msg": "Couldn't delete URL"
}
```

### **GET** /captures/ - Get Captures

#### Parameters

* **id**\*: Integer

###### * optional

Examples:

`GET .../captures/`

or

`GET .../captures/2`

#### Response

* **type**: String (`'get_captures'` when successful, `'error'` when not successful)
* **urls**\*: Array (list of Captures)
    * **id**: Integer
    * **text_location**: String (text file path)
    * **image_location**: String (image path file)
    * **date**: String (date the capture was created)
* **msg**: String

###### * not always present

Examples:
```
{
    "type": "get_captures",
    "captures": [
        {
            "id": 29,
            "text_location": "./shots/url_14_2020_11_10_18_19_52_766.html",
            "image_location": "./shots/url_14_2020_11_10_18_19_52_766.png",
            "date": "2020-11-10T18:19:52.766Z"
        },
        {
            "id": 30,
            "text_location": "./shots/url_13_2020_11_10_18_21_22_597.html",
            "image_location": "./shots/url_13_2020_11_10_18_21_22_597.png",
            "date": "2020-11-10T18:21:22.597Z"
        },
        {
            "id": 31,
            "text_location": "./shots/url_14_2020_11_10_18_30_21_299.html",
            "image_location": "./shots/url_14_2020_11_10_18_30_21_299.png",
            "date": "2020-11-10T18:30:21.299Z"
        }
    ],
    "msg": "Operation successful"
}
```

or

```
{
    "type": "error",
    "msg": "Couldn't access database"
}
```

### **GET** /captures/byPageId/ - Get Captures by Page ID

#### Parameters

* **id**: Integer

Examples:

`GET .../captures/byPageId/2`

#### Response

* **type**: String (`'get_captures_by_page_id'` when successful, `'error'` when not successful)
* **urls**\*: Array (list of Captures)
    * **id**: Integer
    * **text_location**: String (text file path)
    * **image_location**: String (image path file)
    * **date**: String (date the capture was created)
* **msg**: String

###### * not always present

Examples:
```
{
    "type": "get_captures_by_page_id",
    "captures": [
        {
            "id": 30,
            "text_location": "./shots/url_13_2020_11_10_18_21_22_597.html",
            "image_location": "./shots/url_13_2020_11_10_18_21_22_597.png",
            "date": "2020-11-10T18:21:22.597Z"
        }
    ],
    "msg": "Operation successful"
}
```

or

```
{
    "type": "error",
    "msg": "Couldn't access database"
}
```

### **DELETE** /captures/ - Delete Capture

#### Parameters

* **id**: Integer

Examples:

`DELETE .../captures/2`

#### Response

* **type**: String (`'delete_capture'` when successful, `'error'` when not successful)
* **id**: Integer (ID of the capture requested to be deleted)
* **msg**: String

Examples:
```
{
    "type": "delete_capture",
    "id": "29",
    "msg": "Operation successful"
}
```

or

```
{
    "type": "error",
    "id": "6",
    "msg": "Couldn't delete capture"
}
```

### **GET** /comparisons/ - Get Comparisons
TODO

### **GET** /actions/capture/{id} - Capture URL

#### Parameters

* **id**: Integer

Examples:

`GET .../actions/capture/{id}`

#### Response

* **type**: String (`'capture_url'` when successful, `'error'` when not successful)
* **id**: Integer (ID of the URL requested to be captured)
* **msg**: String

Example:
```
{
    "type": "capture_url",
    "id": 5,
    "msg": "Capture started"
}
```

or

```
{
    "type": "error",
    "id": 5,
    "msg": "Couldn\'t get URL to capture"
}
```

### **GET** /actions/compare/{id} - Compare URL with latest capture (takes a capture of current state)

#### Parameters

* **id**: Integer

Examples:

`GET .../actions/compare/{id}`

#### Response

* **type**: String (`'compare_url'` when successful, `'error'` when not successful)
* **id**: Integer (ID of the URL requested to be compared)
* **msg**: String

Example:
```
{
    "type": "compare_url",
    "id": 5,
    "msg": "Comparison started"
}
```

or

```
{
    "type": "error",
    "id": 5,
    "msg": "Couldn't get URL to compare"
}
```