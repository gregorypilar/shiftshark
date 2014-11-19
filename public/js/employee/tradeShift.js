$(document).ready(function() {
  var tradeShiftForm = $('.ui.trade.shift.form');
  var entireShift = true;

  var employeeDropdown = $('.ui.trade.shift.form [name="select-employee"]').parent();

  var startHourDropdown     = $('.ui.trade.shift.form [name="start-hour"]').parent();
  var startMinuteDropdown   = $('.ui.trade.shift.form [name="start-minute"]').parent();
  var startMeridianDropdown = $('.ui.trade.shift.form [name="start-meridian"]').parent();

  var endHourDropdown     = $('.ui.trade.shift.form [name="end-hour"]').parent();
  var endMinuteDropdown   = $('.ui.trade.shift.form [name="end-minute"]').parent();
  var endMeridianDropdown = $('.ui.trade.shift.form [name="end-meridian"]').parent();

  $('.ui.trade.shift.form .meridian').dropdown('set value', 'am');
  $('.ui.trade.shift.form .meridian').dropdown('set selected', 'AM');

  var rules;
  var settings = {
    inline  : false
  };

  var updateRules = function () {
    // form validation rules
    rules = {
      startHour: {
        identifier  : 'start-hour',
        rules : [
          {
            type    : 'emptyEntireShift[' + entireShift + ']',
            prompt  : 'Please enter a start hour'
          },
          {
            type    : 'startTimeBeforeEnd[.ui.trade.shift.form]',
            prompt  : 'Start time is before or same as end time'
          }
        ]
      },
      startMinue: {
        identifier  : 'start-minute',
        rules : [
          {
            type    : 'emptyEntireShift[' + entireShift + ']',
            prompt  : 'Please enter a start minute'
          }
        ]
      },
      startMeridian: {
        identifier  : 'start-meridian'
      },
      endHour: {
        identifier  : 'end-hour',
        rules : [
          {
            type    : 'emptyEntireShift[' + entireShift + ']',
            prompt  : 'Please enter an end hour'
          }
        ]
      },
      endMinute: {
        identifier  : 'end-minute',
        rules : [
          {
            type    : 'emptyEntireShift[' + entireShift + ']',
            prompt  : 'Please enter an end minute'
          }
        ]
      },
      endMeridian: {
        identifier  : 'end-meridian'
      }
    };

    tradeShiftForm.form(rules, settings);
  }

  updateRules();

  tradeShiftForm.form('setting', 'onFailure', function(){
    $.fancybox.update();
  });

  tradeShiftForm.form('setting', 'onSuccess', function(){
    $.fancybox.update();
  });


  // $('.ui.trade.shift.form .checkbox.toggle').checkbox('setting', 'onEnable', function(evt) {
  //   entireShift = true;
  //   updateRules();
  //   var $entireShift = $('.ui.trade.shift.form .entireShift');
  //   $entireShift.addClass('hidden');
  //   $.fancybox.update();
  // });

  // $('.ui.trade.shift.form .checkbox.toggle').checkbox('setting', 'onDisable', function(evt) {
  //   entireShift = false;
  //   updateRules();
  //   var $entireShift = $('.ui.trade.shift.form .entireShift');
  //   $entireShift.removeClass('hidden');
  //   $.fancybox.update();
  // });

  $('#createShiftPrevious').on('click', function(){
    if (lastSMonth != "" && lastSDay   != "" && lastSYear  != "" && lastEMonth != "" && lastEDay   != "" && lastEYear  != "") {
      startMonthDropdown.dropdown('set value', lastSMonth);
      startMonthDropdown.dropdown('set selected', lastSMonth);

      startDayDropdown.dropdown('set value', lastSDay);
      startDayDropdown.dropdown('set selected', lastSDay);

      startYearDropdown.dropdown('set value', lastSYear);
      startYearDropdown.dropdown('set selected', lastSYear);


      endMonthDropdown.dropdown('set value', lastEMonth);
      endMonthDropdown.dropdown('set selected', lastEMonth);

      endDayDropdown.dropdown('set value', lastEDay);
      endDayDropdown.dropdown('set selected', lastEDay);

      endYearDropdown.dropdown('set value', lastEYear);
      endYearDropdown.dropdown('set selected', lastEYear);
    }
  });

  $('.ui.trade.shift.form .submit.button').on('click', function() {
    tradeShiftForm.form('validate form');
    var isValid = !tradeShiftForm.hasClass('error');
    $.fancybox.update();

    if (isValid) {
      var employee = startHourDropdown.dropdown('get value');

      var startHour     = startHourDropdown.dropdown('get value');
      var startMinute   = startMinuteDropdown.dropdown('get value');
      var startMeridian = startMeridianDropdown.dropdown('get value');

      var endHour     = endHourDropdown.dropdown('get value');
      var endMinute   = endMinuteDropdown.dropdown('get value');
      var endMeridian = endMeridianDropdown.dropdown('get value');

      var shiftId    = $('.scheduleWrapper .active').parent().attr('shift');
      var query = {
        trade : 'offer'
      }

      var success = function(result, status, xhr) {
        ("success");
        $('.ui.error.message').html('');
        $('.ui.trade.shift.form').removeClass('error');
        tradeShiftForm.removeClass('loading');
        $('.fancybox-close').trigger('click');
        $('.ui.trade.shift.form .dropdown').dropdown('restore defaults');
        //TODO: Interact with Michael's calendar
        window.location.reload();
      };

      var failure = function(xhr, status, err) {
        $('.ui.trade.shift.form').removeClass('success');
        $('.ui.trade.shift.form').addClass('error');
        $('.ui.error.message').html('<ul class="list"><li>You are unauthorized to do this.</li></ul>');
        $.fancybox.update();
        tradeShiftForm.removeClass('loading');
      };

      if (entireShift) {
        client_shifts_change(shiftId, query, null, success, failure);
      } else {

      }
    }
  });
});