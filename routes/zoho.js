var Zoho = require('node-zoho');
var nconf = require('nconf');

exports.insert = function(req, res) {

	var zoho = new Zoho({
		authToken:"47a521ff83bdffe1862fe60c6242b09d"
	});

	var records;

		
	console.log('--- req ', req.body)

	records =  [{  
		"Lead Source"		: ((req.body && req.body.lead_source) ? req.body.lead_source : "Site Registration"),
		// "Lead Source"		: "Support",,
		"First Name"		: ((req.body && req.body.first_name) ? req.body.first_name : ""),
		"Last Name"			: ((req.body && req.body.last_name) ? req.body.last_name : ""),
		"Phone"				: ((req.body && req.body.phone) ? req.body.phone : ""),
		"Company"			: ((req.body && req.body.company) ? req.body.company : ""),
		"Email"				: ((req.body && req.body.email) ? req.body.email : ""),
		"Street"			: ((req.body && req.body.address) ? req.body.address : ""),
		"City"				: ((req.body && req.body.city) ? req.body.city : ""),
		"State"				: ((req.body && req.body.state) ? req.body.state : ""),
		"Zip Code"			: ((req.body && req.body.zip) ? req.body.zip : "")
	}];

	zoho.execute('crm', 'Leads', 'insertRecords', records, function(err, result) { 
		console.log('---- result ', result)
		if (err !== null) {  
			console.error("Zoho Error: " + err);
			return res.status(200).send({
				success: false,
				err: err
			}) 
		} else if (result.isError()) {  
			console.error("Zoho Error: " + result.message);
			return res.status(200).send({
				success: false,
				data: result.message
			}) 
		} else {
			return res.status(200).send({
			    success: true,
			    data: result.data
			}) 
			// res.render('../views/contactus',{title:'Contact Us'});
		}
	});
};
