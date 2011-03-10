/** 
 * Inserts the text into the current field.
 */
function updateText(textIn) {
	console.log("textIn=="+textIn);
	if(document.activeElement.type == 'textarea') {
		document.activeElement.innerHTML += textIn
	} else if(document.activeElement.type = 'text') {
		document.activeElement.value = textIn
	}
	
	
}
