var year = 2015;
var clickedDay = '';
var monthsName = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

$(document).ready(function () {
    var that = this;

    fillInWeekdayHeaders();
    
    fillInDays();

	$(document).bind('touchmove', function(e) {
		if(e.target.nodeName.toLowerCase() !== 'textarea')
			e.preventDefault();
	});

	FastClick.attach(document.body);

    setTimeout(function () {
        that.myScroll = new iScroll('wrapper', {
            mouseWheel: true,
            scrollbars: true,
            scrollX: true,
            scrollY: false,
            eventPassthrough: true,
            preventDefault: false,
            hScrollbar: false, 
            vScroll: false 
        });
    }, 500);

	$('div#days.days div').click(function(e){
		var selectedID = e.target.attributes['id'].value;

		if(selectedID !== 'd-prev'){
			if(clickedDay != '')
				$('div#'+clickedDay).removeClass('selected');

			var splitDay = selectedID.split("-");

			$('div#moDetails').html(splitDay[2] + ' ' + monthsName[splitDay[1]-1] + ' ' + year);
			
			if(supports_html5_storage())
				if(localStorage.getItem(selectedID))
					$('#comment').val(localStorage.getItem(selectedID));
				else
					$('#comment').val('');


			$('div#'+e.target.attributes['id'].value).addClass('selected');
			clickedDay = e.target.attributes['id'].value;
		}
	});

	$('div#saveButton').click(function(e){
		if(clickedDay && clickedDay !== 'd-prev'){
			if(supports_html5_storage())
			{
				localStorage.setItem(clickedDay, $('#comment').val());
				if($('#comment').val() != '')
					$( "div#" + clickedDay).append("<div class='envelope'></div>");
				else
					$( "div#" + clickedDay + " div.envelope").remove();
			}
		}
	});


	$(window).resize(function(){
         that.myScroll.refresh();
    });

	if(!supports_html5_storage())
		alert('The Browser does not suport local storage !!!');

});

function supports_html5_storage() {
  try {
        if((window['localStorage'] !== null) && (window['localStorage'] !== undefined)) 
          return 'localStorage' in window && window['localStorage'] !== null;
  	} catch (e) {
	    return false;
	  }
}

function fillInWeekdayHeaders(){
	var weeksNo = 53;
	if((getFirstDayOfTheYear(year) === 7) && (isLeapYear(year)))
		weeksNo = 54;
	for(var week=1;week<=weeksNo;week++)
		$( "div.weekheaders" ).append( "<div class='fixedcell wd'>"+week+"</div>" );
}

function fillInDays(){
	var day = 1;
	var week = 1;
	var month = 1;
	var dayOfWeek = getFirstDayOfTheYear(year);
	var totalDays = 365;
	var weeksInMonth = 0;
	var months = [
		{'name':'jan','days':'31'},
		{'name':'feb','days':'28'},
		{'name':'mar','days':'31'},
		{'name':'apr','days':'30'},
		{'name':'may','days':'31'},
		{'name':'jun','days':'30'},
		{'name':'jul','days':'31'},
		{'name':'aug','days':'31'},
		{'name':'sep','days':'30'},
		{'name':'oct','days':'31'},
		{'name':'nov','days':'30'},
		{'name':'dec','days':'31'}];
	if(isLeapYear(year)){
		totalDays = 366;
		var months = [
			{'name':'jan','days':'31'},
			{'name':'feb','days':'29'},
			{'name':'mar','days':'31'},
			{'name':'apr','days':'30'},
			{'name':'may','days':'31'},
			{'name':'jun','days':'30'},
			{'name':'jul','days':'31'},
			{'name':'aug','days':'31'},
			{'name':'sep','days':'30'},
			{'name':'oct','days':'31'},
			{'name':'nov','days':'30'},
			{'name':'dec','days':'31'}];
	}

	var prevYearValued = false;

	for(month=1; month <= 12; month++){
		
		weeksInMonth = 0;
		
		if(month === 1)
			$( "div.days" ).append( "<div id='week-"+ week +"' class='col week'>" );

		for(day=1; day<=months[month-1].days; day++){		
			if((dayOfWeek===1) && (week !== 1))
				$( "div.days" ).append( "<div id='week-"+ week +"' class='col week'>" );

			if(!prevYearValued){
				for(var i=dayOfWeek-1; i>0; i--)
					$( "div#week-"+week ).append("<div id='d-prev' class='cell day prevYear'>"+(32-i)+"</div>	");
				prevYearValued = true;
			}

			$( "div#week-"+week ).append("<div id='d-"+month+"-"+day+"' class='cell day "+months[month-1].name+" '>"+day+"</div>	");
			
			if(supports_html5_storage())
				if(localStorage.getItem('d-'+month+'-'+day))
					$( "div#d-"+month+"-"+day).append("<div class='envelope'></div>");

			dayOfWeek++;
			
			if(dayOfWeek === 8){
				weeksInMonth++;
				week++;
				dayOfWeek = 1;
			}	
		
			if((month === 12) && (day === months[month-1].days))
				$( "div#week-"+week ).append("<div id='d-prev' class='cell day prevYear'></div>");
		}

		$( "div.months" ).append( "<div id='mo-"+month+"' class='mo fixedcell "+ months[month-1].name+" moWidth_"+weeksInMonth+" '>"+months[month-1].name.toUpperCase()+"</div>");
	}					
}

function getFirstDayOfTheYear(y){
	var d = new Date(year,0,1);
	var firstDay = d.getDay();
	if(firstDay === 0)
		firstDay = 7;	
	return firstDay;
}

function isLeapYear(y){
	var isLeap = false;
	if(year%4 === 0)
		isLeap = true;
	return isLeap;
}