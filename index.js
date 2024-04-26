// Import required modules
var express = require('express');
var app = express();
const storage = require('node-persist');
var bodyParser = require('body-parser');

// Create a JSON parser 
var jsonParser = bodyParser.json();

// Initialize storage
storage.init();

// Endpoint to get details of all students
app.get('/allStudents', async (req, res) => {
  const allStudents = await storage.values();

  if (allStudents.length > 0) {

    // Format the response with details of all students
    const formattedResponse = allStudents.map(student => {
      return `Student id: ${student.student_id}<br>Name: ${student.student_name}<br>GPA: ${student.student_GPA}<br><br><br>`;
    }).join('\n');

    res.send(`All Students Data: <br><br> ${formattedResponse}`);
  } else {
    res.send("No student data available.");
  }
});


// Endpoint to get details of a specific student by ID
app.get('/student/:id', async (req, res) => {

  const studentDetails = await storage.getItem(req.params.id);

  if (studentDetails) {
    // Format the response
    const formattedResponse = `Student Detail: <br><br> Student id: ${studentDetails.student_id}<br>Name: ${studentDetails.student_name}<br>GPA: ${studentDetails.student_GPA}`;
    res.send(formattedResponse);
  } else {
    res.status(404).send("Student not found");
  }
});


// Endpoint to get details of the student with the highest GPA
app.get('/topper', async (req, res) => {
  const allStudents = await storage.values();

  if (allStudents.length > 0) {

    // Find the student with the highest GPA
    const topper = allStudents.reduce((prev, current) => {
      return (prev.student_GPA > current.student_GPA) ? prev : current;
    });

    // Format the response for the topper
    const formattedResponse = `Student Detail: <br><br> Student id: ${topper.student_id}<br>Name: ${topper.student_name}<br>GPA: ${topper.student_GPA}<br>`;
    res.send(formattedResponse);
  } else {
    res.send("No student data available.");
  }
});




// Endpoint to add  student details by ID using a POST request




app.post("/student", jsonParser, async (req, res) => {
  // Extract student details from the request body
  const { student_id, student_name, student_GPA } = req.body;



  // Check if the student ID already exists
  const existingStudent = await storage.getItem(student_id);

  if (existingStudent) {
    // If the student ID already exists, send a response indicating the duplication
    res.status(400).send("Student not added. ID already exists.");
  } else {
    // If the student ID is unique, store the details as an object


    // Store the details as an object
    const studentDetails = {
      student_id,
      student_name,
      student_GPA
    };


    await storage.setItem(student_id, studentDetails);
    res.send("Added student!");

  }
});






// Start the server on port 5000
app.listen(5000, () => {
  console.log("Server has started");
});

