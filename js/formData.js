/**
 *
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
	this.$summery = "";
	this.$authors = [];
	this.$published = "";
	this.$nutritions = [];
	this.$tags = [];
}

/**
 *
 */
FormData.prototype.toJSON = function() {
	return JSON.stringify(this);
}


// Little debug method to keep it all clean 
var debugEnabled = true;

function debug(msg) {
	if(debugEnabled) {
		console.log(msg);
	}
}