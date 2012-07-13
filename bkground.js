/**
 hRecipeHelper, a Chrome extention for building microformat compatable.

 Copyright (c) 2012 Lee Clarke

 LICENSE:

 This file is part of hRecipeHelper (http://github.com/leeclarke/hRecipeHelper).

 hRecipeHelper is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 License as published by the Free Software Foundation, either version 2 of the License, or (at your option) any
 later version.

 hRecipeHelper is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
 details.

 You should have received a copy of the GNU General Public License along with TheGardenDroid.  If not, see
 <http://www.gnu.org/licenses/>.
*/
var BLOGGER = "www.blogger.com";
var BLOGGER_POST = "/post-edit.g";
var BLOGGER_CREATE = "/post-create.g";


/**
 * //Cant use Chrome with the Blogger api with out getting an ugly popup... so odd, come on google really?
 * Moving output to the popup to display for copy/paste
 */
function processData(data, options) {
	var currentURL = "";
	//debug		
	var toString = "rec-name:"+ data.$recName + " ingredients:"+ data.$ingredients + " yield:" + data.$yield;
	console.log("got data:  "+toString)

	var hRecipeCode = convertTohRecipe(data, options);
	console.log("hrecipe=="+hRecipeCode);

	return hRecipeCode;
	//chrome.tabs.executeScript(null, {code:"updateText('"+hRecipeCode+"')"})		
	console.log("done");
}

/* a few notes to be used for new features
chrome.tabs.getSelected(null, function(tab) {    
var url = tab.url;						
jQuery.url.setUrl(url)
console.log("HOST="+jQuery.url.attr("host"));

		//var currField == document.activeElement;
		//chrome.tabs.executeScript(null, {code:"updateText('TESTER')"})
		//chrome.tabs.executeScript(null, {code:"console.log('active=='+document.activeElement)"})
});   
*/


/**
 * Converts data to the hRecipe format with default formatting tags.
 */
