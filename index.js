const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const token = require("./token");
// enable CORS
app.use(cors());
// set the port on which our app wil run
// important to read from environment variable if deploying
const port = process.env.PORT || 8000;

const API_URL = `https://tmsstaging.indiahikes.com/tms-service`;

// app.all(*) route that proxies requests to API_URL/* with the correct paramaters
app.all("*", (req, res) => {
  try {
    // get the path from the request
    const path = req.path;
    // get the query string from the request
    const query = req.query;
    // get the method from the request
    const method = req.method;
    // get the body from the request
    const body = req.body;
    // get all the headers
    const { host, ...headers } = req.headers;
    // make a request to the API_URL with the path, query, method, body and headers
    console.log(`${API_URL}${path}`);
    axios({
      url: `${API_URL}${path}`,
      method,
      params: query,
      data: body,
      headers: {
        ...headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        // if the request is successful, send the response back to the client
        res.send(response.data);
      })
      .catch((error) => {
        // if the request fails, send the error back to the client
        res.send(error);
      });
  } catch (error) {
    // if there is an error, send the error back to the client
    res.status(500).send(error);
  }
});

// console text when app is running
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
