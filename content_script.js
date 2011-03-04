/** 
 * Inserts the text into the current field.
 */
function updateText(textIn) {
	console.log("textIn=="+textIn);
	//document.getElementById('postingHtmlBox').innerHTML += "<p>Droid</p>"
	if(document.activeElement.type == 'textarea') {
		document.activeElement.innerHTML += textIn
	} else if(document.activeElement.type = 'text') {
		document.activeElement.value = textIn
	}
	
	
}