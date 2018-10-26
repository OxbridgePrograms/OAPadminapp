
// These are the settings used to change data in Firebase:
// 1. addEvent: add an event for a specific program (must be logged in)
// 2. editEvent: edit the settings of an existing event
// 3. editProgram: edit the program information
// 4. addProgram: add a program for a given year

const settingsList = {
	"addEvent" : {
		"title" : {
			"type" : "short",
			"header" : "Title",
			"required" : true
		},
		"location" : {
			"type" : "short",
			"header" : "Location",
			"required" : true
		},
		"description" : {
			"type" : "long",
			"header" : "Description",
			"required" : true
		},
		"date" : {
			"type" : "date",
			"header" : "Date",
			"required" : true
		},
		"startTime" : {
			"type" : "time",
			"header" : "Start Time",
			"required" : true
		},
		"endTime" : {
			"type" : "time",
			"header" : "End Time",
			"required" : true
		},
		"image" : {
			"type" : "image",
			"header" : "Banner Image",
			"required" : false
		},
		"submit" : {
			"type" : "submit",
			"header" : "Add Event",
			"required" : false
		}
	},
	"editEvent" : {
		"title" : {
			"type" : "short",
			"header" : "Title",
			"required" : true
		},
		"location" : {
			"type" : "short",
			"header" : "Location",
			"required" : true
		},
		"description" : {
			"type" : "long",
			"header" : "Description",
			"required" : true
		},
		"date" : {
			"type" : "date",
			"header" : "Date",
			"required" : true
		},
		"startTime" : {
			"type" : "time",
			"header" : "Start Time",
			"required" : true
		},
		"endTime" : {
			"type" : "time",
			"header" : "End Time",
			"required" : true
		},
		"image" : {
			"type" : "image",
			"header" : "Banner Image",
			"required" : false
		},
		"submit" : {
			"type" : "submit",
			"header" : "Apply",
			"required" : false
		},
		"delete" : {
			"type" : "delete",
			"header" : "Remove Event",
			"required" : false
		}
	},
	"addCourse" : {
		"courseName" : {
			"type" : "short",
			"header" : "Course Name",
			"required" : true
		},
		"teacher" : {
			"type" : "short",
			"header" : "Teacher",
			"required" : false
		},
		"submit" : {
			"type" : "submit",
			"header" : "Add Course",
			"required" : false
		}
	},
	"editCourse" : {
		"courseName" : {
			"type" : "short",
			"header" : "Course Name",
			"required" : true
		},
		"teacher" : {
			"type" : "short",
			"header" : "Teacher",
			"required" : false
		},
		"submit" : {
			"type" : "submit",
			"header" : "Apply",
			"required" : false
		},
		"delete" : {
			"type" : "delete",
			"header" : "Remove Event",
			"required" : false
		}
	},
	"addUser" : {
		"firstName" : {
			"type" : "short",
			"header" : "First Name",
			"required" : true
		},
		"lastName" : {
			"type" : "short",
			"header" : "Last Name",
			"required" : true
		},
		"email" : {
			"type" : "email",
			"header" : "Email",
			"required" : true
		},
		"permission" : {
			"type" : "dropdown",
			"data" : ["admin", "faculty", "student"],
			"header" : "Permission",
			"required" : true
		}

	}
};

export default settingsList;