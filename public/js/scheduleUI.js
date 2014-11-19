/*
 *  6.170 Schedule UI interface and Library
 *  Lead Author: Michael Belland
 *
 */

$(document).on('click', '.cell', function(evt) {
	$(this).addClass('active');
    var shiftId = $(this).parent().attr('shift');
    var shift = client_shifts_get_one(shiftId).data;
    var startDate = new Date(shift.startDate);
    var endDate = new Date(shift.endDate);

    var startMonth = startDate.getMonth()+1;
    var startDay   = startDate.getDate();
    var startYear  = startDate.getFullYear();

    var endMonth = endDate.getMonth()+1;
    var endDay   = endDate.getDate();
    var endYear  = endDate.getFullYear();

    $('.modify.form [name="start-month"]').parent().dropdown('set value', startMonth);    
    $('.modify.form [name="start-month"]').parent().dropdown('set selected', startMonth);    
    $('.modify.form [name="start-day"]').parent().dropdown('set value', startDay);    
    $('.modify.form [name="start-day"]').parent().dropdown('set selected', startDay);    
    $('.modify.form [name="start-year"]').parent().dropdown('set value', startYear);    
    $('.modify.form [name="start-year"]').parent().dropdown('set selected', startYear);    

    $('.modify.form [name="end-month"]').parent().dropdown('set value', endMonth);    
    $('.modify.form [name="end-month"]').parent().dropdown('set selected', endMonth);    
    $('.modify.form [name="end-day"]').parent().dropdown('set value', endDay);    
    $('.modify.form [name="end-day"]').parent().dropdown('set selected', endDay);    
    $('.modify.form [name="end-year"]').parent().dropdown('set value', endYear);    
    $('.modify.form [name="end-year"]').parent().dropdown('set selected', endYear);    
});

var changeColor = function(shift, color){
    //$(shiftId)

}

var addShift = function(shiftId){
	
}

var deleteShift = function(shiftId){
	//$("something").find("#"+shiftId);
}

var createShift = function(shiftId){
	
}