/* *******************************************************************************************
 *                                                                                           *
 * Please read the following tutorial before implementing tasks:                              *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Numbers_and_dates#Date_object
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date     *
 *                                                                                           *
 ******************************************************************************************* */


/**
 * Parses a rfc2822 string date representation into date value
 * For rfc2822 date specification refer to : http://tools.ietf.org/html/rfc2822#page-14
 *
 * @param {string} value
 * @return {date}
 *
 * @example:
 *    'December 17, 1995 03:24:00'    => Date()
 *    'Tue, 26 Jan 2016 13:48:02 GMT' => Date()
 *    'Sun, 17 May 1998 03:00:00 GMT+01' => Date()
 */
function parseDataFromRfc2822(value) {
  return Date.parse(value);
}

/**
 * Parses an ISO 8601 string date representation into date value
 * For ISO 8601 date specification refer to : https://en.wikipedia.org/wiki/ISO_8601
 *
 * @param {string} value
 * @return {date}
 *
 * @example :
 *    '2016-01-19T16:07:37+00:00'    => Date()
 *    '2016-01-19T08:07:37Z' => Date()
 */
function parseDataFromIso8601(value) {
  return Date.parse(value);
}


/**
 * Returns true if specified date is leap year and false otherwise
 * Please find algorithm here: https://en.wikipedia.org/wiki/Leap_year#Algorithm
 *
 * @param {Date} date
 * @return {bool}
 *
 * @example :
 *    Date(1900,1,1)    => false
 *    Date(2000,1,1)    => true
 *    Date(2001,1,1)    => false
 *    Date(2012,1,1)    => true
 *    Date(2015,1,1)    => false
 */
function isLeapYear(date) {
  date.setMonth(1);
  date.setDate(29);
  return date.getDate(29) === 29;
}


/**
 * Returns the string representation of the timespan between two dates.
 * The format of output string is "HH:mm:ss.sss"
 *
 * @param {Date} startDate
 * @param {Date} endDate
 * @return {string}
 *
 * @example:
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,11,0,0)   => "01:00:00.000"
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,10,30,0)       => "00:30:00.000"
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,10,0,20)        => "00:00:20.000"
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,10,0,0,250)     => "00:00:00.250"
 *    Date(2000,1,1,10,0,0),  Date(2000,1,1,15,20,10,453)   => "05:20:10.453"
 */
function timeSpanToString(startDate, endDate) {
  /**
   * @param {string} format
   * @param {number} time - milliseconds
   */
  function formatTime(format, time) {
    const matches = format.match(/([\w.]+)/g);

    function parseTimeCode(code = '') {
      const timeCodeDict = {
        H: 'hour',
        m: 'minute',
        s: 'second',
      };
      const timeCoefficient = {
        hour: 3600000,
        minute: 60000,
        second: 1000,
      };
      const timeMax = {
        hour: 24,
        minute: 60,
        second: 60,
      };
      const type = timeCodeDict[code.match(/\w/)];
      const { length } = code;
      let floatPoint = code.indexOf('.');
      if (floatPoint === -1) floatPoint = undefined;

      const pow = floatPoint ? 10 ** length : 1;
      let value = (time / timeCoefficient[type]) % timeMax[type];
      value = Math.trunc(value * pow) / pow;

      const encodedTime = {
        code,
        type,
        length,
        floatPoint,
        value,
        [Symbol.toPrimitive](hint) {
          if (hint === 'number') return this.value;
          return this.toString();
        },
        toString() {
          return this.value.toFixed(this.floatPoint ? this.length - this.floatPoint - 1 : 0)
            .padStart(length, '0');
        },
      };

      return encodedTime;
    }

    const data = matches.map(parseTimeCode);
    return data.reduce((output, timeObj) => {
      const newOutput = output.replace(timeObj.code, timeObj.toString());
      return newOutput;
    }, format);
  }

  return formatTime('HH:mm:ss.sss', endDate.getTime() - startDate.getTime());
}

/**
 * Returns the angle (in radians) between the hands of an analog clock
 * for the specified Greenwich time.
 * If you have problem with solution please read: https://en.wikipedia.org/wiki/Clock_angle_problem
 *
 * SMALL TIP: convert to radians just once, before return in order to not lost precision
 *
 * @param {Date} date
 * @return {number}
 *
 * @example:
 *    Date.UTC(2016,2,5, 0, 0) => 0
 *    Date.UTC(2016,3,5, 3, 0) => Math.PI/2
 *    Date.UTC(2016,3,5,18, 0) => Math.PI
 *    Date.UTC(2016,3,5,21, 0) => Math.PI/2
 */
function angleBetweenClockHands(date) {
  const timezoneOffset = new Date().getTimezoneOffset() * 60000;
  const dateObject = new Date(date.getTime() + timezoneOffset);

  const hourDegPerMinute = 0.5;
  const minuteDegPerMinute = 6;
  const clockwise = 12;
  const minutesInHour = 60;

  const hours = dateObject.getHours() % clockwise;
  const minutes = dateObject.getMinutes();

  // Formula: 0.5deg * (60 * H + M)
  const hourHandAngle = hourDegPerMinute * (minutesInHour * hours + minutes);
  // Formula: 6deg * M
  const minuteHandAngle = minuteDegPerMinute * minutes;

  const angleBetweenHands = Math.abs(hourHandAngle - minuteHandAngle);

  const degToRadians = (deg) => (deg / 180) * Math.PI;
  const delta = (n, max) => (n <= max ? n : max * 2 - n);

  return degToRadians(delta(angleBetweenHands, 180));
}


module.exports = {
  parseDataFromRfc2822,
  parseDataFromIso8601,
  isLeapYear,
  timeSpanToString,
  angleBetweenClockHands,
};
