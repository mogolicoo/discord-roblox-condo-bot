// functions for generating shit
function randomNmb(length) {
    let str = "";
    let charset = "1234567890";
    let charsLength = charset.length;
    for (var i = 0; i < length; i++) {
        str += charset.charAt(ran(charsLength))
    }
    return str
}

function ran(max,asd) {
    var generated=Math.floor(Math.random() * max)
    if (generated.toString().length == 2 && asd == true) {
        generated = `0${generated}`
    } else if (generated.toString().length == 1 && asd == true) {
        generated = `00${generated}`
    } else if (generated == 0 && asd == true) {
        generated = "000"
    }
    return generated
}

function generateColor3uint() {
    return `4${ran(255,true)}${ran(255,true)}${ran(255,true)}`
}

function generateCFrame() {
    return `${ran(400)}.${randomNmb(7)}`
}

function generateReferent(length, isLowercase) {
    let str = "";
    let charset = "1234567890ABCDEF";
    let charsLength = charset.length;
    for (var i = 0; i < length; i++) {
        str += charset.charAt(ran(charsLength))
    }
    return isLowercase == true && str.toLowerCase() || str
}

function generateGuid(isBrackets) {
    let str = generateReferent(8)

    for (var v of [4, 4, 4, 12]) {
        str += `-${generateReferent(v)}`
    }

    return isBrackets == true && `{${str}}` || str
}

// functions for replacing shit
function replaceIdentifiers(str, match, replace, isDebug, func, ...args) {
    let newStr = str;
    let oldIdentifiers = [];
    let ignore = {};
    if (isDebug == true) {
        console.log(`[DEBUG]: Searching Matches based on provided regex`)
    }
    let matches = str.match(match);
    if (matches == undefined) {
        matches = []
    }
    for (var ref of matches) {
        if (isDebug == true) {
            console.log(`[DEBUG]: Match Found: ${ref}`)
        }
        if (!ignore[ref]) {
            ignore[ref] = true;
            oldIdentifiers.push(ref)
        }
    };
    if (isDebug == true) {
        console.log("[DEBUG]: Generating new values")
    }
    let idMap = {};
    for (var indx of oldIdentifiers) {
                                    //  vvvv   this is so we can use %s shit
        idMap[indx] = replace.replace(/%\w+/g, function() {
            let thingy = func(...args)
            if (isDebug == true) {
                console.log(`[DEBUG]: Passed Arguments: ${args}`)
                console.log(`[DEBUG]: Generated Value: ${thingy}`)
            }
            return thingy
        })
    }
    if (isDebug == true) {
        console.log("[DEBUG]: Starting to replace strings")
    }
    newStr = newStr.replace(match, function(oldId) {
        if (isDebug == true) {
            console.log(`[DEBUG]: "${oldId}" has been replaced to "${idMap[oldId]}"`)
        }
        return idMap[oldId]
    })
    return newStr;
}

export default function(str, debug, cframes, color3) {
    // i added the color3uint8 and coordinateframe ones for making it "more random", but if it breaks your game
    // or something you can remove it
    let newString = replaceIdentifiers(str, /RBX[0-9A-Fa-f]{32}/ig, "RBX%s", debug, generateReferent, 32, false)
    newString = replaceIdentifiers(newString, /<string name="ScriptGuid">{([0-9A-Fa-f]+)?-[0-9A-Fa-f]+-[0-9A-Fa-f]+-[0-9A-Fa-f]+-[0-9A-Fa-f]+}<\/string>/ig, "<string name=\"ScriptGuid\">%s</string>", debug, generateGuid, true)
    newString = replaceIdentifiers(newString, /<UniqueId name="UniqueId">[A-Fa-f0-9]{32}<\/UniqueId>/ig, "<UniqueId name=\"UniqueId\">%s</UniqueId>", debug, generateReferent, 32, true);
    if (cframes == true) {
        newString = replaceIdentifiers(newString, /<CoordinateFrame name="CFrame">\n?\s*<X>[-]*(\d)*\d*\.*(\d)*<\/X>\n?\s*<Y>[-]*(\d)*\d*\.*(\d)*<\/Y>\n?\s*<Z>[-]*(\d)*\d*\.*(\d)*<\/Z>/ig, "<CoordinateFrame name=\"CFrame\">\n<X>%s</X>\n<Y>%s</Y>\n<Z>%s</Z>", debug, generateCFrame);
    }
    if (color3 == true) {
        newString = replaceIdentifiers(newString, /<Color3uint8 name="Color3uint8">(\d){10}<\/Color3uint8>/ig, "<Color3uint8 name=\"Color3uint8\">%s</Color3uint8>", debug, generateColor3uint);
    }
    return newString;
}