const express = require('express');
const app = express();
const axios = require('axios'); // For making external requests

const TEST_SERVER_URL= "http://20.244.56.144/test/prime";

function fetchNumbers(numberId) {
  const url =`${TEST_SERVER_URL}& ${numberId}` ;
  try {
    const response = await axios.get(url);
    return response.data.numbers;
  } catch (error) {
    console.error('Error fetching numbers:', error);
    return [];
  }
}

// Window size for storing recent values
const windowSize = 10;

// In-memory storage for numbers (replace with a database for persistence)
let numbers = [];

// Route for calculating average
app.get('/average', async (req, res) => {
  try {
    const newNumbers = await fetchNumbers(req.query.type);
    numbers = uniqueNumbers([...numbers, ...newNumbers], windowSize);

    const windowCurrState = numbers.slice(-windowSize);
    const avg = windowCurrState.reduce((sum, num) => sum + num, 0) / windowSize;

    res.json({
      numbers,
      windowPrevState: numbers.slice(0, -windowSize),
      windowCurrState,
      avg,
    });
  } catch (error) {
    res.status(500).send('Error calculating average');
  }
});

// Routes for specific number types (replace with your logic)
app.get('/prime', (req, res) => {
  // Implement logic to generate prime numbers
  res.json({ numbers: [], windowPrevState: [], windowCurrState: [], avg: 0 });
});

app.get('/fibonacci', (req, res) => {
  // Implement logic to generate fibonacci numbers
  res.json({ numbers: [], windowPrevState: [], windowCurrState: [], avg: 0 });
});

function uniqueNumbers(arr, windowSize) {
  return arr.filter((num, index) => arr.indexOf(num) === index).slice(-windowSize);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server run at port 3000");
});