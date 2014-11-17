/**
 * Common functions
 */

function convertDateTime(dateTime) {
	var date = dateTime.split('T');
	return new Date(Date.parse(date[0]));
}

function getValue(value) {
	return convertDateTime(value.datePaid).getTime();
}

function getAvg(data, prop) {
	var num = 0;
	var sum = 0;
	var avg = 0;

	for(var datum in data) {
		sum += data[datum][prop];
		num ++;
	}

	if(num > 0) {
		return Math.round(sum/num);

	} else {
		return avg;
	}
}