# discord-roblox-condo-bot

**(3/4/22 edit: it seems that roblox patched most of the stuff here, kudos to them)**

a discord bot that uploads roblox condos fully open sourced written in js

(ugly, old, spaghetti and broken)

# hwo it swork
1. bot sends user captcha
2. user solves captcha and bot creates account roblox
3. bot uses roblox account and uploads a module
4. bot creates a random script and a random place 
5. bot updates starter place with the random place with all random shit
6. bot sends place to user
7. user gets lego sex

# how to sethiup
set a enviroment key named "TOKEN" with your discord bot token

once you have all changed and shit just do this command "m?start #channel-name" so the bot sends the initial embed with the buttons and shit

# hwo to add maps
edit shit in `./general/maps.json` for changing the list of games in the embed and also add your map module within `./general/modules_rbxmx`

it's easy to understand how to add maps also i left there some old maps i don't use anymore as examples

# featrues
- embeds
- buttons
- fixed captcha shit
- games lasts for 5 seconds
- you can change name and max player count within the bot
- it's hard to customize
- some roblox place scrubber that i ported from lua to javascript (if i'm not too lazy to search i'll add credits later to the original dude)
- uhhh idk, spaghetti code

# fix it
no, fix it yourself and learn how to setup properly, there are stuff that is broken and i don't want to document it so go ahead and do your work trying to read all this bad and old code.

# can i fix it and do a fork of this
yeah you can if you want

# can you help me
no

# why is everything in spanish?
this was made for an spanish condo server but since i left the server i don't want this bot to be private anymore, so go ahead and do whatever you want with it

# any hint on how to change the embeds and shit
`./index.js` and `./modulardos/main.js` has some embed stuff in it so yeah, also the `./bot-configs.json` has some embed shit in there but only for errors sooo yeah
also you can enable logs when a user gets an error and a user creates a game with the bot

# end
anyways have fun trying to figure how to make this shit work
also credits to [roblox-thot](https://github.com/Roblox-Thot/captchaCodeMakerV2) for the fix on the captcha shit patch
