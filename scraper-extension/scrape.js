console.log("hello waldo");

var title = document.querySelector(".title_wrapper h1").innerHTML;
title = title.substring(0, title.indexOf("&"));
var year = parseInt(document.querySelector("#titleYear a").innerHTML);

console.log("title: ", title);
console.log("year: ", year);

var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
xmlhttp.open("POST", "http://localhost:8080/api/movies");
xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
xmlhttp.send(JSON.stringify({ title: title, year: year }));

document.querySelector("#titleYear a").click();

setTimeout(function() {
	console.log("document.title: ", document.title);
}, 7000);