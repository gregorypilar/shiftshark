var express = require('express');
var router = express.Router();
var Employee = require('../models/employee');
var Schedule = require('../models/schedule');
var words = require('random-words');

/**
 * API Specification Authors: aandre@mit.edu, gendron@mit.edu
 * Authors: gendron@mit.edu, aandre@mit.edu
 */

/**
 * Employee Object Specification
 *
 * Employee: {
 *   _id: EmployeeID,
 *   firstName: String,
 *   lastName: String.
 *   email: String
 * }
 */

/**
 * POST /users/employers/
 *
 * Description: Create a new employer account with a schedule.
 *
 * Permissions: Any unauthenticated user.
 *
 * Request: {
 *   schedule_name: String,
 *   first_name: String,
 *   last_name: String,
 *   email: Email,
 *   password: String
 * }
 *
 * Error:
 *   400 - Validation error.
 *
 */

router.post('/employers', function(req, res) {
  // TODO: validate
  var userAttributes = {
    firstName: req.body.first_name,
    lastName: req.body.last_name,
    username: req.body.email
  };
  // create Employee
  Employee.register(new Employee(userAttributes), req.body.password, function(err, user) {
    if (err) {
      res.status(400).send('USER_EXISTS');
    } else {
      // create Schedule owner by this employee
      var newSchedule = new Schedule({ name: req.body.schedule_name, owner: user._id });
      newSchedule.save(function(err, schedule) {
        if (err) {
          res.status(500).end();
        } else {
          // link employee back to schedule
          user.schedule = schedule;
          user.save(function(err) {
            if (err) {
              res.status(500).end();
            } else {
              res.status(200).end();
            }
          });
        }
      });
    }
  });
});

 /**
 * POST /users/employees/
 *
 * Description: Creates an employee within the schedule, generates password, and sends email notification.
 *
 * Permissions: An employer may create an employee within the schedule.
 *
 * Request: {
 *   first_name: String,
 *   last_name: String,
 *   email: Email
 * }
 *
 * Error:
 *   400 - Validation error.
 *
 */

router.post('/employees', function(req, res) {
  // TEST ME
  // check permissions
  // TODO: validate
  var userAttributes = {
    firstName: req.body.first_name,
    lastName: req.body.last_name,
    username: req.body.email,
    schedule: req.user.schedule._id // use employer's schedule
  };
  var generatedPassword = words({ min: 3, max: 5, join: '' });
  Employee.register(new Employee(userAttributes), generatedPassword, function(err, user) {
    if (err) {
      // handle error
    } else {
      // send employee an email
      var body = "Welcome to ShiftShark. An employee account has been \
        created on your behalf. Please login with the following credentials: \n\n\
        email: " + req.body.email +
        "\npassword: " + generatedPassword;
      res.mail.sendMail({
        to: req.body.email,
        replyTo: 'shiftshark@mit.edu',
        subject: 'ShiftShark Employee Account',
        text: body
      });
      res.send(200);
    }
  });
});

/**
 * GET /users/employees/
 *
 * Description: Retrieves all employees within the schedule.
 *
 * Permissions: Employers only.
 *
 * Response: {
 *   employees: Employee[]
 * }
 *
 */

router.get('/employees', function(req, res) {
  // TEST ME
  // check permissions
  Employee.find({ schedule: req.user.schedule._id }, function(err, employees) {
    if (err) {
      // handle error
    } else {
      return res.json({ employees: employees });
    }
  });
});

 /**
 * GET /users/:id
 *
 * Description: Retrieves information about specified user.
 *
 * Path Params:
 *   id - EmployeeID
 *
 * Permissions: Employers only.
 *
 * Response: {
 *   employee: Employee
 * }
 *
 */

router.get('/:id', function(req, res) {
  // TEST ME
  // check permissions
  Employee.findById(req.params.id, function(err, employee) {
    if (err) {
      // handle error
    } else {
      return res.json({ employee: employee });
    }
  });
});

module.exports = router;
