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

### **GET** /urls/capture/{id} - Capture URL

#### Parameters

* **id**: Integer

Examples:

`GET .../urls/capture/{id}`

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

### **POST** /urls/compare/ - Compare URLs
TODO

### **GET** /capture/ - Get Captures
TODO

### **GET** /comparisons/ - Get Comparisons
TODO