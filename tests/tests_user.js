/**
 * Authentication tests.
 * Author: aandre@mit.edu
 */

test('User - Employee Account Creation', function () {
  // Create Test Employer Account if DNE
  client_signup_employer({
    first_name: "Employer",
    last_name: "One",
    email: "employer-one@andreaboulian.com",
    schedule_name: "Test Schedule",
    password: "thisPasswd"
  });

  // Login Employer and Deep Clean Schedule (Including Employees)
  test_employer_login();
  clear_employer(false); // do no delete test employee accounts

  /**
   * Note: Running employee creation tests caused the email provider to identify the application as a spammer. Employees are not cleared and not re-created as a result.
   */

  // Register Three Test Employee Accounts
  var employee_one = client_signup_employee({
    first_name: "Employee",
    last_name: "One",
    email: "employee-one@andreaboulian.com"
  });

  // ok(employee_one.success, "Employee Account Creation (I) - Successful Creation");
  // deepEqual(employee_one.data.employee, client_employee_get_one(employee_one.data.employee._id).data.employee, "Employee Account Creation (I) - New Employee Retrieved");

  var employee_two = client_signup_employee({
    first_name: "Employee",
    last_name: "Two",
    email: "employee-two@andreaboulian.com"
  });

  // ok(employee_two.success, "Employee Account Creation (II) - Successful Creation");
  // deepEqual(employee_two.data.employee, client_employee_get_one(employee_two.data.employee._id).data.employee, "Employee Account Creation (II) - New Employee Retrieved");

  var employee_three = client_signup_employee({
    first_name: "Employee",
    last_name: "Three",
    email: "employee-three@andreaboulian.com"
  });

  // ok(employee_three.success, "Employee Account Creation (III) - Successful Creation");
  // deepEqual(employee_three.data.employee, client_employee_get_one(employee_three.data.employee._id).data.employee, "Employee Account Creation (III) - New Employee Retrieved");


  ok(client_signup_employee({
    first_name: "Employee",
    last_name: "Four-Two",
    email: "employee-two@andreaboulian.com"
  }).success === false, "Employee Account Creation - Reject Duplicate Email");

  // Logout Employer
  client_logout();
});

test('User - Login/Logout', function () {
  ok(test_employer_login(), "Account Login - /login");
  ok(client_logout().success, "Account Logout - /logout");
});

test('User - Give Admin Privileges', function() {
  test_employer_login();
  var employees = client_employee_get_all().data.employees;
  client_employee_change_admin(employees[1]._id, true);
  var isAdmin = client_employee_get_one(employees[1]._id).data.employee.employer;
  ok(isAdmin);
});

