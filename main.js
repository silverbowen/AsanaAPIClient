// Document ready function.
$( function () {
	// On form button click send the request.
  	$('#button').click( function(event) {
  		alert(new Date($("input[name=start]").val()));
  		// Keep page from reloading
  		event.preventDefault();
  		// Hide the report div if visible, should add a loading indicator here
  		if (!$("#report").is(":hidden")) {
  			$("#report").slideToggle();
  		}
  		// Ajax so we can set the auth token in the header
		$.ajax({
			"url": "https://app.asana.com/api/1.0/projects/" + $("input[name=ID]").val() + "/tasks",
		 	"method": "GET",
		 	"headers": {
		    	"authorization": "Bearer " + $("input[name=token]").val()
			},
			"data" : {
				// Opt_fields lets us pick return fields.
				"opt_fields": "name,id,assignee,created_at, modified_at, completed, notes, tags, attachments",
				//"modified_since" : new Date($("input[name=start]").val())	
			}
		})
		.done( function(response) {
	    	// If the response has a data array (versus error)
	    	if (response.data) {
	    		// Start our report string
	    		var report = "<br/>";
	    		// Add each item with some formatting
	        	response.data.forEach( function(task) {
	        		// Check for each datum that was last modified within our date range
	        		if (new Date(task.modified_at) < new Date($("input[name=start]").val()) ||
	        			new Date(task.modified_at) > new Date($("input[name=end]").val())) {
	        			return false;
	        		}
	        		// Add a paragraph and append the particulars to the report.
        			report += "<p>";
        			for (key in task) {
        				// If the item has an array or object fo a value, loop through that
        				if (task[key] instanceof Object && task[key] != "") {
        					report += key + ": {" + "<br/>"; 
        					for (innerKey in task[key]) {
        						// If the item has an array or object for a value, loop through that, again
        						if (task[key][innerKey] instanceof Object && task[key][innerKey] != "") {
        							for (innerestKey in task[key][innerKey]) {
        								report += "&nbsp;&nbsp;&nbsp;&nbsp;" + innerestKey + " : " + task[key][innerKey][innerestKey] + "<br/>"
        							}
        						// Otherwise just add the item
        						} else if (task[key] != "") {
        							report += "&nbsp;&nbsp;&nbsp;&nbsp;" + innerKey + " : " + task[key][innerKey] + "<br/>"
        						}
        					};
        					report += "}<br/>";
        				// Otherwise just add the item
        				} else if (task[key] != ""){
        					report +=  key + " : " + task[key] + "<br/>";
        				}
        			};
        			// End the paragraph.
        			report += "</p>";
        		});
        		// End the report.
        		report += "<br>";
	        	// Set the hidden div to the report string HTML and show it.
        		$("#report").html(report).slideToggle();
		    } else {
		        $(response.errors).each( function() {
		            console.error(this);
		            alert("Something went wrong! \n Please check values and try again.");
		        });
		    }
		})
		.fail ( function(error) {
		    console.error(error);
		    alert("Data failed to load! Please check your connection or refresh the page.");
		});
	 });
});



