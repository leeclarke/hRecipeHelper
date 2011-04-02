var debugEnabled = false;

/**
 * Object representing the Form Data used to generate the hRecipe code.
 */
function FormData() {
	this.$recName = '';
	this.$ingredients = [];
	this.$yield = 0;
	this.$instructions = "";
	this.$duration =  0;
	this.$cooktime = 0;
	this.$preptime = 0;
	this.$photos  = [];
	this.$summary = "";
	this.$authors = [];
	this.$published = "";
	this.$nutritions = [];
	this.nutritionTypes = [];
	this.$tags = [];
}

/**
 * Little debug method to keep code clean and able to turn off logging for deploy. 
 */
function debug(msg) {
	if(debugEnabled) {
		console.log(msg);
	}
}

/**
 * Retrieves form data from localStorage.
 */
function loadFormData() {
	var objStr = localStorage["hRecipeData"];
	debug("loadedData == "+objStr);
	var formDataParse;
	if(objStr && objStr.length >2){
		formDataParse = jQuery.parseJSON(objStr);
		debug("formDataParse == "+formDataParse + " name==" + formDataParse.$recName);
	}
	return formDataParse;
}

/**
 * Write form data to localStorage as Json string.
 */
function saveFormData(formData) {
	localStorage["hRecipeData"] = JSON.stringify(formData);
}

/**
 * Removes form data from localStorage.
 */
function deleteFormData() {
	localStorage["hRecipeData"] = "";
}
