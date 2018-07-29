const NAME  = 'Nano';
const ASSISTANT = "Bay Max";
const API_URL = "https://api.forismatic.com/api/1.0/index.php?method=getQuote&key=457653&format=json&lang=en";
const i18n = (...args) => {
	return chrome.i18n.getMessage(...args);
}
const MORNING = i18n("time_morning");
const AFTERNOON = i18n("time_afternoon");
const EVENING = i18n("time_evening");
const GOOD_MORNING = i18n("time_greet_morning");
const GOOD_AFTERNOON = i18n("time_greet_afternoon");
const GOOD_EVENING = i18n("time_greet_evening");
document.title = i18n("appName");
const calcTime = () => {
	let	ampm  = i18n("time_AM"),
			sal   = MORNING,
			date  = new Date(),
			hours = date.getHours(),
			mins  = date.getMinutes();

	hours > 12 && (sal = AFTERNOON);
	hours > 18 && (sal = EVENING);
	hours > 11 && hours < 24 && (ampm = i18n("time_PM"));
	hours > 12 && (hours -= 12);
	hours < 10 && (hours = '0' + hours);
	mins  < 10 && (mins = '0' + mins);
	
	renderClock(hours, mins, sal, ampm)	;
}
const random = size => {
	return parseInt(Math.random()*10) % size;
}

const getRandomQuote = () => {
	const quote = document.querySelector('#quotes');

		$.ajax({
            type: "GET",
            url: API_URL,
            success: function(response){
                quote.querySelector("#content").innerHTML = response.quoteText;
				quote.querySelector("#author").innerText = response.quoteAuthor == "" ? "Anonymous" : response.quoteAuthor;
			},
			error: function(){
				let date = new Date(), h = date.getHours(), a = "AM";
				if (h >= 12) {
					a = "PM";
					h -= 12;
				}
				let asking = [i18n("ask_day"), i18n("ask_wanna_do")];
				let advise = (a == "AM" && h >= 2 && h <= 4) ? `<p>${i18n("late_message")}</p>` : `<p>${asking[random(asking.length)]}</p>`;
                quote.querySelector("#content").innerHTML = advise;
				quote.querySelector("#author").innerText = ASSISTANT;
			}
        });
		 
		//$.getJSON(API_URL, function(result){
        //    console.log(result);
        //});
}
const renderClock = (h, m, s, a) => {
	const clock = document.querySelector('.clock');
	let greetings = s == MORNING ? GOOD_MORNING : s == AFTERNOON ? GOOD_AFTERNOON : GOOD_EVENING;
	clock.querySelector('#time').innerText = `${h}:${m}`;
	clock.querySelector('#ampm').innerText = a;
	clock.querySelector('#greetings').innerText = `${greetings}, ${NAME}`;
}

getRandomQuote();
setInterval(() => calcTime(), 500)
