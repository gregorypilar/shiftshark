// binds all the listeners to the schedule again
function bindScheduleListeners() {
  var weekdayName = ['Lunes',
    'Martes', 'Miércoles',
    'Jueves', 'Viernes',
    'Sábado', 'Domingo'];

  // open the modify shift modal
  $(document).on('click', '.block-avail', function() {
    $this = $(this);

    var weekday = weekdayName[parseInt($this.attr('day'))];
    var availId = $this.attr('availid');
    var avail = client_avails_get_one(availId).data.avail;
    var startTime = (new Time(avail.startTime)).formatted;
    var endTime = (new Time(avail.endTime)).formatted;

    $('.deleteInfo').html('Usted ha seleccionado <b>' + weekday + '</b> desde ' + '<b>' + startTime + '</b> hasta <b>' + endTime + '</b>.');
    // open the modal via emulated click
    $('#deleteTrigger').trigger('click');
    $this.addClass('active');
  });

  // opens create shift when clicking on an empty box
  $(document).on('click', '.block-empty', function() {

    $this = $(this);
    // get the hours and the minutes
    var weekday = weekdayName[parseInt($this.attr('day'))];
    var hour = parseInt($this.attr('hour'));
    var mins = parseInt($this.attr('quarter')) * 15;
    var position = $this.attr('position');
    // parse the time
    var time = moment(hour + " " + mins, "H m").format("hh:mm a");

    // set the start time value
    $('#create .startTime .timePicker').val(time);

    $('.createInfo').html('Usted ha seleccionado <b>' + weekday + '</b>.');

    // open the modal via emulated click
    $('#createTrigger').trigger('click');
    $this.addClass('active');
  });
}

$(document).ready(function() {
  // create the availability object
  schedule = AvailabilityEmployeeTable();
  // add the schedule to the HTML
  $('#schedule').append(schedule);
  // get the curent user and availabilities
  var curUser = $('#curUser').attr('userid');
  var avails = client_avails_get_all({employee:curUser}).data.avails;

  // add the availabilities to the schedule
  for (var i = 0; i < avails.length; i++) {
    schedule.avail_add_update(avails[i]);
  }

  // add listeners
  bindScheduleListeners();
});