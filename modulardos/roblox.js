/* 

	here we handle the roblox shit

*/

// modules
import fetch from 'node-fetch';

// old funcs
async function getXCSRF(cookie) {
    let LogoutInformation = await fetch("https://auth.roblox.com/v2/logout", {
        method: "POST",
        headers: {
            "Cookie": `.ROBLOSECURITY=${cookie}`
        }
    })
    return LogoutInformation.headers.get("x-csrf-token");
}

async function getUniverses(cookie) { 
    let Universes = await fetch(`https://develop.roblox.com/v1/search/universes?q=creator:User&limit=50&sort=-GameCreated`,{
        headers: {
            Cookie: `.ROBLOSECURITY=${cookie}`,
            Referer: "https://www.roblox.com/",
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 OPR/78.0.4093.186",
        }
    })

    return await Universes.json()
}

async function getStarterUniverse(cookie) {
    let UserUniverses = await getUniverses(cookie)
	if (!UserUniverses["data"]) {
		return {"error": "true"}
	}
	if (UserUniverses["data"].length == 0) {
		return {"error": "true"}
	}
    return UserUniverses.data[0].id
}

async function getStarterPlace(cookie) {
    let FirstUniverse = await getStarterUniverse(cookie)
	if (FirstUniverse["error"]) {
		return {"error": "true"}
	}
    let LinkedPlaces = await fetch(`https://games.roblox.com/v1/games?universeIds=${FirstUniverse}`, {
        headers: {
            Referer: "https://www.roblox.com/",
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 OPR/78.0.4093.186",
        }
    })
    LinkedPlaces = await LinkedPlaces.json()
	if (!LinkedPlaces["data"]) {
		return {"error": "true"}
	}
    return LinkedPlaces.data[0].rootPlaceId
}

// new functions lol
async function updatePlace(cookie, content) {
    let XCSRFTOKEN = await getXCSRF(cookie);
	let placeId = await getStarterPlace(cookie);
	let UploadResponse = await fetch(`https://data.roblox.com/Data/Upload.ashx?assetid=${placeId}&type=Place`, {
        method: "POST",
        headers: {
            "User-Agent": "Roblox/WinInet",
            "x-csrf-token": XCSRFTOKEN,
            "Content-Type": "application/xml",
            "Cookie": `.ROBLOSECURITY=${cookie}`,
        },
        body: content,
    })
    return UploadResponse
}

async function getSignupXCSRF() {
    let resp = await fetch("https://auth.roblox.com/v2/login", {
        method: "POST",
        headers: {
            Referer: "https://www.roblox.com/",
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 OPR/78.0.4093.186",
        }
    })
    return resp.headers.get("x-csrf-token")
}

function randomString2(length) {
    var result = '';
    var characters = '_SwrRo.rMn4Iof-01234567';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function randomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

async function makeNewUsername() {
    let newUsername = randomString(15)
    let info = await fetch(`https://auth.roblox.com/v1/usernames/validate?request.username=${newUsername}&request.birthday=04%20Nov%201936&request.context=Signup`)
    info = await info.json()
    if (info.message == "Username is valid") {
        return newUsername
    } else {
        let anotherTry = await makeNewUsername()
        return anotherTry
    }
}

async function createAccount(captchaId, token) {
	let data = {};
	let xcsrf = await getSignupXCSRF();
	if (captchaId != undefined && token != undefined) {
		let username = await makeNewUsername();
		let pass = await randomString(14);
		data = {
			username: username,
			password: pass,
			birthday: "04 Nov 1936",
			gender: 2,
			isTosAgreementBoxChecked: true,
			context: "MultiverseSignupForm",
			referralData: null,
			displayAvatarV2: false,
			displayContextV2: false,
			captchaId: captchaId,
			captchaToken: token, 
			captchaProvider: "PROVIDER_ARKOSE_LABS"
		}
	}
	data = JSON.stringify(data)
    let info = await fetch("https://auth.roblox.com/v2/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Referer": "https://www.roblox.com/",
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 OPR/78.0.4093.186",
            "x-csrf-token": xcsrf
        },
        body: data
    })
    return info
}

async function setPublicUniverse(universeId, cookie, xcsrf, active) {
    let api = (active == true && "activate" || active == false && "deactivate")
    let info = await fetch(`https://develop.roblox.com/v1/universes/${universeId}/${api}`, {
        method: "POST",
        headers: {
            "Referer": "https://www.roblox.com/",
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 OPR/78.0.4093.186",
            "x-csrf-token": xcsrf,
            "Cookie": `.ROBLOSECURITY=${cookie}`
        }
    });
    return info
}

