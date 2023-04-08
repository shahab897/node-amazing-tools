# Node.js Tools

This is a collection of small tools built with Node.js. Each tool is described below along with instructions on how to install and use it.

### Installation

To install the dependencies and start the server, run the following commands:

```bash
npm install
npm start
```
By default, the server will listen on port 3000.

## 1. Password Generator

This is a simple API for generating random passwords of a specified length and type.

### Usage

Send a POST request to `/api/password` with the desired length and type in the request body. The length should be an integer between 1 and 128, and the type can be `numeric`, `uppercase`, `lowercase`, or `mix`.

## 2. PDF to Word Conversion API

This is a simple Node.js API for converting PDF files to Word documents using "pdf-text-extract" package.

### Usage

The API has a endpoint, `/api/convert`, which can be accessed via a `POST` request. The endpoint expects a  key `pdfPath` containing the pdf file path.

The API will return a JSON response with a status code of 200 and a message "PDF has been converted to Word" and file location if the conversion was successful. If an error occurs, the API returns a JSON response with a status code of 500 and the error message.

# 3. RSS Feed Reader API

This API retrieves the latest items from an RSS feed URL.

### Usage

Send a POST request to the API endpoint , `/api/rss` with the feedUrl parameter containing the URL of the RSS feed to retrieve.

The API will return a JSON array of feed items, each containing title, link, and pubdate properties.

## License

This project is licensed under the [MIT license](https://opensource.org/licenses/MIT). Feel free to use it however you like.




