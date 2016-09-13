$(document).ready(function () {
  var addForm = $('.add.employee.form');

  // form validation rules
  var rules = {
    email: {
      identifier: 'email',
      rules: [
        {
          type: 'empty',
          prompt: 'Por favor, introduzca su dirección de correo electrónico'
        },
        {
          type: 'email',
          prompt: 'Por favor, introduzca una dirección válida de correo electrónico'
        }
      ]
    },
    firstName: {
      identifier: 'firstname',
      rules: [
        {
          type: 'empty',
          prompt: 'Por favor, introduzca un nombre'
        }
      ]
    },
    lastName: {
      identifier: 'lastname',
      rules: [
        {
          type: 'empty',
          prompt: 'Por favor, introduzca un nombre'
        }
      ]
    }
  };

  var settings = {
    inline: false,
    on: 'blur'
  };

  addForm.form(rules, settings);

  var getAllEmployees = function () {  

  var failure = function (xhr, status, err) {
        addForm.removeClass('loading');
        addForm.removeClass('success');
        $('.add.employee.form .ui.error.message').html('<ul class="list"><li>' + err + '</li></ul>');
        $.fancybox.update();
        addForm.addClass('error');
        (xhr, status, err);
      };

    
        var employeeNamesHtml = "";
        var employees =  client_employee_get_all().data.employees;
        employees.sort();
        var employee;

       for (var i = 0; employee = employees[i]; i++) {
          var employeeName = employee.firstName + ' ' + employee.lastName;
          employeeNamesHtml += "<div class='item' employeeId='" + employee._id + "'>" + employeeName + "</div>"
        }

        $('.employeeList').html(employeeNamesHtml);
        $('.dropdown').dropdown();    
  };


  var addEmployee = function () {
    var isValid = addForm.form('validate form');
    $.fancybox.update();
    (isValid);
    if (isValid) {
      var firstNameField = $('.add.employee.form [name="firstname"]');
      var lastNameField = $('.add.employee.form [name="lastname"]');
      var emailField = $('.add.employee.form [name="email"]');
      var congField = $('.add.employee.form [name="congregation"]');
      var phoneField = $('.add.employee.form [name="phone"]');

      var firstName = firstNameField.val();
      var lastName = lastNameField.val();
      var email = emailField.val().toLowerCase();
      var cong = congField.val();
      var phone = phoneField.val();

      var data = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        congregation: cong,
        phone: phone
      };

      var success = function (result, status, xhr) {
        $('.ui.error.message').html('');
        addForm.removeClass('loading');
        $('.fancybox-close').trigger('click');
        firstNameField.val("");
        lastNameField.val("");
        firstNameField.val("");    
      };

      var failure = function (xhr, status, err) {
        addForm.removeClass('loading');
        addForm.removeClass('success');
        $('.add.employee.form .ui.error.message').html('<ul class="list"><li>' + err + '</li></ul>');
        $.fancybox.update();
        addForm.addClass('error');
        (xhr, status, err);
      };

      addForm.addClass('loading');
      client_signup_employee(data, success, failure);
    }
  };

  $('.ui.form').on('keyup', function (e) {
    if (e.keyCode == 13) {
      addEmployee();
      return false;
    } else {
      return false;
    }
  });

  $('.add.employee.form .submit.button').on('click', function () {
    addEmployee();
  });
});