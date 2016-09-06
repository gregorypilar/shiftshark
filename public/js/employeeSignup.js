$(document).ready(function() {
    var loginForm = $('.ui.form');

    // form validation rules
    var rules = {
        name    : {
            identifier  : 'username',
            rules: [
                {
                    type    : 'empty',
                    prompt  : 'Por favor, introduzca su nombre'
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

    // adds a listener to the form submit button
    $('.submit.button').click(function() {
        // attempts a form validation
        var validForm = loginForm.form('validate form');
    $.fancybox.update();

        if (validForm) {
            var name = $('[name='username']').val();
            var email = $('[name='email']').val();
            var password = $('[name='password']').val();

            // PERFORM AJAX CHECK
        }
    });
});