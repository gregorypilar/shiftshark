$(document).ready(function() {
  var loginForm = $('.ui.form');

  // form validation rules
  var rules = {
    firstName    : {
      identifier  : 'firstname',
      rules: [
        {
          type    : 'empty',
          prompt  : 'Por favor, introduzca su nombre'
        }
      ]
    },
    lastName    : {
      identifier  : 'lastname',
      rules: [
        {
          type    : 'empty',
          prompt  : 'Por favor, introduzca su apellido'
        }
      ]
    },
    scheduleName    : {
      identifier  : 'schedule-name',
      rules: [
        {
          type    : 'empty',
          prompt  : 'Por favor, introduzca un nombre para la agenda'
        }
      ]
    },
    email   : {
      identifier  : 'email',
      rules: [
        {
          type    : 'empty',
          prompt  : 'Por favor, introduzca su dirección de correo electrónico'
        }, 
        {
          type    : 'email',
          prompt  : 'Por favor, introduzca una dirección válida de correo electrónico'
        }
      ]
    },
    password    : {
      identifier  : 'password',
      rules   : [
        {
          type    : 'empty',
          prompt  : 'Por favor, introduzca una contraseña'
        }
      ]
    },
    confirmPassword    : {
      identifier  : 'confirm-password',
      rules   : [
        {
          type    : 'empty',
          prompt  : 'Por favor, introduzca una contraseña'
        },
        {
          type    : 'match[password]',
          prompt  : 'Las contraseñas no coinciden'
        }
      ]
    }
  };

  var settings = {
    inline  : false
  };

  loginForm.form(rules, settings);

  var signup = function() {
    // attempts a form validation
    var validForm = loginForm.form('validate form');

    if (validForm) {
      var firstName    = $('[name="firstname"]').val();
      var lastName     = $('[name="lastname"]').val();
      var scheduleName = $('[name="schedule-name"]').val();
      var email        = $('[name="email"]').val().toLowerCase();
      var password     = $('[name="password"]').val();
      var data = {
        first_name    : firstName,
        last_name     : lastName,
        email         : email,
        schedule_name : scheduleName,
        password      : password
      };

      var loginSuccess = function (result, status, xhr) {
        $('.ui.error.message').html('');
        window.location.replace('/');
      };

      var loginFailure = function(xhr, status, err) {
        loginForm.removeClass('success');
        $('.ui.error.message').html('<ul class="list"><li>Error de inicio de sesión. Por favor, inténtelo de nuevo</li></ul>');
        $.fancybox.update();
        loginForm.addClass('error');
        (xhr,status,err);
      }

      var signupSuccess = function (result, status, xhr) {
        $('.ui.error.message').html('');
        (result);
        client_login(email, password, loginSuccess, loginFailure);

      };

      var signupFailure = function(xhr, status, err) {
        loginForm.removeClass('loading');
        loginForm.removeClass('success');
        $('.ui.error.message').html('<ul class="list"><li>Error de firmar para arriba. Por favor, inténtelo de nuevo</li></ul>');
        loginForm.addClass('error');
      };

      loginForm.addClass('loading');

      client_signup_employer(data, signupSuccess, signupFailure);
    }
  };

  $('.ui.form').on('keyup', function(e) {
    if(e.keyCode == 13) {
      signup();
      return false;
    } else {
      return false;
    }
  });

  // adds a listener to the form submit button
  $('.submit.button').click(function() {
    signup();
  });
});