function convertTohRecipe(data, options) {		
	var microformat = "<div class=\"hrecipe\">\n";
	if(data){
		microformat += ("<h1 class=\"fn\">" + data.$recName + "</h1>\n");
		//if(data.$summary) microformat += ("<><p class=\"summary\">" + data.$summary + "</p>\n");
		if(data.$author) microformat += ("<p><label>By </label><span class=\"author\">" + data.$author + "</span></p>\n");
		if(data.$published) microformat += ("<p>Published <span class=\"published\">" + data.$published + "</span></p>\n");

		if(data.$photos.length>0 && data.$photos[0].length > 0) {
			microformat += ("<img src=\"" + data.$photos[0] + "\" class=\"photo\" style=\"height:140px;width:140px;border-width:0px;\" alt=\"" + data.$recName + "\">\n");
		}
		if(data.$summary) microformat += ("<p class=\"summary\">" + data.$summary + "</p>\n");
		microformat +="<h2>Ingredients</h2>\n";
		if(options.blt_ingrediants == true) {
			microformat +="<ul>\n";
			for(var i in data.$ingredients) {
				if(data.$ingredients[i].length >0) {
					microformat += ("<li class=\"ingredient\">" + data.$ingredients[i] + "</li>\n");
				}
			}
			microformat +="</ul>\n";
		}else {
			microformat +="<div>\n";
			for(var i in data.$ingredients) {
				if(data.$ingredients[i].length >0) {
					microformat += ("<span class=\"ingredient\">" + data.$ingredients[i] + "</span><br>\n");
				}
			}
			microformat +="</div>\n";
		}


		if(data.$instructions) {
			microformat +="<h2>Instructions</h2>\n";
			if(options.nbr_instr == true) {
				var listType = (data.$instructions.length==1)?"ul":"ol";
				microformat +="<" + listType + ">\n";
				for(i in data.$instructions) {
					if(data.$instructions[i].length >0) {
						microformat += ("<li class=\"ingredient\">" + data.$instructions[i] + "</li>\n");
					}
				}
				microformat +="</" + listType + ">\n";
			} else {
				microformat +="<div>\n";
				for(i in data.$instructions) {
					if(data.$instructions[i].length >0) {
						microformat += ("<div class=\"ingredient\">" + data.$instructions[i] + "</div><br>\n");
					}
				}
				microformat +="</div>\n";
			}
		}

		if(data.$yield) microformat += ("<p><span style='font-weight:bold;'>Yield:</span><span class=\"yield\"> "+data.$yield+"</span></p>\n");

		if(data.$preptime || data.$cooktime) {
			microformat += "<span class=\"duration\">\n";
			var prep = "0M";
			var cook = "0M";


			if(data.$preptime) {
				prep = parseTime(data.$preptime);
				microformat += ("<p><span style='font-weight:bold;'>Prep Time:</span><span class=\"preptime\"><span class=\"value-title\" title=\""+prep+"\"></span> "+data.$preptime+"</span></p>\n");

			}
			if(data.$cooktime) {
				cook = parseTime(data.$cooktime);
				microformat += ("<p><span style='font-weight:bold;'>Cook time:</span><span class=\"cooktime\"><span class=\"value-title\" title=\""+cook+"\"></span> "+data.$cooktime+"</span></p>\n");				
			}

			microformat += "</span>\n";
		}
		if(options.blt_nutrition == true) {
			if(data.$nutritions.length>0 && data.$nutritions[0].length > 0) {
				microformat +="<h2>Nutrition</h2>\n";
				microformat +="<p>\n";
				microformat +="<ul class=\"nutrition\">";
				for(var n in data.$nutritions) {
					if(data.$nutritionTypes[n].length >0) {
					microformat += "<li>"+toProperCase(data.$nutritionTypes[n])+": <span class=\""+ (data.$nutritionTypes[n].replace(" ","")).toLowerCase() + "\">" +(data.$nutritions[n] + "</span></li>\n");
					}
				}
				microformat +="</ul>\n</p>\n";
			}    
		} else {
			if(data.$nutritions.length>0 && data.$nutritions[0].length > 0) {
				microformat +="<h2>Nutrition</h2>\n";
				microformat +="\n";
				microformat +="<div class=\"nutrition\">";
				for(var n in data.$nutritions) {
					if(data.$nutritionTypes[n].length >0) {
					microformat += "<div>"+toProperCase(data.$nutritionTypes[n])+": <span class=\""+ (data.$nutritionTypes[n].replace(" ","")).toLowerCase() + "\">" +(data.$nutritions[n] + "</span></div>\n");
					}
				}
				microformat +="</div><br>\n\n";
			}
		}
		if(data.$tags && data.$tags.length >0 && data.$tags[0].length > 0) {
			var tagCode = [];
			microformat +="<span style='font-weight:bold;'>Tags: </span>";
			for(var t in data.$tags) {
				tagCode.push("<span class=\"tag\">"+data.$tags[t]+"</span>");
			}	
			microformat += tagCode.join(',');
			microformat +="</span>";
		}
	}

	microformat += "</div>";
	return microformat;
}

/**
 * Makes first letter of each word uppercase.
 */
function toProperCase(strIn) {
	var results = []
	if(strIn) {
		var words = strIn.toLowerCase().split(" ");
		for(w in words) {
			var first = words[w].charAt(0).toUpperCase();
			results.push(first + words[w].substr(1));
		}
	}
	return results.join(" ");
}

/**
 * Parse method expects to recieve time formatted in the hh:mm format and simply yanks out the : and adds markers
 */
function parseTime(timeValue) {
	var result = "PT";
	var timeSplit = timeValue.split(":");
	if(timeSplit.length == 2) {
		result += (timeSplit[0]+"H"+timeSplit[1]+"M");
	} else {
		result += (timeValue+"M");
	}		

	return result;
}