async function setPublic(cookie, active) {
    let XCSRF = await getXCSRF(cookie);
    let asdasdsSHIT = await getStarterUniverse(cookie);
	if (asdasdsSHIT["error"]) {
		return {"error": "true"}
	}
    let MORE_SHIT = await setPublicUniverse(asdasdsSHIT, cookie, XCSRF, active);
    return MORE_SHIT
}

async function setUniverseConfig(cookie, avatarType, socialName, socialUrl) {
    let XCSRF = await getXCSRF(cookie);
    let universeId = await getStarterUniverse(cookie);
	let info = await fetch(`https://develop.roblox.com/v2/universes/${universeId}/configuration`, {
        method: "PATCH",
        headers: {
            "Referer": "https://www.roblox.com/",
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 OPR/78.0.4093.186",
            "x-csrf-token": XCSRF,
			"Content-Type": "application/json",
            "Cookie": `.ROBLOSECURITY=${cookie}`
        },
		body: `{"universeAvatarType": "MorphTo${avatarType}", "allowPrivateServers": true, "privateServerPrice": 0, "permissions": {"IsThirdPartyAssetAllowed": true, "IsThirdPartyPurchaseAllowed": true, "IsThirdPartyTeleportAllowed": true}}`
	});
    if (info.status != 200) {
        return setUniverseConfig(cookie, avatarType, socialName, socialUrl)
    }
	let secondxcsrf = await getXCSRF(cookie);
	await fetch(`https://develop.roblox.com/v1/universes/${universeId}/social-links`, {
        method: "POST",
        headers: {
            "Referer": "https://www.roblox.com/",
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 OPR/78.0.4093.186",
            "X-CSRF-TOKEN": secondxcsrf,
			"Content-Type": "application/json",
            "Cookie": `.ROBLOSECURITY=${cookie}`
        },
		body: `{"type":"Discord","url":"${socialUrl}","title":"${socialName}"}`
	});
    return info
}

async function setPlaceConfig(cookie, name, amount) {
	let XCSRF = await getXCSRF(cookie);
    let placeId = await getStarterPlace(cookie);
	let data = {"maxPlayerCount": amount}
	if (name != undefined) {
		data["name"] = name
	}
	data = JSON.stringify(data)
	let info = await fetch(`https://develop.roblox.com/v2/places/${placeId}`, {
        method: "PATCH",
        headers: {
            "Referer": "https://www.roblox.com/",
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 OPR/78.0.4093.186",
            "x-csrf-token": XCSRF,
			"Content-Type": "application/json",
            "Cookie": `.ROBLOSECURITY=${cookie}`
        },
		body: data
	});
    return info
}

async function getDownloadUrl(assetId) {
	let info = await fetch(`https://assetdelivery.roblox.com/v1/assetId/${assetId}`, {method: "GET", headers: {"User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 OPR/78.0.4093.186"}})
	info = await info.json()
	return info.location
}

async function uploadModel(content, cookie) {
    let xcsrf = await getXCSRF(cookie)
	// let random_name = randomString(15)
	// console.log(random_name)
    let response = await fetch("http://data.roblox.com/Data/Upload.ashx?assetid=0&type=Model&name=module&description=module&genreTypeId=1&ispublic=false&allowcomments=false", {
        method: "POST",
        headers: {
            "User-Agent": "Roblox/WinInet",
            "x-csrf-token": xcsrf,
            "Content-Type": "application/xml",
            "Cookie": `.ROBLOSECURITY=${cookie}`,
        },
        body: content,
    })
    return response
}

async function enableVC(cookie) {
	/*
    let xcsrf = await getXCSRF(cookie);
    let universeId = await getStarterUniverse(cookie);
    let info = await fetch(`https://voice.roblox.com/v1/settings/universe/${universeId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": `.ROBLOSECURITY=${cookie}`,
            "User-Agent": "RobloxStudio/WinInet",
            "X-CSRF-TOKEN": xcsrf
        },
        body: '{"optIn": true}'
    })
    return info;*/
	return {"status": 200}
}

// module export shit
export {
    createAccount,
	randomString2,
    updatePlace,
    setPublic,
	setUniverseConfig,
	setPlaceConfig,
    enableVC,
	getDownloadUrl,
	uploadModel
}