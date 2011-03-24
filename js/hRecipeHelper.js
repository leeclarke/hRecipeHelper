//BUG:  Nutritional items are being dropped if array > 1
//TODO: consider making Instr fields a 2row textArea
//TODO: Add option to Toggle back to one text area on Instructions?
//TODO: add copy paste button.
//TODO: Add ability to toggle off the line breaks in results.
//TODO: Add toggle to switch between pure hRecipe Spec and the Google version.
//TODO: Consider adding a non-formatting option that uses all span tags so users can style their own.
//TODO: reverse parse to populate from current page/field for editing.
//TODO: Find some graphics!
//TODO: Add Options (Allow toggle of save previous data and when to discard. (no save, only if already generated hRecipe, only on clear button.))

//DONE: Remove blank array items.
//DONE: fix any methods currently manipulating instructions.
//DONE: Add checks for any missing data on html gen.
//DONE: fixed code gen when no picture and no nutritional info.
//DONE: Release 1.0
//DONE: move scripts to js file once done testing
//DONE: Add parsing for tags
//DONE: Fix clear fail for Ingredients
//DONE: Refactor code in here its getting ugly.
//DONE: Add About tab
//DONE: Add clear button to reset form if data was left in local storage.
//DONE: Add save data to localstorage in case of accidentally closing.
//DONE: make Ingredients field long.
//DONE: Add hRecipe format for nutrition types. Look into diff on value/type tagsg
//DONE: test duration validation, it should NOT allow "40 min" as an entry.
//DONE: get NutritionType data from form and putput in right format
//DONE: fix addField so Select is in the nutrition specific function.
//DONE: Add Nutrition type drop down to specify Calories, fat, Total Carbs, Dietary Fiber, protein, sodium, Cholesterol
//DONE: Add proper value-title tags for the duration times so google will parse it. ex: <span class="value-title" title="PT1H30M"></span> (PT1H30M ? does the PT stand for Pacific time or something else?)
//DONE: finish time formatter in background for duration types
//DONE: Add validations (durations- require hh:mm format)
//DONE: add duration types (preptime, cooktime, also compute total 'duration' )
//DONE: Fix Author output
//DONE: fix Duration Output.

 	var nutritionTypes = ["Calories", "Fat", "Total Carbs", "Dietary Fiber", "Protein", "Sodium", "Cholesterol"];
	$(document).ready(initForm);

	/**
	 * Initializes the Form after load.
	 */
	function initForm() {
		debug("Load Blog posting.");
		//chrome.extension.getBackgroundPage().checkURLAction('load');
		$('#published').datepicker();
		$('#ok').button();
		$('#done').button();
		$('#close').button();
		$('#clear').button();
		$('#copy').button();
		$( "#tabs" ).tabs({
	    	show: function(event, ui) { 		
		 	}
		});
		$( "#tabs" ).bind( "tabsshow", function(event, ui) {
			if(ui.panel.id == "tabs-2") {
				var formData = initData();
				if($("#recipeForm").valid() && formData){
					var output = chrome.extension.getBackgroundPage().processData(formData);
					debug("output="+output);
					$('#results').val(output);
				} else {
					//fails validation, switch back to input form
					$( "#tabs" ).tabs('select',0);
				}
			}
		});

    	$("#recipeForm").validate({
			rules: {
			 // simple rule, converted to {required:true}
				recName: {
				 	required: true,
				 	minlength: 2
				 },
				ingredient0: {
					required: true,
				 	minlength: 2
				},
				cooktime: {
				 	checkTime:true
			 	},
			 	preptime: {
					checkTime:true
			 	}
		   },
		   messages: {
			 recName: {
			   required: "A recipe Title is required.",
			   minlength: jQuery.format("At least {0} characters required!")
			 },
			 ingredient0: {
			   required: "Requires 1 ingrediant.",
			   minlength: jQuery.format("At least {0} characters required!")
			 }			 
		   },
		   errorClass: "ui-state-highlight",
		   focusCleanup: true,
		   wrapper: "div"
		});
			
		/*
         * Custom Validator for checking time validations using regex
         */
		$.validator.addMethod('checkTime', function( value, element, params ) {
			if(/^([0-9]?[0-9])$/.test(value))
				return true; //if just 1-2 digits then its ok assuem mins.
			return ((value.length >= 1 )? /^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/.test(value):true)
		}, "Times should be in the hh:mm format.");
		
		appendNutritionTypes("nutritionType");
		loadForm();
	}
	
	/**
     * Retrieve form data from localStoreage and parse Json to FormData object. 
     */
	function loadForm() {
		var formData = loadFormData();
		setFormValues(formData);
	}

	/**
     * Clears form fields and saved data.
     */
	function clearFormData() {
		deleteFormData();
		setFormValues(new FormData());
	}

	/**
     * Loads saved data into form fields.
     */
	function setFormValues(formData) {
		$('#recName').val(formData.$recName);			
		for(i in formData.$ingredients) {
			if(i==0) {
				$('#ingredient0').val(formData.$ingredients[i])
			} else {
				addFormField('ingredient', false, formData.$ingredients[i]);				
			}
		}
		if(formData.$ingredients.length == 0) {
			clearArrayFields('ingredient');
		}
		if(formData.$instructions.length == 0) {
					clearArrayFields('instruction');
		}
		
		$('#yield').val((formData.$yield == 0)?"":formData.$yield);
		$('#cooktime').val((formData.$cooktime == 0)?"":formData.$cooktime);
		$('#preptime').val((formData.$preptime == 0)?"":formData.$preptime);
		$('#photo').val((formData.$photos[0])?formData.$photos[0]:"");
		$('#author').val(formData.$author);
		$('#published').val(formData.$published);
		$('#instruction0').val(formData.$instructions[0]);
		for(i in formData.$instructions) {
			if(i==0) {
				$('#instruction0').val(formData.$instructions[i])
			} else {
				if(formData.$instructions[i].length > 0)
					addFormField('instruction', false, formData.$instructions[i]);				
			}
		}

		for(n in formData.$nutritions) {
			if(n==0) {
				$('#nutrition').val(formData.$nutritions[n]);
				$('.'+'nutritionType').val(formData.$nutritionTypes[n]);
			} else {
				if(formData.$nutritions[i].length > 0) {
					appendNutrition(formData.$nutritions[n], formData.$nutritionTypes[n]);
				}
			}
		}		
		if(formData.$nutritions.length == 0) {
			clearArrayFields('nutrition');
		}

		$('#summery').val(formData.$summery);
		var tagStrings = (formData.$tags)? formData.$tags.join():''; 
		$('#tag').val(tagStrings);		
	}	

	/* Add listener to catch popup close event. */
	var background = chrome.extension.getBackgroundPage();
	addEventListener("unload", function (event) {
		initData();
	}, true);

	/**
	 * Clears the array field sets, due to differences in structure it take a bit of non-generic code, might want to revisit this as a TechDebt later.
	 */
	function clearArrayFields(fieldName) {		
		$("[id^='"+fieldName+"Row']").map(function(){
			debug("id=="+this.id);
			$(this).remove();			
		}).get();
		
		if(fieldName == 'instruction') {
			$('#instruction0').val('');
		} else if(fieldName == 'ingredient') {
			$('#ingredient0').val('');
		} else {
			$('#nutrition').val('');
			$('#'+ fieldName+'Type').val(nutritionTypes[0].toLowerCase());	
		}
	}
	
	/**
	 * collect data and create dto. Save to local.
	 */
	function initData() {

		debug("is valid=="+	$("#recipeForm").valid());

		var formData = new FormData();		
		formData.$recName = $('#recName').val();	
		var inglist = getFormArray('ingredient');
		
		inglist.unshift($('#ingredient0').val());
		formData.$ingredients = inglist;
		formData.$yield = $('#yield').val();
		formData.$cooktime = $('#cooktime').val();
		formData.$preptime = $('#preptime').val();
		formData.$photos = [$('#photo').val()];
		formData.$author = $('#author').val();
		formData.$published = $('#published').val();

		var instlist = getFormArray('instruction');
		instlist.unshift($('#instruction0').val());

		debug("instlist=="+instlist);
		formData.$instructions = instlist;
		//formData.$instructions = $('#instructions').val();

		
		formData.$nutritionTypes = $("[id^=nutritionType]").map(function(){return $(this).val();}).get();
		formData.$nutritions = getFormArray('nutrition');
		formData.$summery = $('#summery').val();
		formData.$tags = $('#tag').val().split(',');
		
		debug("formData.nTypes="+ formData.$nutritionTypes );
		saveFormData(formData);
		return formData;
	}	

	/**
	 * Retrieve array of data values for same name input fields.
	 */
	function getFormArray(id) {
		return $("input[id='"+id+"']").map(function(){return $(this).val();}).get();
	}

	/**
     * Adds new nutrition input fields
     */
	function appendNutrition(value,selectedType) {
		var elmtNumber = addFormField('nutrition', true, value);		
		var selectName = 'nutritionType'+elmtNumber
		appendNutritionTypes(selectName);
		if(selectedType) {
			$('.'+selectName).val(selectedType);
		}
	}

	/**
 	 * Adds the array of Types to the new select
	 */
	function appendNutritionTypes(nutritionTypeFieldName) {
		var output = [];
		$.each(nutritionTypes, function(key, value) 	{
		  	output.push('<option value="'+ (value.replace(" ","")).toLowerCase() +'">'+ value +'</option>');
		});
		$("."+nutritionTypeFieldName).html(output.join(''));
		debug("##updated sleect name==" +"."+nutritionTypeFieldName);
	}
	
	/**
	 * Adds array type field to form.
	 * @return - element name where added
	 */
	function addFormField(fieldName, addSelect, value) {
		var rowCt = $("#"+fieldName + "List li").size();
		debug(rowCt);
		var newElmName = (fieldName + "Row"+rowCt);
		
		var newHtml = "<li id='"+newElmName+"'><input type=\"text\" id=\""+fieldName+"\" name=\""+ fieldName+"\" "
		if(value) {
			newHtml += " value=\""+value+"\" ";
		}
		if(addSelect) {
			newHtml += "/> <select id=\""+fieldName+"Type\" class=\""+fieldName+"Type"+ rowCt + "\"></select>";
		} else {
			newHtml += " class=\"large-field\"/>";
		}
		newHtml += "</li>";
		
		$("#"+fieldName + "List").append(newHtml);
		$("#"+fieldName + "Row"+rowCt).effect("highlight", {}, 3000);		
		return rowCt;
	}
	

	/**
	 * enable tabs
	 */
	$(function() {
		$( "#tabs" ).tabs();
	});	

