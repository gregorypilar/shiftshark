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
 *   username: String
 * }
 */

/**
 * POST /users/employers/
 *
 * Description: Create a new employer account with a schedule, and login this account.
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

router.post('/employers/', function(req, res) {
  // TODO: validate
  var userAttributes = {
    firstName: String(req.body.first_name),
    lastName: String(req.body.last_name),
    username: String(req.body.email),
    email: String(req.body.email),
    phone: String(req.body.phone),
    congregation: String(req.body.congregation),
    employer: true
  };
  // create Employee
  Employee.register(new Employee(userAttributes), String(req.body.password), function(err, user) {
    if (err) {
      res.send(err)
      res.status(400).send('USER_EXISTS');
    } else {
      // create Schedule owner by this employee
      var newSchedule = new Schedule({ name: String(req.body.schedule_name), owner: user._id });
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
              // login employer
              req.login(user, function(err) {
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
 * Response: {
 *   employee: Employee
 * }
 *
 */

router.post('/employees/', function(req, res) {
  // check permissions
  if (! req.user.employer) return res.status(401).end();

  // TODO: validate
  var userAttributes = {
    firstName: req.body.first_name,
    lastName: req.body.last_name,
    username: req.body.email,
    email: req.body.email,
    schedule: req.user.schedule, // use employer's schedule
    phone: req.body.phone,
    congregation: req.body.congregation,
  };

  var generatedPassword = words({ min: 3, max: 5 }).join("");

  Employee.register(new Employee(userAttributes), generatedPassword, function(err, user) {
    if (err) {
      return res.status(400).send('USER_EXISTS');
    }

    // send employee an email
    var body = "Bienvenido al sistema de turnos para la feria del libro.\n\n"+ 
      "Una cuenta ha sido creada en su nombre. Por favor, inicie sesión con las siguientes credenciales: \n" +
      "Email: " + req.body.email +
      "\nContraseña: " + generatedPassword
      +"\n\n\nEl Sitio se encuenta en : http://turnosstand.azurewebsites.net/";
    // res.mailer.sendMail({
    //   to: req.body.email,
    //   replyTo: 'gregoryg3@gmail.com',
    //   subject: 'Asignacion de Turnos',
    //   text: body
    // }, function(err, message) {
    //   if (err) res.status(400).send('EMAIL_ERR');
    // });
    return res.json({ employee: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      phone: user.phone,
      email: req.body.email,
      congregation: user.congregation,
    } });
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

router.get('/employees/', function(req, res) {
  // check permissions
  if (! req.user.employer) return res.status(401).end();

  Employee.find({ schedule: req.user.schedule }, 'firstName lastName username employer', function(err, employees) {
    if (err) return res.status(500).end();
    return res.json({ employees: employees });
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
 * Permissions: Employers can retrive any user within schedule, and employees can retrieve only themselves.
 *
 * Response: {
 *   employee: Employee
 * }
 *
 */

router.get('/:id', function(req, res) {
  // check permissions -- employer or self
  if (! req.user.employer && String(req.user._id) !== String(req.params.id)) {
    return res.status(401).end();
  }

  Employee.findOne({ _id: String(req.params.id), schedule: req.user.schedule }, 'firstName lastName username employer', function(err, employee) {
    if (err) {
      return res.status(500).end();
    } else {
      return res.json({ employee: employee });
    }
  });
});

 /**
 * PUT /users/employers/:id
 *
 * Description: Assigns or removes administrative privileges for specified employee.
 *
 * Path Params:
 *   id - EmployeeID
 *
 * Query Params:
 *   admin - Boolean (default: 1)
 *
 * Permissions: Employers only.
 *
 * Response: status code (200 success, 500 failure)
 *
 */

router.put('/employers/:id', function(req, res) {
  // only a current employer can change privileges
  // can't change your own privileges
  if (! req.user.employer || String(req.params.id) === String(req.user._id)) {
    return res.status(401).end();
  } else {
    var admin;
    if (req.query.admin === '0' || req.query.admin === 'false') {
      admin = false;
    } else {
      admin = true;
    }
    Employee.findByIdAndUpdate(req.params.id, { employer: admin }, function(err, employee) {
      if (err) {
        return res.status(500).end();
      } else {
        // success
        return res.status(200).end();
      }
    });
  }
});




module.exports = router;
