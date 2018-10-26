// Returns the date, starttime and endtime in DB format
export const convertDate2String = (dateObj) => {
  let dbObj = {};
  dbObj.date = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate();

  let tod = 'AM';
  let hour = dateObj.getHours();

  if( dateObj.getHours() >= 12 ){
    tod = 'PM';
    hour -= 12;
  }

  if( hour == 0 )
    dbObj.time = '12:' + ("0" + dateObj.getMinutes()).slice(-2) + ' ' + tod;
  else
    dbObj.time = hour + ':' + ("0" + dateObj.getMinutes()).slice(-2) + ' ' + tod;

  return dbObj;
}

// Converts a time string in 24-hour format to 12-hour format for the DB
export const convertTime2DB = (dateObj, time) => {
  let timeStr = time.split(':');
  let newDateObj = new Date(
     dateObj.getFullYear(),
     dateObj.getMonth(),
     dateObj.getDate(),
     timeStr[0],
     timeStr[1]
    );

  return newDateObj.getTime();
}

// returns true if time2 >= time1
export const validDates = (time1, time2) => {
  let t1 = time1;
  let t2 = time2;

  return (t2 >= t1);
}

// Converts string format from the DB to a Date object
export const convert2Date = (ms) => {
  return new Date(ms);
}

export const changeDate = (dateMs, timeMs) => {
  let dateObj = new Date(dateMs);
  let timeObj = new Date(timeMs);

  let newDateObj = new Date(
    dateObj.getFullYear(), 
    dateObj.getMonth(), 
    dateObj.getDate(), 
    dateObj.getHours(),
    dateObj.getMinutes() );

  return newDateObj.getTime();
}

//Converts an event from the DB to a format usable by react-big-calendar
export const convert2CalendarArray = ( events ) => {
  var calendarObj = [];
  if (events == undefined)
    return calendarObj;

  for (let uid of Object.keys(events)) {
      let data = {
        id: events[uid].uid,
        title: events[uid].title,
        start: convert2Date(events[uid].startTime),
        end: convert2Date(events[uid].endTime),
        desc: events[uid].description
      }
      calendarObj.push(data);
  }
  return calendarObj;
}