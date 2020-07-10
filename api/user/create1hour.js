const Appointments = require("../../models/user/Appointments");

async function create1hour(startTime, endTime, theDate, businessID) {
  intHour = parseInt(startTime);
  endTime = parseInt(endTime);
  var hourArr = [];

  while (intHour !== endTime) {
    if (
      intHour == 1 ||
      intHour == 2 ||
      intHour == 3 ||
      intHour == 4 ||
      intHour == 5 ||
      intHour == 6 ||
      intHour == 7 ||
      intHour == 8 ||
      intHour == 9
    ) {
      hourArr.push(`0${intHour}:00`);
      intHour = intHour + 1;
    } else {
      hourArr.push(`${intHour}:00`);
      intHour = intHour + 1;
    }
  }

  // Go to use your database and to check if have booked appointment
  let appointment = await Appointments.find({ business: businessID })
    .sort({
      _id: -1,
    })
    .limit(12);

  if (appointment === null) {
    console.log("Currently has no appointments");
  } else {
    var bookedHours = [];
    for (let i = 0; i < appointment.length; i++) {
      // Loop for array2

      for (let j = 0; j < hourArr.length; j++) {
        // Compare the element of each array
        // if there is a match display here
        if (
          hourArr[j] === appointment[i].time &&
          appointment[i].date === theDate
        ) {
          //   console.log(hourArr[j]);
          bookedHours.push(hourArr[j]);
          // return hourArr[j];
        }
      }
    }

    finalArr = hourArr.filter(function (el) {
      return bookedHours.indexOf(el) < 0;
    });

    console.log(finalArr);

    var timeFields = {
      from: finalArr,
    };
  }

  return timeFields;
}

exports.create1hour = create1hour;
