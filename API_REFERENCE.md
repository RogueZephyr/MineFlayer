# Minecraft Bot Framework API Reference

This comprehensive reference combines documentation from three key MineFlayer-related projects:
- [MineFlayer](https://github.com/PrismarineJS/mineflayer) - Core bot framework
- [Prismarine Viewer](https://github.com/PrismarineJS/prismarine-viewer) - Real-time 3D viewer
- [MineFlayer Pathfinder](https://github.com/PrismarineJS/mineflayer-pathfinder) - Advanced pathfinding

---

## Table of Contents

### MineFlayer Core API
- [API Overview](#api)
- [Enums](#enums)
- [Classes](#classes)
- [Bot Instance](#bot)
- [Events](#events)
- [Functions](#functions)
- [Methods](#methods)
- [Lower Level Methods](#lower-level-inventory-methods)
- [Creative Mode](#botcreative)

### Prismarine Viewer API
- [Viewer Class](#viewer)
- [WorldView Class](#worldview)
- [MapControls](#mapcontrols)

### MineFlayer Pathfinder API
- [Installation](#install)
- [Tutorial](#tutorial--explanation)
- [Video Tutorials](#video-tutorials)
- [Example](#example)
- [Features](#features)
- [API Functions](#functions)
- [Movement Class](#movement-class)
- [Events](#events-1)
- [Goals](#goals)

---

# MineFlayer Core API

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Minecraft Bot Framework API Reference](#minecraft-bot-framework-api-reference)
  - [Table of Contents](#table-of-contents)
    - [MineFlayer Core API](#mineflayer-core-api)
    - [Prismarine Viewer API](#prismarine-viewer-api)
    - [MineFlayer Pathfinder API](#mineflayer-pathfinder-api)
- [MineFlayer Core API](#mineflayer-core-api-1)
- [API](#api)
  - [Enums](#enums)
    - [minecraft-data](#minecraft-data)
    - [mcdata.blocks](#mcdatablocks)
    - [mcdata.items](#mcdataitems)
    - [mcdata.materials](#mcdatamaterials)
    - [mcdata.recipes](#mcdatarecipes)
    - [mcdata.instruments](#mcdatainstruments)
    - [mcdata.biomes](#mcdatabiomes)
    - [mcdata.entities](#mcdataentities)
  - [Classes](#classes)
    - [vec3](#vec3)
    - [mineflayer.Location](#mineflayerlocation)
    - [Entity](#entity)
      - [Player Skin Data](#player-skin-data)
    - [Block](#block)
    - [Biome](#biome)
    - [Item](#item)
    - [windows.Window (base class)](#windowswindow-base-class)
      - [window.deposit(itemType, metadata, count, nbt)](#windowdeposititemtype-metadata-count-nbt)
      - [window.withdraw(itemType, metadata, count, nbt)](#windowwithdrawitemtype-metadata-count-nbt)
      - [window.close()](#windowclose)
    - [Recipe](#recipe)
    - [mineflayer.Container](#mineflayercontainer)
    - [mineflayer.Furnace](#mineflayerfurnace)
      - [furnace "update"](#furnace-update)
      - [furnace.takeInput()](#furnacetakeinput)
      - [furnace.takeFuel()](#furnacetakefuel)
      - [furnace.takeOutput()](#furnacetakeoutput)
      - [furnace.putInput(itemType, metadata, count)](#furnaceputinputitemtype-metadata-count)
      - [furnace.putFuel(itemType, metadata, count)](#furnaceputfuelitemtype-metadata-count)
      - [furnace.inputItem()](#furnaceinputitem)
      - [furnace.fuelItem()](#furnacefuelitem)
      - [furnace.outputItem()](#furnaceoutputitem)
      - [furnace.fuel](#furnacefuel)
      - [furnace.progress](#furnaceprogress)
    - [mineflayer.EnchantmentTable](#mineflayerenchantmenttable)
      - [enchantmentTable "ready"](#enchantmenttable-ready)
      - [enchantmentTable.targetItem()](#enchantmenttabletargetitem)
      - [enchantmentTable.xpseed](#enchantmenttablexpseed)
      - [enchantmentTable.enchantments](#enchantmenttableenchantments)
      - [enchantmentTable.enchant(choice)](#enchantmenttableenchantchoice)
      - [enchantmentTable.takeTargetItem()](#enchantmenttabletaketargetitem)
      - [enchantmentTable.putTargetItem(item)](#enchantmenttableputtargetitemitem)
      - [enchantmentTable.putLapis(item)](#enchantmenttableputlapisitem)
    - [mineflayer.anvil](#mineflayeranvil)
      - [anvil.combine(itemOne, itemTwo\[, name\])](#anvilcombineitemone-itemtwo-name)
      - [anvil.combine(item\[, name\])](#anvilcombineitem-name)
      - [villager "ready"](#villager-ready)
      - [villager.trades](#villagertrades)
      - [villager.trade(tradeIndex, \[times\])](#villagertradetradeindex-times)
    - [mineflayer.ScoreBoard](#mineflayerscoreboard)
      - [ScoreBoard.name](#scoreboardname)
      - [ScoreBoard.title](#scoreboardtitle)
      - [ScoreBoard.itemsMap](#scoreboarditemsmap)
      - [ScoreBoard.items](#scoreboarditems)
    - [mineflayer.Team](#mineflayerteam)
      - [Team.name](#teamname)
      - [Team.friendlyFire](#teamfriendlyfire)
      - [Team.nameTagVisibility](#teamnametagvisibility)
      - [Team.collisionRule](#teamcollisionrule)
      - [Team.color](#teamcolor)
      - [Team.prefix](#teamprefix)
      - [Team.suffix](#teamsuffix)
      - [Team.members](#teammembers)
    - [mineflayer.BossBar](#mineflayerbossbar)
      - [BossBar.title](#bossbartitle)
      - [BossBar.health](#bossbarhealth)
      - [BossBar.dividers](#bossbardividers)
      - [BossBar.entityUUID](#bossbarentityuuid)
      - [BossBar.shouldDarkenSky](#bossbarshoulddarkensky)
      - [BossBar.isDragonBar](#bossbarisdragonbar)
      - [BossBar.createFog](#bossbarcreatefog)
      - [BossBar.color](#bossbarcolor)
    - [mineflayer.Particle](#mineflayerparticle)
      - [Particle.id](#particleid)
      - [Particle.name](#particlename)
      - [Particle.position](#particleposition)
      - [Particle.offset](#particleoffset)
      - [Particle.longDistanceRender](#particlelongdistancerender)
      - [Particle.count](#particlecount)
      - [Particle.movementSpeed](#particlemovementspeed)
  - [Bot](#bot)
    - [mineflayer.createBot(options)](#mineflayercreatebotoptions)
    - [Properties](#properties)
      - [bot.registry](#botregistry)
      - [bot.world](#botworld)
        - [world "blockUpdate" (oldBlock, newBlock)](#world-blockupdate-oldblock-newblock)
        - [world "blockUpdate:(x, y, z)" (oldBlock, newBlock)](#world-blockupdatex-y-z-oldblock-newblock)
      - [bot.entity](#botentity)
      - [bot.entities](#botentities)
      - [bot.username](#botusername)
      - [bot.spawnPoint](#botspawnpoint)
      - [bot.heldItem](#bothelditem)
      - [bot.usingHeldItem](#botusinghelditem)
      - [bot.game.levelType](#botgameleveltype)
      - [bot.game.dimension](#botgamedimension)
      - [bot.game.difficulty](#botgamedifficulty)
      - [bot.game.gameMode](#botgamegamemode)
      - [bot.game.hardcore](#botgamehardcore)
      - [bot.game.maxPlayers](#botgamemaxplayers)
      - [bot.game.serverBrand](#botgameserverbrand)
      - [bot.game.minY](#botgameminy)
      - [bot.game.height](#botgameheight)
      - [bot.physicsEnabled](#botphysicsenabled)
      - [bot.player](#botplayer)
      - [bot.players](#botplayers)
      - [bot.tablist](#bottablist)
      - [bot.isRaining](#botisraining)
      - [bot.rainState](#botrainstate)
      - [bot.thunderState](#botthunderstate)
      - [bot.chatPatterns](#botchatpatterns)
      - [bot.settings.chat](#botsettingschat)
      - [bot.settings.colorsEnabled](#botsettingscolorsenabled)
      - [bot.settings.viewDistance](#botsettingsviewdistance)
      - [bot.settings.difficulty](#botsettingsdifficulty)
      - [bot.settings.skinParts](#botsettingsskinparts)
        - [bot.settings.skinParts.showCape - boolean](#botsettingsskinpartsshowcape---boolean)
        - [bot.settings.skinParts.showJacket - boolean](#botsettingsskinpartsshowjacket---boolean)
        - [bot.settings.skinParts.showLeftSleeve - boolean](#botsettingsskinpartsshowleftsleeve---boolean)
        - [bot.settings.skinParts.showRightSleeve - boolean](#botsettingsskinpartsshowrightsleeve---boolean)
        - [bot.settings.skinParts.showLeftPants - boolean](#botsettingsskinpartsshowleftpants---boolean)
        - [bot.settings.skinParts.showRightPants - boolean](#botsettingsskinpartsshowrightpants---boolean)
        - [bot.settings.skinParts.showHat - boolean](#botsettingsskinpartsshowhat---boolean)
      - [bot.settings.enableTextFiltering - boolean](#botsettingsenabletextfiltering---boolean)
      - [bot.settings.enableServerListing - boolean](#botsettingsenableserverlisting---boolean)
      - [bot.experience.level](#botexperiencelevel)
      - [bot.experience.points](#botexperiencepoints)
      - [bot.experience.progress](#botexperienceprogress)
      - [bot.health](#bothealth)
      - [bot.food](#botfood)
      - [bot.foodSaturation](#botfoodsaturation)
      - [bot.oxygenLevel](#botoxygenlevel)
      - [bot.physics](#botphysics)
      - [bot.fireworkRocketDuration](#botfireworkrocketduration)
      - [bot.simpleClick.leftMouse (slot)](#botsimpleclickleftmouse-slot)
      - [bot.simpleClick.rightMouse (slot)](#botsimpleclickrightmouse-slot)
      - [bot.time.doDaylightCycle](#bottimedodaylightcycle)
      - [bot.time.bigTime](#bottimebigtime)
      - [bot.time.time](#bottimetime)
      - [bot.time.timeOfDay](#bottimetimeofday)
      - [bot.time.day](#bottimeday)
      - [bot.time.isDay](#bottimeisday)
      - [bot.time.moonPhase](#bottimemoonphase)
      - [bot.time.bigAge](#bottimebigage)
      - [bot.time.age](#bottimeage)
      - [bot.quickBarSlot](#botquickbarslot)
      - [bot.inventory](#botinventory)
      - [bot.targetDigBlock](#bottargetdigblock)
      - [bot.isSleeping](#botissleeping)
      - [bot.scoreboards](#botscoreboards)
      - [bot.scoreboard](#botscoreboard)
      - [bot.teams](#botteams)
      - [bot.teamMap](#botteammap)
      - [bot.controlState](#botcontrolstate)
    - [Events](#events)
      - ["chat" (username, message, translate, jsonMsg, matches)](#chat-username-message-translate-jsonmsg-matches)
      - ["whisper" (username, message, translate, jsonMsg, matches)](#whisper-username-message-translate-jsonmsg-matches)
      - ["actionBar" (jsonMsg, verified)](#actionbar-jsonmsg-verified)
      - ["message" (jsonMsg, position, sender, verified)](#message-jsonmsg-position-sender-verified)
      - ["messagestr" (message, messagePosition, jsonMsg, sender, verified)](#messagestr-message-messageposition-jsonmsg-sender-verified)
      - ["inject\_allowed"](#inject_allowed)
      - ["login"](#login)
      - ["spawn"](#spawn)
      - ["respawn"](#respawn)
      - ["game"](#game)
      - ["resourcePack" (url, hash)](#resourcepack-url-hash)
      - ["title" (title, type)](#title-title-type)
      - ["title\_times" (fadeIn, stay, fadeOut)](#title_times-fadein-stay-fadeout)
      - ["title\_clear"](#title_clear)
      - ["rain"](#rain)
      - ["weatherUpdate"](#weatherupdate)
      - ["time"](#time)
      - ["kicked" (reason, loggedIn)](#kicked-reason-loggedin)
      - ["end" (reason)](#end-reason)
      - ["error" (err)](#error-err)
      - ["spawnReset"](#spawnreset)
      - ["death"](#death)
      - ["health"](#health)
      - ["breath"](#breath)
      - ["entityAttributes" (entity)](#entityattributes-entity)
      - ["entitySwingArm" (entity)](#entityswingarm-entity)
      - ["entityHurt" (entity)](#entityhurt-entity)
      - ["entityDead" (entity)](#entitydead-entity)
      - ["entityTaming" (entity)](#entitytaming-entity)
      - ["entityTamed" (entity)](#entitytamed-entity)
      - ["entityShakingOffWater" (entity)](#entityshakingoffwater-entity)
      - ["entityEatingGrass" (entity)](#entityeatinggrass-entity)
      - ["entityHandSwap" (entity)](#entityhandswap-entity)
      - ["entityWake" (entity)](#entitywake-entity)
      - ["entityEat" (entity)](#entityeat-entity)
      - ["entityCriticalEffect" (entity)](#entitycriticaleffect-entity)
      - ["entityMagicCriticalEffect" (entity)](#entitymagiccriticaleffect-entity)
      - ["entityCrouch" (entity)](#entitycrouch-entity)
      - ["entityUncrouch" (entity)](#entityuncrouch-entity)
      - ["entityEquip" (entity)](#entityequip-entity)
      - ["entitySleep" (entity)](#entitysleep-entity)
      - ["entitySpawn" (entity)](#entityspawn-entity)
      - ["entityElytraFlew" (entity)](#entityelytraflew-entity)
      - ["itemDrop" (entity)](#itemdrop-entity)
      - ["playerCollect" (collector, collected)](#playercollect-collector-collected)
      - ["entityGone" (entity)](#entitygone-entity)
      - ["entityMoved" (entity)](#entitymoved-entity)
      - ["entityDetach" (entity, vehicle)](#entitydetach-entity-vehicle)
      - ["entityAttach" (entity, vehicle)](#entityattach-entity-vehicle)
      - ["entityUpdate" (entity)](#entityupdate-entity)
      - ["entityEffect" (entity, effect)](#entityeffect-entity-effect)
      - ["entityEffectEnd" (entity, effect)](#entityeffectend-entity-effect)
      - ["playerJoined" (player)](#playerjoined-player)
      - ["playerUpdated" (player)](#playerupdated-player)
      - ["playerLeft" (player)](#playerleft-player)
      - ["blockUpdate" (oldBlock, newBlock)](#blockupdate-oldblock-newblock)
      - ["blockUpdate:(x, y, z)" (oldBlock, newBlock)](#blockupdatex-y-z-oldblock-newblock)
      - ["blockPlaced" (oldBlock, newBlock)](#blockplaced-oldblock-newblock)
      - ["chunkColumnLoad" (point)](#chunkcolumnload-point)
      - ["chunkColumnUnload" (point)](#chunkcolumnunload-point)
      - ["soundEffectHeard" (soundName, position, volume, pitch)](#soundeffectheard-soundname-position-volume-pitch)
      - ["hardcodedSoundEffectHeard" (soundId, soundCategory, position, volume, pitch)](#hardcodedsoundeffectheard-soundid-soundcategory-position-volume-pitch)
      - ["noteHeard" (block, instrument, pitch)](#noteheard-block-instrument-pitch)
      - ["pistonMove" (block, isPulling, direction)](#pistonmove-block-ispulling-direction)
      - ["chestLidMove" (block, isOpen, block2)](#chestlidmove-block-isopen-block2)
      - ["blockBreakProgressObserved" (block, destroyStage, entity)](#blockbreakprogressobserved-block-destroystage-entity)
      - ["blockBreakProgressEnd" (block, entity)](#blockbreakprogressend-block-entity)
      - ["diggingCompleted" (block)](#diggingcompleted-block)
      - ["diggingAborted" (block)](#diggingaborted-block)
      - ["usedFirework" (fireworkEntityId)](#usedfirework-fireworkentityid)
      - ["move"](#move)
      - ["forcedMove"](#forcedmove)
      - ["mount"](#mount)
      - ["dismount" (vehicle)](#dismount-vehicle)
      - ["windowOpen" (window)](#windowopen-window)
      - ["windowClose" (window)](#windowclose-window)
      - ["sleep"](#sleep)
      - ["wake"](#wake)
      - ["experience"](#experience)
      - ["scoreboardCreated" (scoreboard)](#scoreboardcreated-scoreboard)
      - ["scoreboardDeleted" (scoreboard)](#scoreboarddeleted-scoreboard)
      - ["scoreboardTitleChanged" (scoreboard)](#scoreboardtitlechanged-scoreboard)
      - ["scoreUpdated" (scoreboard, item)](#scoreupdated-scoreboard-item)
      - ["scoreRemoved" (scoreboard, item)](#scoreremoved-scoreboard-item)
      - ["scoreboardPosition" (position, scoreboard)](#scoreboardposition-position-scoreboard)
      - ["teamCreated" (team)](#teamcreated-team)
      - ["teamRemoved" (team)](#teamremoved-team)
      - ["teamUpdated" (team)](#teamupdated-team)
      - ["teamMemberAdded" (team)](#teammemberadded-team)
      - ["teamMemberRemoved" (team)](#teammemberremoved-team)
      - ["bossBarCreated" (bossBar)](#bossbarcreated-bossbar)
      - ["bossBarDeleted" (bossBar)](#bossbardeleted-bossbar)
      - ["bossBarUpdated" (bossBar)](#bossbarupdated-bossbar)
      - ["heldItemChanged" (heldItem)](#helditemchanged-helditem)
      - ["physicsTick" ()](#physicstick-)
      - ["chat:name" (matches)](#chatname-matches)
      - ["particle"](#particle)
    - [Functions](#functions)
      - [bot.blockAt(point, extraInfos=true)](#botblockatpoint-extrainfostrue)
      - [bot.waitForChunksToLoad()](#botwaitforchunkstoload)
      - [bot.blockInSight(maxSteps, vectorLength)](#botblockinsightmaxsteps-vectorlength)
      - [bot.blockAtCursor(maxDistance=256)](#botblockatcursormaxdistance256)
      - [bot.entityAtCursor(maxDistance=3.5)](#botentityatcursormaxdistance35)
      - [bot.blockAtEntityCursor(entity=bot.entity, maxDistance=256)](#botblockatentitycursorentitybotentity-maxdistance256)
      - [bot.canSeeBlock(block)](#botcanseeblockblock)
      - [bot.findBlocks(options)](#botfindblocksoptions)
      - [bot.findBlock(options)](#botfindblockoptions)
      - [bot.canDigBlock(block)](#botcandigblockblock)
      - [bot.recipesFor(itemType, metadata, minResultCount, craftingTable)](#botrecipesforitemtype-metadata-minresultcount-craftingtable)
      - [bot.recipesAll(itemType, metadata, craftingTable)](#botrecipesallitemtype-metadata-craftingtable)
      - [bot.nearestEntity(match = (entity) =\> { return true })](#botnearestentitymatch--entity---return-true-)
    - [Methods](#methods)
      - [bot.end(reason)](#botendreason)
      - [bot.quit(reason)](#botquitreason)
      - [bot.tabComplete(str, \[assumeCommand\], \[sendBlockInSight\], \[timeout\])](#bottabcompletestr-assumecommand-sendblockinsight-timeout)
      - [bot.chat(message)](#botchatmessage)
      - [bot.whisper(username, message)](#botwhisperusername-message)
      - [bot.chatAddPattern(pattern, chatType, description)](#botchataddpatternpattern-chattype-description)
      - [bot.addChatPattern(name, pattern, chatPatternOptions)](#botaddchatpatternname-pattern-chatpatternoptions)
      - [bot.addChatPatternSet(name, patterns, chatPatternOptions)](#botaddchatpatternsetname-patterns-chatpatternoptions)
      - [bot.removeChatPattern(name)](#botremovechatpatternname)
      - [bot.awaitMessage(...args)](#botawaitmessageargs)
- [Prismarine Viewer API](#prismarine-viewer-api-1)
  - [Viewer](#viewer)
    - [Viewer(renderer)](#viewerrenderer)
    - [version](#version)
    - [setVersion(version)](#setversionversion)
    - [addColumn (x, z, chunk)](#addcolumn-x-z-chunk)
    - [removeColumn (x, z)](#removecolumn-x-z)
    - [setBlockStateId (pos, stateId)](#setblockstateid-pos-stateid)
    - [updateEntity (e)](#updateentity-e)
    - [updatePrimitive (p)](#updateprimitive-p)
    - [setFirstPersonCamera (pos, yaw, pitch)](#setfirstpersoncamera-pos-yaw-pitch)
    - [listen (emitter)](#listen-emitter)
    - [update ()](#update-)
    - [waitForChunksToRender ()](#waitforchunkstorender-)
  - [WorldView](#worldview)
    - [WorldView(world, viewDistance, position = new Vec3(0, 0, 0), emitter = null)](#worldviewworld-viewdistance-position--new-vec30-0-0-emitter--null)
    - [WorldView.listenToBot(bot)](#worldviewlistentobotbot)
    - [WorldView.removeListenersFromBot(bot)](#worldviewremovelistenersfrombotbot)
    - [WorldView.init(pos)](#worldviewinitpos)
    - [WorldView.loadChunk(pos)](#worldviewloadchunkpos)
    - [WorldView.unloadChunk(pos)](#worldviewunloadchunkpos)
    - [WorldView.updatePosition(pos)](#worldviewupdatepositionpos)
  - [MapControls](#mapcontrols)
    - [.controlMap](#controlmap)
    - [setRotationOrigin(pos: THREE.Vector3)](#setrotationoriginpos-threevector3)
    - [.verticalTranslationSpeed](#verticaltranslationspeed)
    - [.enableTouchZoom, .enableTouchRotate, .enableTouchPan](#enabletouchzoom-enabletouchrotate-enabletouchpan)
    - [.registerHandlers(), .unregisterHandlers()](#registerhandlers-unregisterhandlers)
- [MineFlayer Pathfinder API](#mineflayer-pathfinder-api-1)
  - [Installation](#installation)
  - [Tutorial \& Explanation](#tutorial--explanation)
  - [Video Tutorials](#video-tutorials)
  - [Example](#example)
  - [Features](#features)
  - [API](#api-1)
    - [bot.pathfinder.goto(goal)](#botpathfindergotogoal)
    - [bot.pathfinder.bestHarvestTool(block)](#botpathfinderbestharvesttoolblock)
    - [bot.pathfinder.getPathTo(movements, goal, timeout)](#botpathfindergetpathtomovements-goal-timeout)
    - [bot.pathfinder.getPathFromTo\* (movements, startPos, goal, options = {})](#botpathfindergetpathfromto-movements-startpos-goal-options--)
    - [bot.pathfinder.setGoal(Goal, dynamic)](#botpathfindersetgoalgoal-dynamic)
    - [bot.pathfinder.setMovements(movements)](#botpathfindersetmovementsmovements)
    - [bot.pathfinder.stop()](#botpathfinderstop)
    - [bot.pathfinder.isMoving()](#botpathfinderismoving)
    - [bot.pathfinder.isMining()](#botpathfinderismining)
    - [bot.pathfinder.isBuilding()](#botpathfinderisbuilding)
  - [Properties](#properties-1)
    - [bot.pathfinder.thinkTimeout](#botpathfinderthinktimeout)
    - [bot.pathfinder.tickTimeout](#botpathfinderticktimeout)
    - [bot.pathfinder.searchRadius](#botpathfindersearchradius)
  - [Movement class](#movement-class)
  - [Usage](#usage)
    - [Example:](#example-1)
  - [Movements class default properties](#movements-class-default-properties)
    - [canDig](#candig)
    - [digCost](#digcost)
    - [placeCost](#placecost)
    - [maxDropDown](#maxdropdown)
    - [infiniteLiquidDropdownDistance](#infiniteliquiddropdowndistance)
    - [liquidCost](#liquidcost)
    - [entityCost](#entitycost)
    - [dontCreateFlow](#dontcreateflow)
    - [dontMineUnderFallingBlock](#dontmineunderfallingblock)
    - [allow1by1towers](#allow1by1towers)
    - [allowFreeMotion](#allowfreemotion)
    - [allowParkour](#allowparkour)
    - [allowSprinting](#allowsprinting)
    - [allowEntityDetection](#allowentitydetection)
    - [entitiesToAvoid](#entitiestoavoid)
    - [passableEntities](#passableentities)
    - [interactableBlocks](#interactableblocks)
    - [blocksCantBreak](#blockscantbreak)
    - [blocksToAvoid](#blockstoavoid)
    - [liquids](#liquids)
    - [climbables](#climbables)
    - [replaceables](#replaceables)
    - [scafoldingBlocks](#scafoldingblocks)
    - [gravityBlocks](#gravityblocks)
    - [fences](#fences)
    - [carpets](#carpets)
    - [exclusionAreasStep](#exclusionareasstep)
    - [exclusionAreasBreak](#exclusionareasbreak)
    - [exclusionAreasPlace](#exclusionareasplace)
    - [entityIntersections](#entityintersections)
    - [canOpenDoors](#canopendoors)
  - [Events:](#events-1)
    - [goal\_reached](#goal_reached)
    - [path\_update](#path_update)
    - [goal\_updated](#goal_updated)
    - [path\_reset](#path_reset)
    - [path\_stop](#path_stop)
  - [Goals:](#goals)
    - [Goal](#goal)
    - [GoalBlock(x, y, z)](#goalblockx-y-z)
    - [GoalNear(x, y, z, range)](#goalnearx-y-z-range)
    - [GoalXZ(x, z)](#goalxzx-z)
    - [GoalNearXZ(x, z, range)](#goalnearxzx-z-range)
    - [GoalY(y)](#goalyy)
    - [GoalGetToBlock(x, y, z)](#goalgettoblockx-y-z)
    - [GoalCompositeAny(Array\<Goal\>?)](#goalcompositeanyarraygoal)
    - [GoalCompositeAll(Array\<Goal\>?)](#goalcompositeallarraygoal)
    - [GoalInvert(goal)](#goalinvertgoal)
    - [GoalFollow(entity, range)](#goalfollowentity-range)
    - [GoalPlaceBlock(pos, world, options)](#goalplaceblockpos-world-options)
    - [GoalLookAtBlock(pos, world, options = {})](#goallookatblockpos-world-options--)
    - [GoalBreakBlock(x, y, z, bot, options)](#goalbreakblockx-y-z-bot-options)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# API

## Enums

These enums are stored in the language independent [minecraft-data](https://github.com/PrismarineJS/minecraft-data) project,
 and accessed through [node-minecraft-data](https://github.com/PrismarineJS/node-minecraft-data).

### minecraft-data
The data is available in [node-minecraft-data](https://github.com/PrismarineJS/node-minecraft-data) module

`require('minecraft-data')(bot.version)` gives you access to it.

### mcdata.blocks
blocks indexed by id

### mcdata.items
items indexed by id

### mcdata.materials

The key is the material. The value is an object with the key as the item id
of the tool and the value as the efficiency multiplier.

### mcdata.recipes
recipes indexed by id

### mcdata.instruments
instruments indexed by id

### mcdata.biomes
biomes indexed by id

### mcdata.entities
entities indexed by id

## Classes

### vec3

See [andrewrk/node-vec3](https://github.com/andrewrk/node-vec3)

All points in mineflayer are supplied as instances of this class.

 * x - south
 * y - up
 * z - west

Functions and methods which require a point argument accept `Vec3` instances
as well as an array with 3 values, and an object with `x`, `y`, and `z`
properties.

### mineflayer.Location

### Entity

Entities represent players, mobs, and objects. They are emitted
in many events, and you can access your own entity with `bot.entity`.
See [prismarine-entity](https://github.com/PrismarineJS/prismarine-entity)

#### Player Skin Data

The skin data is stored in the `skinData` property of the player object, if present.

```js
// player.skinData
{
  url: 'http://textures.minecraft.net/texture/...',
  model: 'slim' // or 'classic'
}
```

### Block

See [prismarine-block](https://github.com/PrismarineJS/prismarine-block)

Also `block.blockEntity` is additional field with block entity data as `Object`. The data in this varies between versions.
```js
// sign.blockEntity example from 1.19
{
  GlowingText: 0, // 0 for false, 1 for true
  Color: 'black',
  Text1: '{"text":"1"}',
  Text2: '{"text":"2"}',
  Text3: '{"text":"3"}',
  Text4: '{"text":"4"}'
}
```

Note if you want to get a sign's plain text, you can use [`block.getSignText()`](https://github.com/PrismarineJS/prismarine-block/blob/master/doc/API.md#sign) instead of unstable blockEntity data.
```java
> block = bot.blockAt(new Vec3(0, 60, 0)) // assuming a sign is here
> block.getSignText()
[ "Front text\nHello world", "Back text\nHello world" ]
```

### Biome

See [prismarine-biome](https://github.com/PrismarineJS/prismarine-biome)

### Item

See [prismarine-item](https://github.com/PrismarineJS/prismarine-item)

### windows.Window (base class)

See [prismarine-windows](https://github.com/PrismarineJS/prismarine-windows)

#### window.deposit(itemType, metadata, count, nbt)

This function returns a `Promise`, with `void` as its argument when done depositing.

 * `itemType` - numerical item id
 * `metadata` - numerical value. `null` means match anything.
 * `count` - how many to deposit. `null` is an alias to 1.
 * `nbt` - match nbt data. `null` is do not match nbt.

#### window.withdraw(itemType, metadata, count, nbt)

This function returns a `Promise`, with `void` as its argument when done withdrawing. Throws and error if the bot has no free room in its inventory.

 * `itemType` - numerical item id
 * `metadata` - numerical value. `null` means match anything.
 * `count` - how many to withdraw. `null` is an alias to 1.
 * `nbt` - match nbt data. `null` is do not match nbt.

#### window.close()

### Recipe

See [prismarine-recipe](https://github.com/PrismarineJS/prismarine-recipe)

### mineflayer.Container

Extends windows.Window for chests, dispensers, etc...
See `bot.openContainer(chestBlock or minecartchestEntity)`.

### mineflayer.Furnace

Extends windows.Window for furnace, smelter, etc...
See `bot.openFurnace(furnaceBlock)`.

#### furnace "update"

Fires when `furnace.fuel` and/or `furnace.progress` update.

#### furnace.takeInput()

This function returns a `Promise`, with `item` as its argument upon completion.


#### furnace.takeFuel()

This function returns a `Promise`, with `item` as its argument upon completion.


#### furnace.takeOutput()

This function returns a `Promise`, with `item` as its argument upon completion.


#### furnace.putInput(itemType, metadata, count)

This function returns a `Promise`, with `void` as its argument upon completion.

#### furnace.putFuel(itemType, metadata, count)

This function returns a `Promise`, with `void` as its argument upon completion.

#### furnace.inputItem()

Returns `Item` instance which is the input.

#### furnace.fuelItem()

Returns `Item` instance which is the fuel.

#### furnace.outputItem()

Returns `Item` instance which is the output.

#### furnace.fuel

How much fuel is left between 0 and 1.

#### furnace.progress

How much cooked the input is between 0 and 1.

### mineflayer.EnchantmentTable

Extends windows.Window for enchantment tables
See `bot.openEnchantmentTable(enchantmentTableBlock)`.

#### enchantmentTable "ready"

Fires when `enchantmentTable.enchantments` is fully populated and you
may make a selection by calling `enchantmentTable.enchant(choice)`.

#### enchantmentTable.targetItem()

Gets the target item. This is both the input and the output of the
enchantment table.

#### enchantmentTable.xpseed

The 16 bits xpseed sent by the server.

#### enchantmentTable.enchantments

Array of length 3 which are the 3 enchantments to choose from.
`level` can be `-1` if the server has not sent the data yet.

Looks like:

```js
[
  {
    level: 3
  },
  {
    level: 4
  },
  {
    level: 9
  }
]
```

#### enchantmentTable.enchant(choice)

This function returns a `Promise`, with `item` as its argument when the item has been enchanted.

 * `choice` - [0-2], the index of the enchantment you want to pick.

#### enchantmentTable.takeTargetItem()

This function returns a `Promise`, with `item` as its argument upon completion.


#### enchantmentTable.putTargetItem(item)

This function returns a `Promise`, with `void` as its argument upon completion.


#### enchantmentTable.putLapis(item)

This function returns a `Promise`, with `void` as its argument upon completion.


### mineflayer.anvil

Extends windows.Window for anvils
See `bot.openAnvil(anvilBlock)`.

#### anvil.combine(itemOne, itemTwo[, name])

This function returns a `Promise`, with `void` as its argument upon completion.


#### anvil.combine(item[, name])

This function returns a `Promise`, with `void` as its argument upon completion.


#### villager "ready"

Fires when `villager.trades` is loaded.

#### villager.trades

Array of trades.

Looks like:

```js
[
  {
    firstInput: Item,
    output: Item,
    hasSecondItem: false,
    secondaryInput: null,
    disabled: false,
    tooluses: 0,
    maxTradeuses: 7
  },
  {
    firstInput: Item,
    output: Item,
    hasSecondItem: false,
    secondaryInput: null,
    disabled: false,
    tooluses: 0,
    maxTradeuses: 7
  },
  {
    firstInput: Item,
    output: Item,
    hasSecondItem: true,
    secondaryInput: Item,
    disabled: false,
    tooluses: 0,
    maxTradeuses: 7
  }
]
```

#### villager.trade(tradeIndex, [times])
Is the same as [bot.trade(villagerInstance, tradeIndex, [times])](#bottradevillagerinstance-tradeindex-times)

### mineflayer.ScoreBoard

#### ScoreBoard.name

Name of the scoreboard.

#### ScoreBoard.title

The title of the scoreboard (does not always equal the name)

#### ScoreBoard.itemsMap

An object with all items in the scoreboard in it
```js
{
  wvffle: { name: 'wvffle', value: 3 },
  dzikoysk: { name: 'dzikoysk', value: 6 }
}
```

#### ScoreBoard.items

An array with all sorted items in the scoreboard in it
```js
[
  { name: 'dzikoysk', value: 6 },
  { name: 'wvffle', value: 3 }
]
```

### mineflayer.Team

#### Team.name

Name of the team

#### Team.friendlyFire

#### Team.nameTagVisibility

One of `always`, `hideForOtherTeams`, `hideForOwnTeam`

#### Team.collisionRule

One of `always`, `pushOtherTeams`, `pushOwnTeam`

#### Team.color

Color (or formatting) name of team, e.g. `dark_green`, `red`, `underlined`

#### Team.prefix

A chat component containing team prefix

#### Team.suffix

A chat component containing team suffix

#### Team.members

Array of team members. Usernames for players and UUIDs for other entities.

### mineflayer.BossBar

#### BossBar.title

Title of boss bar, instance of ChatMessage

#### BossBar.health

Percent of boss health, from `0` to `1`

#### BossBar.dividers

Number of boss bar dividers, one of `0`, `6`, `10`, `12`, `20`

#### BossBar.entityUUID

Boss bar entity uuid

#### BossBar.shouldDarkenSky

Determines whether or not to darken the sky

#### BossBar.isDragonBar

Determines whether or not boss bar is dragon bar

#### BossBar.createFog

Determines whether or not boss bar creates fog

#### BossBar.color

Determines what color the boss bar color is, one of `pink`, `blue`, `red`, `green`, `yellow`, `purple`, `white`

### mineflayer.Particle

#### Particle.id

Particle ID, as defined in the [protocol](https://minecraft.wiki/w/Protocol#Particle)

#### Particle.name

Particle Name, as defined in the [protocol](https://minecraft.wiki/w/Protocol#Particle)

#### Particle.position

Vec3 instance of where the particle was created

#### Particle.offset

Vec3 instance of the particle's offset

#### Particle.longDistanceRender

Determines whether or not to force the rendering of a particle despite client particle settings and increases maximum view distance from 256 to 65536

#### Particle.count

Amount of particles created

#### Particle.movementSpeed

Particle speed in a random direction

## Bot

### mineflayer.createBot(options)

Create and return an instance of the class bot.
`options` is an object containing the optional properties :
 * username : default to 'Player'
 * port : default to 25565
 * password : can be omitted (if the tokens are also omitted then it tries to connect in offline mode)
 * host : default to localhost
 * version : default to automatically guessing the version of the server. Example of value : "1.12.2"
 * auth : default to 'mojang', can also be 'microsoft'
 * clientToken : generated if a password is given
 * accessToken : generated if a password is given
 * logErrors : true by default, catch errors and log them
 * hideErrors : true by default, do not log errors (even if logErrors is true)
 * keepAlive : send keep alive packets : default to true
 * checkTimeoutInterval : default to `30*1000` (30s), check if keepalive received at that period, disconnect otherwise.
 * loadInternalPlugins : defaults to true
 * storageBuilder : an optional function, takes as argument version and worldName and return an instance of something with the same API as prismarine-provider-anvil. Will be used to save the world.
 * client : an instance of node-minecraft-protocol, if not specified, mineflayer makes its own client. This can be used to enable using mineflayer through a proxy of many clients or a vanilla client and a mineflayer client.
 * brand : the brand name for the client to use. Defaults to vanilla. Can be used to simulate custom clients for servers that require it.
 * respawn : when set to false disables bot from automatically respawning, defaults to true.
 * plugins : object : defaults to {}
   - pluginName : false : don't load internal plugin with given name ie. `pluginName`
   - pluginName : true : load internal plugin with given name ie. `pluginName` even though loadInternalplugins is set to false
   - pluginName : external plugin inject function : loads external plugin, overrides internal plugin with given name ie. `pluginName`
 * physicsEnabled : true by default, should the bot be affected by physics? can later be modified via bot.physicsEnabled
 * [chat](#bot.settings.chat)
 * [colorsEnabled](#bot.settings.colorsEnabled)
 * [viewDistance](#bot.settings.viewDistance)
 * [difficulty](#bot.settings.difficulty)
 * [skinParts](#bot.settings.skinParts)
 * [enableTextFiltering](#bot.settings.enableTextFiltering)
 * [enableServerListing](#bot.settings.enableServerListing)
 * chatLengthLimit : the maximum amount of characters that can be sent in a single message. If this is not set, it will be 100 in < 1.11 and 256 in >= 1.11.
 * defaultChatPatterns: defaults to true, set to false to not add the patterns such as chat and whisper

### Properties

#### bot.registry

Instance of minecraft-data used by the bot. Pass this to constructors that expect an instance of minecraft-data, such as prismarine-block.

#### bot.world

A sync representation of the world. Check the doc at http://github.com/PrismarineJS/prismarine-world

##### world "blockUpdate" (oldBlock, newBlock)

Fires when a block updates. Both `oldBlock` and `newBlock` provided for
comparison.
`oldBlock` may be `null` with normal block updates.

##### world "blockUpdate:(x, y, z)" (oldBlock, newBlock)

Fires for a specific point. Both `oldBlock` and `newBlock` provided for
comparison. All listeners receive null for `oldBlock` and `newBlock` and get automatically removed when the world is unloaded.
`oldBlock` may be `null` with normal block updates.


#### bot.entity

Your own entity. See `Entity`.

#### bot.entities

All nearby entities. This object is a map of entityId to entity.

#### bot.username

Use this to find out your own name.

#### bot.spawnPoint

Coordinates to the main spawn point, where all compasses point to.

#### bot.heldItem

The item in the bot's hand, represented as a [prismarine-item](https://github.com/PrismarineJS/prismarine-item) instance specified with arbitrary metadata, nbtdata, etc.

#### bot.usingHeldItem

Whether the bot is using the item that it's holding, for example eating food or using a shield.

#### bot.game.levelType

#### bot.game.dimension

The bot's current dimension, such as `overworld`, `the_end` or `the_nether`.

#### bot.game.difficulty

#### bot.game.gameMode

#### bot.game.hardcore

#### bot.game.maxPlayers

#### bot.game.serverBrand

#### bot.game.minY

minimum y of the world

#### bot.game.height

world height

#### bot.physicsEnabled

Enable physics, default true.

#### bot.player

Bot's player object
```js
{
  username: 'player',
  displayName: { toString: Function }, // ChatMessage object.
  gamemode: 0,
  ping: 28,
  entity: entity // null if you are too far away
}
```

A player's ping starts at 0, you might have to wait a bit for the server to send their actual ping.

#### bot.players

Map of username to people playing the game.

#### bot.tablist

bot's tablist object has two keys, `header` and `footer`.

```js
{
  header: { toString: Function }, // ChatMessage object.
  footer: { toString: Function } // ChatMessage object.
}
```

#### bot.isRaining

#### bot.rainState

A number indicating the current rain level. When it isn't raining, this
will be equal to 0. When it starts to rain, this value will increase
gradually up to 1. When it stops raining, this value gradually decreases back to 0.

Each time `bot.rainState` is changed, the "weatherUpdate" event is emitted.

#### bot.thunderState

A number indicating the current thunder level. When there isn't a thunderstorm, this
will be equal to 0. When a thunderstorm starts, this value will increase
gradually up to 1. When the thunderstorm stops, this value gradually decreases back to 0.

Each time `bot.thunderState` is changed, the "weatherUpdate" event is emitted.

This is the same as `bot.rainState`, but for thunderstorms.
For thunderstorms, both `bot.rainState` and `bot.thunderState` will change.

#### bot.chatPatterns

This is an array of pattern objects, of the following format:
{ /regex/, "chattype", "description")
 * /regex/ - a regular expression pattern, that should have at least two capture groups
 * 'chattype' - the type of chat the pattern matches, ex "chat" or "whisper", but can be anything.
 * 'description' - description of what the pattern is for, optional.

#### bot.settings.chat

Choices:

 * `enabled` (default)
 * `commandsOnly`
 * `disabled`

#### bot.settings.colorsEnabled

Default true, whether or not you receive color codes in chats from the server.

#### bot.settings.viewDistance

Can be a string listed below or a positive number.
Choices:
 * `far` (default)
 * `normal`
 * `short`
 * `tiny`

#### bot.settings.difficulty

Same as from server.properties.

#### bot.settings.skinParts

These boolean Settings control if extra Skin Details on the own players' skin should be visible

##### bot.settings.skinParts.showCape - boolean

If you have a cape you can turn it off by setting this to false.

##### bot.settings.skinParts.showJacket - boolean

##### bot.settings.skinParts.showLeftSleeve - boolean

##### bot.settings.skinParts.showRightSleeve - boolean

##### bot.settings.skinParts.showLeftPants - boolean

##### bot.settings.skinParts.showRightPants - boolean

##### bot.settings.skinParts.showHat - boolean

#### bot.settings.enableTextFiltering - boolean
Unused, defaults to false in Notchian (Vanilla) client.
#### bot.settings.enableServerListing - boolean
This setting is sent to the server to determine whether the player should show up in server listings
#### bot.experience.level

#### bot.experience.points

Total experience points.

#### bot.experience.progress

Between 0 and 1 - amount to get to the next level.

#### bot.health

Number in the range [0, 20] representing the number of half-hearts.

#### bot.food

Number in the range [0, 20] representing the number of half-turkey-legs.

#### bot.foodSaturation

Food saturation acts as a food "overcharge". Food values will not decrease
while the saturation is over zero. Players logging in automatically get a
saturation of 5.0. Eating food increases the saturation as well as the food bar.

#### bot.oxygenLevel

Number in the range [0, 20] representing the number of water-icons known as oxygen level.

#### bot.physics

Edit these numbers to tweak gravity, jump speed, terminal velocity, etc.
Do this at your own risk.

#### bot.fireworkRocketDuration

How many physics ticks worth of firework rocket boost are left.

#### bot.simpleClick.leftMouse (slot)

abstraction over `bot.clickWindow(slot, 0, 0)`

#### bot.simpleClick.rightMouse (slot)

abstraction over `bot.clickWindow(slot, 1, 0)`

#### bot.time.doDaylightCycle

Whether or not the gamerule doDaylightCycle is true or false.

#### bot.time.bigTime

The total number of ticks since day 0.

This value is of type BigInt and is accurate even at very large values. (more than 2^51 - 1 ticks)

#### bot.time.time

The total numbers of ticks since day 0.

Because the Number limit of Javascript is at 2^51 - 1 bot.time.time becomes inaccurate higher than this limit and the use of bot.time.bigTime is recommended.
Realistically though you'll probably never need to use bot.time.bigTime as it will only reach 2^51 - 1 ticks naturally after ~14280821 real years.

#### bot.time.timeOfDay

Time of the day, in ticks.

Time is based on ticks, where 20 ticks happen every second. There are 24000
ticks in a day, making Minecraft days exactly 20 minutes long.

The time of day is based on the timestamp modulo 24000. 0 is sunrise, 6000
is noon, 12000 is sunset, and 18000 is midnight.

#### bot.time.day

Day of the world.

#### bot.time.isDay

Whether it is day or not.

Based on whether the current time of day is between 0 and 13000 ticks (day + sunset).

#### bot.time.moonPhase

Phase of the moon.

0-7 where 0 is full moon.

#### bot.time.bigAge

Age of the world, in ticks.

This value is of type BigInt and is accurate even at very large values. (more than 2^51 - 1 ticks)

#### bot.time.age

Age of the world, in ticks.

Because the Number limit of Javascript is at 2^51 - 1 bot.time.age becomes inaccurate higher than this limit and the use of bot.time.bigAge is recommended.
Realistically though you'll probably never need to use bot.time.bigAge as it will only reach 2^51 - 1 ticks naturally after ~14280821 real years.

#### bot.quickBarSlot

Which quick bar slot is selected (0 - 8).

#### bot.inventory

A [`Window`](https://github.com/PrismarineJS/prismarine-windows#windowswindow-base-class) instance representing your inventory.

#### bot.targetDigBlock

The `block` that you are currently digging, or `null`.

#### bot.isSleeping

Boolean, whether or not you are in bed.

#### bot.scoreboards

All scoreboards known to the bot in an object scoreboard name -> scoreboard.

#### bot.scoreboard

All scoreboards known to the bot in an object scoreboard displaySlot -> scoreboard.

 * `belowName` - scoreboard placed in belowName
 * `sidebar` - scoreboard placed in sidebar
 * `list` - scoreboard placed in list
 * `0-18` - slots defined in [protocol](https://minecraft.wiki/w/Protocol#Display_Scoreboard)

#### bot.teams

All teams known to the bot

#### bot.teamMap

Mapping of member to team. Uses usernames for players and UUIDs for entities.

#### bot.controlState

An object whose keys are the main control states: ['forward', 'back', 'left', 'right', 'jump', 'sprint', 'sneak'].

Setting values for this object internally calls [bot.setControlState](#botsetcontrolstatecontrol-state).

### Events

#### "chat" (username, message, translate, jsonMsg, matches)

Only emitted when a player chats publicly.

 * `username` - who said the message (compare with `bot.username` to ignore your own chat)
 * `message` - stripped of all color and control characters
 * `translate` - chat message type. Null for most bukkit chat messages
 * `jsonMsg` - unmodified JSON message from the server
 * `matches` - array of returned matches from regular expressions. May be null

#### "whisper" (username, message, translate, jsonMsg, matches)

Only emitted when a player chats to you privately.

 * `username` - who said the message
 * `message` - stripped of all color and control characters
 * `translate` - chat message type. Null for most bukkit chat messages
 * `jsonMsg` - unmodified JSON message from the server
 * `matches` - array of returned matches from regular expressions. May be null

#### "actionBar" (jsonMsg, verified)

Emitted for every server message which appears on the Action Bar.

 * `jsonMsg` - unmodified JSON message from the server
 * `verified` -> null if non signed, true if signed and correct, false if signed and incorrect

#### "message" (jsonMsg, position, sender, verified)

Emitted for every server message, including chats.

 * `jsonMsg` - [ChatMessage](https://github.com/PrismarineJS/prismarine-chat) object containing the formatted chat message. Might additionally have the following properties:
   * unsigned - Unsigned ChatMessage object. Only present in 1.19.2+, and only when the server allows insecure chat and the server modified the chat message without the user's signature

 * `position` - (>= 1.8.1): position of Chat message can be
   * chat
   * system
   * game_info

 * `sender` - UUID of sender if known (1.16+), else null

 * `verified` -> null if non signed, true if signed and correct, false if signed and incorrect

#### "messagestr" (message, messagePosition, jsonMsg, sender, verified)

Alias for the "message" event but it calls .toString() on the prismarine-message object to get a string for the message before emitting.

 * `sender` - UUID of sender if known (1.16+), else null

 * `verified` -> null if non signed, true if signed and correct, false if signed and incorrect

#### "inject_allowed"
Fires when the index file has been loaded, you can load mcData and plugins here but it's better to wait for "spawn" event.

#### "login"

Fires after you successfully login to the server.
You probably want to wait for the `spawn` event
before doing anything though.

#### "spawn"

Emitted once after you log in and spawn for the first time
and then emitted when you respawn after death.

This is usually the event that you want to listen to
before doing anything on the server.

#### "respawn"

Emitted when you change dimensions and just before you spawn.
Usually you want to ignore this event and wait until the "spawn"
event instead.

#### "game"

Emitted when the server changes any of the game properties.

#### "resourcePack" (url, hash)

Emitted when the server sends a resource pack.

#### "title" (title, type)

Emitted when the server sends a title

* `title` - title's text
* `type` - title's type "subtitle", "title"

#### "title_times" (fadeIn, stay, fadeOut)

Emitted when the server sends a title times packet (i.e., when the fade-in, stay, and fade-out times for titles are set or updated).

 * `fadeIn` - fade-in time in ticks (number)
 * `stay` - stay time in ticks (number)
 * `fadeOut` - fade-out time in ticks (number)

Example:

```js
bot.on('title_times', (fadeIn, stay, fadeOut) => {
  console.log(`Title times: fadeIn=${fadeIn}, stay=${stay}, fadeOut=${fadeOut}`)
})
```

#### "title_clear"

Emitted when the server clears all titles.

#### "rain"

Emitted when it starts or stops raining. If you join a
server where it is already raining, this event will fire.

#### "weatherUpdate"

Emitted when either `bot.thunderState` or `bot.rainState` changes.
If you join a server where it is already raining, this event will fire.

#### "time"

Emitted when the server sends a time update. See `bot.time`.

#### "kicked" (reason, loggedIn)

Emitted when the bot is kicked from the server. `reason`
is a chat message explaining why you were kicked. `loggedIn`
is `true` if the client was kicked after successfully logging in,
or `false` if the kick occurred in the login phase.

#### "end" (reason)

Emitted when you are no longer connected to the server.
`reason` is a string explaining why the client was disconnected. (defaults to 'socketClosed')

#### "error" (err)

Emitted when an error occurs.

#### "spawnReset"

Fires when you cannot spawn in your bed and your spawn point gets reset.

#### "death"

Fires when you die.

#### "health"

Fires when your hp or food change.

#### "breath"

Fires when your oxygen level change.

#### "entityAttributes" (entity)

Fires when an attribute of an entity changes.

#### "entitySwingArm" (entity)
#### "entityHurt" (entity)
#### "entityDead" (entity)
#### "entityTaming" (entity)
#### "entityTamed" (entity)
#### "entityShakingOffWater" (entity)
#### "entityEatingGrass" (entity)
#### "entityHandSwap" (entity)
#### "entityWake" (entity)
#### "entityEat" (entity)
#### "entityCriticalEffect" (entity)
#### "entityMagicCriticalEffect" (entity)
#### "entityCrouch" (entity)
#### "entityUncrouch" (entity)
#### "entityEquip" (entity)
#### "entitySleep" (entity)
#### "entitySpawn" (entity)
#### "entityElytraFlew" (entity)

An entity started elytra flying.

#### "itemDrop" (entity)
#### "playerCollect" (collector, collected)

An entity picked up an item.

 * `collector` - entity that picked up the item.
 * `collected` - the entity that was the item on the ground.

#### "entityGone" (entity)
#### "entityMoved" (entity)
#### "entityDetach" (entity, vehicle)
#### "entityAttach" (entity, vehicle)

An entity is attached to a vehicle, such as a mine cart
or boat.

 * `entity` - the entity hitching a ride
 * `vehicle` - the entity that is the vehicle

#### "entityUpdate" (entity)
#### "entityEffect" (entity, effect)
#### "entityEffectEnd" (entity, effect)
#### "playerJoined" (player)
#### "playerUpdated" (player)
#### "playerLeft" (player)

#### "blockUpdate" (oldBlock, newBlock)

(It is better to use this event from bot.world instead of bot directly) Fires when a block updates. Both `oldBlock` and `newBlock` provided for
comparison.

Note that `oldBlock` may be `null`.

#### "blockUpdate:(x, y, z)" (oldBlock, newBlock)

(It is better to use this event from bot.world instead of bot directly) Fires for a specific point. Both `oldBlock` and `newBlock` provided for
comparison.

Note that `oldBlock` may be `null`.

#### "blockPlaced" (oldBlock, newBlock)

Fires when bot places block. Both `oldBlock` and `newBlock` provided for
comparison.

Note that `oldBlock` may be `null`.

#### "chunkColumnLoad" (point)
#### "chunkColumnUnload" (point)

Fires when a chunk has updated. `point` is the coordinates to the corner
of the chunk with the smallest x, y, and z values.

#### "soundEffectHeard" (soundName, position, volume, pitch)

Fires when the client hears a named sound effect.

 * `soundName`: name of the sound effect
 * `position`: a Vec3 instance where the sound originates
 * `volume`: floating point volume, 1.0 is 100%
 * `pitch`: integer pitch, 63 is 100%

#### "hardcodedSoundEffectHeard" (soundId, soundCategory, position, volume, pitch)

  Fires when the client hears a hardcoded sound effect.

   * `soundId`: id of the sound effect
   * `soundCategory`: category of the sound effect
   * `position`: a Vec3 instance where the sound originates
   * `volume`: floating point volume, 1.0 is 100%
   * `pitch`: integer pitch, 63 is 100%

#### "noteHeard" (block, instrument, pitch)

Fires when a note block goes off somewhere.

 * `block`: a Block instance, the block that emitted the noise
 * `instrument`:
   - `id`: integer id
   - `name`: one of [`harp`, `doubleBass`, `snareDrum`, `sticks`, `bassDrum`].
 * `pitch`: The pitch of the note (between 0-24 inclusive where 0 is the
   lowest and 24 is the highest). More information about how the pitch values
   correspond to notes in real life are available on the
   [official Minecraft wiki](http://minecraft.wiki/w/Note_Block).

#### "pistonMove" (block, isPulling, direction)

#### "chestLidMove" (block, isOpen, block2)
* `block`: a Block instance, the block whose lid opened. The right block if it's a double chest
* `isOpen`: number of players that have the chest open. 0 if it's closed
* `block2`: a Block instance, the other half of the block whose lid opened. null if it's not a double chest

#### "blockBreakProgressObserved" (block, destroyStage, entity)

Fires when the client observes a block in the process of being broken.

 * `block`: a Block instance, the block being broken
 * `destroyStage`: integer corresponding to the destroy progress (0-9)
 * `entity`: the entity which is breaking the block.

#### "blockBreakProgressEnd" (block, entity)

Fires when the client observes a block stops being broken.
This occurs whether the process was completed or aborted.

 * `block`: a Block instance, the block no longer being broken
 * `entity`: the entity which has stopped breaking the block

#### "diggingCompleted" (block)

 * `block` - the block that no longer exists

#### "diggingAborted" (block)

 * `block` - the block that still exists

#### "usedFirework" (fireworkEntityId)

Fires when the bot uses a firework while elytra flying.

 * `fireworkEntityId` - the entity id of the firework.

#### "move"

Fires when the bot moves. If you want the current position, use
`bot.entity.position` and for normal moves if you want the previous position, use
`bot.entity.position.minus(bot.entity.velocity)`.

#### "forcedMove"

Fires when the bot is force moved by the server (teleport, spawning, ...). If you want the current position, use
`bot.entity.position`.

#### "mount"

Fires when you mount an entity such as a minecart. To get access
to the entity, use `bot.vehicle`.

To mount an entity, use `mount`.

#### "dismount" (vehicle)

Fires when you dismount from an entity.

#### "windowOpen" (window)

Fires when you begin using a workbench, chest, brewing stand, etc.

#### "windowClose" (window)

Fires when you may no longer work with a workbench, chest, etc.

#### "sleep"

Fires when you sleep.

#### "wake"

Fires when you wake up.

#### "experience"

Fires when `bot.experience.*` has updated.

#### "scoreboardCreated" (scoreboard)

Fires when a scoreboard is added.

#### "scoreboardDeleted" (scoreboard)

Fires when a scoreboard is deleted.

#### "scoreboardTitleChanged" (scoreboard)

Fires when a scoreboard's title is updated.

#### "scoreUpdated" (scoreboard, item)

Fires when the score of a item in a scoreboard is updated.

#### "scoreRemoved" (scoreboard, item)

Fires when the score of a item in a scoreboard is removed.

#### "scoreboardPosition" (position, scoreboard)

Fires when the position of a scoreboard is updated.

#### "teamCreated" (team)

Fires when a team is added.

#### "teamRemoved" (team)

Fires when a team is removed.

#### "teamUpdated" (team)

Fires when a team is updated.

#### "teamMemberAdded" (team)

Fires when a team member or multiple members are added to a team.

#### "teamMemberRemoved" (team)

Fires when a team member or multiple members are removed from a team.

#### "bossBarCreated" (bossBar)

Fires when new boss bar is created.

#### "bossBarDeleted" (bossBar)

Fires when new boss bar is deleted.

#### "bossBarUpdated" (bossBar)

Fires when new boss bar is updated.

#### "heldItemChanged" (heldItem)

Fires when the held item is changed.

#### "physicsTick" ()

Fires every tick if bot.physicsEnabled is set to true.

#### "chat:name" (matches)

Fires when the all of a chat pattern's regexs have matches to a message

#### "particle"

Fires when a particle is created

### Functions

#### bot.blockAt(point, extraInfos=true)

Returns the block at `point` or `null` if that point is not loaded. If `extraInfos` set to true, also returns information about signs, paintings and block entities (slower).
See `Block`.

#### bot.waitForChunksToLoad()

This function returns a `Promise`, with `void` as its argument when many chunks have loaded.

#### bot.blockInSight(maxSteps, vectorLength)

Deprecated, use `blockAtCursor` instead.

Returns the block at which bot is looking at or `null`
 * `maxSteps` - Number of steps to raytrace, defaults to 256.
 * `vectorLength` - Length of raytracing vector, defaults to `5/16`.

#### bot.blockAtCursor(maxDistance=256)

Returns the block at which bot is looking at or `null`
 * `maxDistance` - The maximum distance the block can be from the eye, defaults to 256.

#### bot.entityAtCursor(maxDistance=3.5)

Returns the entity at which bot is looking at or `null`
 * `maxDistance` - The maximum distance the entity can be from the eye, defaults to 3.5.

#### bot.blockAtEntityCursor(entity=bot.entity, maxDistance=256)

Returns the block at which specific entity is looking at or `null`
 * `entity` - Entity data as `Object`
 * `maxDistance` - The maximum distance the block can be from the eye, defaults to 256.

#### bot.canSeeBlock(block)

Returns true or false depending on whether the bot can see the specified `block`.

#### bot.findBlocks(options)

Finds the closest blocks from the given point.
 * `options` - Options for the search:
   - `point` - The start position of the search (center). Default is the bot position.
   - `matching` - A function that returns true if the given block is a match. Also supports this value being a block id or array of block ids.
   - `useExtraInfo` - To preserve backward compatibility can result in two behavior depending on the type
      - **boolean** - Provide your `matching` function more data - noticeably slower approach
      - **function** - Creates two stage matching, if block passes `matching` function it is passed further to `useExtraInfo` with additional info
   - `maxDistance` - The furthest distance for the search, defaults to 16.
   - `count` - Number of blocks to find before returning the search. Default to 1. Can return less if not enough blocks are found exploring the whole area.

Returns an array (possibly empty) with the found block coordinates (not the blocks). The array is sorted (closest first)

#### bot.findBlock(options)

Alias for `bot.blockAt(bot.findBlocks(options)[0])`. Return a single block or `null`.

#### bot.canDigBlock(block)

Returns whether `block` is diggable and within range.

#### bot.recipesFor(itemType, metadata, minResultCount, craftingTable)

Returns a list of `Recipe` instances that you could use to craft `itemType`
with `metadata`.

 * `itemType` - numerical item id of the thing you want to craft
 * `metadata` - the numerical metadata value of the item you want to craft
   `null` matches any metadata.
 * `minResultCount` - based on your current inventory, any recipe from the
   returned list will be able to produce this many items. `null` is an
   alias for `1`.
 * `craftingTable` - a `Block` instance. If `null`, only recipes that can
   be performed in your inventory window will be included in the list.

#### bot.recipesAll(itemType, metadata, craftingTable)

The same as bot.recipesFor except that it does not check whether the bot has enough materials for the recipe.

#### bot.nearestEntity(match = (entity) => { return true })

Return the nearest entity to the bot, matching the function (default to all entities). Return null if no entity is found.

Example:
```js
const cow = bot.nearestEntity(entity => entity.name.toLowerCase() === 'cow') // we use .toLowercase() because in 1.8 cow was capitalized, for newer versions that can be omitted
```

### Methods

#### bot.end(reason)

End the connection with the server.
* `reason` - Optional string that states the reason of the end.

#### bot.quit(reason)

Gracefully disconnect from the server with the given reason (defaults to 'disconnect.quitting').

#### bot.tabComplete(str, [assumeCommand], [sendBlockInSight], [timeout])

This function returns a `Promise`, with `matches` as its argument upon completion.

Requests chat completion from the server.
 * `str` - String to complete.
 * `assumeCommand` - Field sent to server, defaults to false.
 * `sendBlockInSight` - Field sent to server, defaults to true. Set this option to false if you want more performance.
 * `timeout` - Timeout in milliseconds, after which the function will return an empty array, defaults to 5000.

#### bot.chat(message)

Sends a publicly broadcast chat message. Breaks up big messages into multiple chat messages as necessary.

#### bot.whisper(username, message)

Shortcut for "/tell <username>". All split messages will be whispered to username.

#### bot.chatAddPattern(pattern, chatType, description)

Deprecated, use `addChatPattern` instead.

Adds a regex pattern to the bot's chat matching. Useful for bukkit servers where the chat format changes a lot.
 * `pattern` - regular expression to match chat
 * `chatType` - the event the bot emits when the pattern matches. Eg: "chat" or "whisper"
 * 'description ' - Optional, describes what the pattern is for

#### bot.addChatPattern(name, pattern, chatPatternOptions)

** this is an alias of `bot.addChatPatternSet(name, [pattern], chatPatternOptions)`

make an event that is called every time the pattern is matched to a message,
the event will be called `"chat:name"`, with name being the name passed
* `name` - the name used to listen for the event
* `pattern` - regular expression to match to messages received
* `chatPatternOptions` - object
  * `repeat` - defaults to true, whether to listen for this event after the first match
  * `parse` - instead of returning the actual message that was matched, return the capture groups from the regex
  * `deprecated` - (**unstable**) used by bot.chatAddPattern to keep compatibility, likely to be removed

returns a number which can be used with bot.removeChatPattern() to only delete this pattern

- :eyes: cf. [examples/chat_parsing](https://github.com/PrismarineJS/mineflayer/blob/master/examples/chat_parsing.js#L17-L36)

#### bot.addChatPatternSet(name, patterns, chatPatternOptions)

make an event that is called every time all patterns have been matched to messages,
the event will be called `"chat:name"`, with name being the name passed
* `name` - the name used to listen for the event
* `patterns` - array of regular expression to match to messages received
* `chatPatternOptions` - object
  * `repeat` - defaults to true, whether to listen for this event after the first match
  * `parse` - instead of returning the actual message that was matched, return the capture groups from the regex

returns a number which can be used with bot.removeChatPattern() to only delete this patternset

- :eyes: cf. [examples/chat_parsing](https://github.com/PrismarineJS/mineflayer/blob/master/examples/chat_parsing.js#L17-L36)

#### bot.removeChatPattern(name)

removes a chat pattern(s)
* `name` : string or number

if name is a string, all patterns that have that name will be removed
else if name is a number, only that exact pattern will be removed

#### bot.awaitMessage(...args)

promise that is resolved when one of the messages passed as an arg is resolved

Example:

```js
bot.on('chat', function(username, message) {
  if (username === bot.username) return

  const target = bot.players[username] ? bot.players[username].entity : null
  if (message === 'come') {
    if (!target) {
      bot.chat('I don\'t see you !')
      return
    }
    const p = target.position

    bot.pathfinder.setMovements(defaultMove)
    bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1))
  }
})
```

---

# Prismarine Viewer API

## Viewer

The viewer exposes methods to render a world to a three.js renderer.

### Viewer(renderer)

Build the viewer.

* renderer is a [WebGLRenderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) instance

### version

the currently used minecraft version

### setVersion(version)

sets the minecraft version

* version is a string such as "1.16.4"

Returns false and stop there if the version is not supported

### addColumn (x, z, chunk)

Adds a column

* x is a chunk position
* z is a chunk position
* chunk is a prismarine-chunk

### removeColumn (x, z)

Removes a column

* x is a chunk position
* z is a chunk position

### setBlockStateId (pos, stateId)

Set a block at this position

* pos is a Vec3
* stateId is a number

### updateEntity (e)

Updates an entity

* e is a prismarine-entity

### updatePrimitive (p)

Updates a primitive

* p is a Three.js primitive

### setFirstPersonCamera (pos, yaw, pitch)

Sets the first person camera

* pos is a Vec3 (if pos is null, only yaw and pitch will be updated)
* yaw is in degrees
* pitch is in degrees

### listen (emitter)

listen to an emitter and applies its modification
the emitter should emit these events:
* entity(e) ; updates an entity
* primitive(p) ; updates a primitive
* loadChunk({x, z, chunk}) ; add a column
* unloadChunk({x, z}) ; removes a column
* blockUpdate({pos, stateId}) ; update a block
it also listen to these events:
* mouseClick({ origin, direction, button })

### update ()

Update the world. This need to be called in the animate function, just before the render.

### waitForChunksToRender ()

Returns a promise that resolve once all sections marked dirty have been rendered by the worker threads. Can be used to wait for chunks to 'appear'.

## WorldView

WorldView represents the world from a player/camera point of view

### WorldView(world, viewDistance, position = new Vec3(0, 0, 0), emitter = null)

Build a WorldView

* world is a prismarine-world
* viewDistance is the number of considered chunks
* position is the position of the camera
* emitter is the event emitter to connect (could be null to set emitter to itself or a socket)

### WorldView.listenToBot(bot)

listen to events from a mineflayer bot

### WorldView.removeListenersFromBot(bot)

stop listening to the bot event

### WorldView.init(pos)

start emitting chunks from that position

### WorldView.loadChunk(pos)

emit chunks at this position

### WorldView.unloadChunk(pos)

emit unload chunk at this position

### WorldView.updatePosition(pos)

change the camera position, and emit corresponding events

## MapControls

Default third person controls based on three.js OrbitControls. Refer to the [documentation here](https://threejs.org/docs/#examples/en/controls/OrbitControls). Controls are applied on animation loop, so you need to call `controls.update()` in your render loop.

### .controlMap
The keyboard controls to use. You can provide an array for any of the keys that bind to an action. Defaults:

```js
this.controlMap = {
  MOVE_FORWARD: ['KeyW', 'KeyZ'],
  MOVE_BACKWARD: 'KeyS',
  MOVE_LEFT: ['KeyA', 'KeyQ'],
  MOVE_RIGHT: 'KeyD',
  MOVE_DOWN: 'ShiftLeft',
  MOVE_UP: 'Space'
}
```

### setRotationOrigin(pos: THREE.Vector3)
Sets the center point for rotations

### .verticalTranslationSpeed
How much the y axis is offset for each vertical translation (movement up and down). To control panning speed for the x/z axis, adjust [`.keyPanSpeed`](https://threejs.org/docs/#examples/en/controls/OrbitControls.keyPanSpeed)

### .enableTouchZoom, .enableTouchRotate, .enableTouchPan
Booleans to toggle touch interaction

### .registerHandlers(), .unregisterHandlers()
Enables and disables DOM event handling. Useful if you only want to programatically adjust the controls.

---

# MineFlayer Pathfinder API

## Installation

```bash
npm install mineflayer-pathfinder
```

## Tutorial & Explanation

For a basic explanation of how to use mineflayer-pathfinder, you can read [this tutorial](./examples/tutorial/goalsExplained.md).

## Video Tutorials

For a video tutorial explaining the usage of mineflayer-pathfinder, you can watch the following Youtube videos:

[<img src="https://img.youtube.com/vi/UWGSf08wQSc/0.jpg" alt="part 1" width="200">](https://www.youtube.com/watch?v=UWGSf08wQSc)
[<img src="https://img.youtube.com/vi/ssWE0kXDGJE/0.jpg" alt="part 2" width="200">](https://www.youtube.com/watch?v=ssWE0kXDGJE)

## Example

```js
const mineflayer = require('mineflayer')
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear } = require('mineflayer-pathfinder').goals
const bot = mineflayer.createBot({ username: 'Player' })

bot.loadPlugin(pathfinder)

bot.once('spawn', () => {
  const defaultMove = new Movements(bot)

  bot.on('chat', function(username, message) {

    if (username === bot.username) return

    const target = bot.players[username] ? bot.players[username].entity : null
    if (message === 'come') {
      if (!target) {
        bot.chat('I don\'t see you !')
        return
      }
      const p = target.position

      bot.pathfinder.setMovements(defaultMove)
      bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1))
    }
  })
})
```

## Features
 * Optimized and modernized A* pathfinding
 * Complexe goals can be specified (inspired by [baritone goals](https://github.com/cabaletta/baritone/blob/master/FEATURES.md#goals) )
 * Customizable movements generator
 * Each movement can have a different cost
 * Can break/place blocks as part of its deplacement
 * Automatically update path when environment change
 * Long distance paths
 * Can swim
 * Can avoid entities
 * Modular and easily extendable with different behavior

## API

### bot.pathfinder.goto(goal)
Returns a Promise with the path result. Resolves when the goal is reached. Rejects on error.
 * `goal` - Goal instance

### bot.pathfinder.bestHarvestTool(block)
Returns the best harvesting tool in the inventory for the specified block.
 * `Returns` - `Item` instance or `null`
 * `block` - Block instance

### bot.pathfinder.getPathTo(movements, goal, timeout)
 * `Returns` - The path
 * `movements` - Movements instance
 * `goal` - Goal instance
 * `timeout` - number (optional, default `bot.pathfinder.thinkTimeout`)

### bot.pathfinder.getPathFromTo* (movements, startPos, goal, options = {})
Returns a Generator. The generator computes the path for as longs as no full path is found or `options.timeout` is reached.
The generator will block the event loop until a path is found or `options.tickTimeout` (default to 50ms) is reached.
 * `Returns` - A generator instance. See [MDN function*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*).
 * `movements` - Movements instance
 * `startPos` - A Vec3 instance. The starting position to base the path search from.
 * `goal` - Goal instance
 * `options` - A optional options object contains:
   * `optimizePath` - Boolean Optional. Optimize path for shortcuts like going to the next node in a strait line instead walking only diagonal or along axis.
   * `resetEntityIntersects` - Boolean Optional. Reset the `entityIntersections` index for `movements`. Default: true
   * `timeout` - Number Optional. Total computation timeout.
   * `tickTimeout` - Number Optional. Maximum amount off time before yielding.
   * `searchRadius` - Number Optional. Max distance to search.
   * `startMove` - instance of Move Optional. A optional starting position as a Move. Replaces `startPos` as the starting position.

### bot.pathfinder.setGoal(Goal, dynamic)
 * `goal` - Goal instance
 * `dynamic` - boolean (optional, default false)

### bot.pathfinder.setMovements(movements)
Assigns the movements config.
 * `movements` - Movements instance

### bot.pathfinder.stop()
Stops pathfinding as soon as the bot has reached the next node in the path (this prevents the bot from stopping mid-air). Emits `path_stop` when called.
Note: to force stop immediately, use `bot.pathfinder.setGoal(null)`

### bot.pathfinder.isMoving()
A function that checks if the bot is currently moving.
 * `Returns` - boolean

### bot.pathfinder.isMining()
A function that checks if the bot is currently mining blocks.
 * `Returns` - boolean

### bot.pathfinder.isBuilding()
A function that checks if the bot is currently placing blocks.
 * `Returns` - boolean

## Properties
### bot.pathfinder.thinkTimeout
Think Timeout in milliseconds.
 * `Default` - `5000`

### bot.pathfinder.tickTimeout
How many milliseconds per tick are allocated to thinking.
 * `Default` - `40`

### bot.pathfinder.searchRadius
The search limiting radius, in blocks, if `-1` the search is not limited by distance.
 * `Default` - `-1`

## Movement class
This class configures how pathfinder plans its paths. It configures things like block breaking or different costs for moves. This class can be extended to add or change how pathfinder calculates its moves.

## Usage
Pathfinder instantiates the default movement class by itself if no instance is specified. If you want to change values you should create a new instance of the Movements class, change it's values and set it as pathfinders new movement class.
### Example:
```js
const { Movements } = require('mineflayer-pathfinder') // Import the Movements class from pathfinder

bot.once('spawn', () => {
  // A new movement instance for specific behavior
  const defaultMove = new Movements(bot)

  defaultMove.allow1by1towers = false // Do not build 1x1 towers when going up
  defaultMove.canDig = false // Disable breaking of blocks when pathing
  defaultMove.scafoldingBlocks.push(bot.registry.itemsByName['netherrack'].id) // Add nether rack to allowed scaffolding items
  bot.pathfinder.setMovements(defaultMove) // Update the movement instance pathfinder uses

  // Do pathfinder things
  // ...
})
```

## Movements class default properties
Movement class properties and their default values.
### canDig
Boolean to allow breaking blocks.
* Default `true`

### digCost
Additional cost for breaking blocks.
* Default - `1`

### placeCost
Additional cost for placing blocks.
* Default - `1`

### maxDropDown
Max drop down distance. Only considers drops that have blocks to land on.
* Default - `4`

### infiniteLiquidDropdownDistance
Option to ignore maxDropDown distance when the landing position is in water.
* Default - `true`

### liquidCost
Additional cost for interacting with liquids.
* Default - `1`

### entityCost
Additional cost for moving through an entity hitbox (besides passable ones).
* Default - `1`

### dontCreateFlow
Do not break blocks that touch liquid blocks.
* Default - `true`

### dontMineUnderFallingBlock
Do not break blocks that have a gravityBlock above.
* Default - `true`

### allow1by1towers
Allow pillaring up on 1x1 towers.
* Default - `true`

### allowFreeMotion
Allow to walk to the next node/goal in a straight line if terrain allows it.
* Default - `false`

### allowParkour
Allow parkour jumps like jumps over gaps bigger then 1 block.
* Default - `true`

### allowSprinting
Allow sprinting when moving.
* Default - `true`

### allowEntityDetection
Test for entities that may obstruct path or prevent block placement. Grabs updated entities every new path.
* Default - `true`

### entitiesToAvoid
Set of entities (by bot.registry name) to completely avoid when using entity detection.
* instance of `Set`

### passableEntities
Set of entities (by bot.registry name) to ignore when using entity detection.
* instance of `Set`
* Default - See lib/passableEntities.json

### interactableBlocks
Set of blocks (by bot.registry name) that pathfinder should not attempt to place blocks or 'right click' on.
* instance of `Set`
* Default - See lib/interactable.json

### blocksCantBreak
Set of block id's pathfinder cannot break. Includes chests and all unbreakable blocks.
* instance of `Set`

### blocksToAvoid
Set of block id's to avoid.
* instance of `Set`

### liquids
Set of liquid block id's.
* instance of `Set`

### climbables
Set of block id's that are climable. Note: Currently unused as pathfinder cannot use climables.
* instance of `Set`

### replaceables
Set of block id's that can be replaced when placing blocks.
* instance of `Set`

### scafoldingBlocks
Array of item id's that can be used as scaffolding blocks.
* Default - `[<scaffoldingItems>]`

### gravityBlocks
Set of block id's that can fall on bot's head.
* instance of `Set`

### fences
Set of block id's that are fences or blocks that have a collision box taller then 1 block.
* instance of `Set`

### carpets
Set of all carpet block id's or blocks that have a collision box smaller then 0.1. These blocks are considered safe to walk in.
* instance of `Set`

### exclusionAreasStep
An array of functions that define an area or block to be step on excluded. Every function in the array is parsed the Block the bot is planing to step on. Each function should return a positive number (includes 0) that defines extra cost for that specific Block. 0 means no extra cost, 100 means it is impossible for pathfinder to consider this move.
* Array of functions `(block: Block) => number`

### exclusionAreasBreak
An array of functions that define an area or block to be break excluded. Every function in the array is parsed the Block the bot is planing to break. Each function should return a positive number (includes 0) that defines extra cost for that specific Block. 0 means no extra cost, 100 means it is impossible for pathfinder to consider this move.
* Array of functions `(block: Block) => number`

### exclusionAreasPlace
An array of functions that define an area to be block placement excluded. Every function in the array is parsed the current Block the bot is planing to place a block inside (should be air or a replaceable block most of time). Each function should return a positive number (includes 0) that defines extra cost for that specific Block. 0 means no extra cost, 100 makes it impossible for pathfinder to consider this move.
* Array of functions `(block: Block) => number`

### entityIntersections
A dictionary of the number of entities intersecting each floored block coordinate. Updated automatically for each path, but you may mix in your own entries before calculating a path if desired (generally for testing). To prevent this from being cleared automatically before generating a path,s see the [path gen options](#botpathfindergetpathfromto-movements-startpos-goal-options--).
* Formatted entityIntersections['x,y,z'] = #ents
* Dictionary of costs `{string: number}`

### canOpenDoors
Enable feature to open Fence Gates. Unreliable and known to be buggy.
* Default - `false`

## Events:

### goal_reached
Called when the goal has been reached. Not called for dynamic goals.

### path_update
Called whenever the path is recalculated. Status may be:
 * `success` a path has been found
 * `partial` a partial path has been found, computations will continue next tick
 * `timeout` timed out
 * `noPath` no path was found

### goal_updated
Called whenever a new goal is assigned to the pathfinder.

### path_reset
Called when the path is reset, with a reason:
 * `goal_updated`
 * `movements_updated`
 * `block_updated`
 * `chunk_loaded`
 * `goal_moved`
 * `dig_error`
 * `no_scaffolding_blocks`
 * `place_error`
 * `stuck`

### path_stop
Called when the pathing has been stopped by `bot.pathfinder.stop()`

## Goals:

### Goal
Abstract Goal class. Do not instantiate this class. Instead extend it to make a new Goal class.

Has abstract methods:
 - `heuristic(node)`
   * `node` - A path node
   * Returns a heuristic number value for a given node. Must be admissible – meaning that it never overestimates the actual cost to get to the goal.
 - `isEnd(node)`
   * `node`
   * Returns a boolean value if the given node is a end node.

Implements default methods for:
 - `isValid()`
   * Always returns `true`
 - `hasChanged(node)`
   * `node` - A path node
   * Always returns `false`

### GoalBlock(x, y, z)
One specific block that the player should stand inside at foot level
 * `x` - Integer
 * `y` - Integer
 * `z` - Integer

### GoalNear(x, y, z, range)
A block position that the player should get within a certain radius of
 * `x` - Integer
 * `y` - Integer
 * `z` - Integer
 * `range` - Integer

### GoalXZ(x, z)
Useful for long-range goals that don't have a specific Y level
 * `x` - Integer
 * `z` - Integer

### GoalNearXZ(x, z, range)
Useful for finding builds that you don't have an exact Y level for, just an approximate X and Z level.
 * `x` - Integer
 * `z` - Integer
 * `range` - Integer

### GoalY(y)
Get to a Y level.
 * `y` - Integer

### GoalGetToBlock(x, y, z)
Don't get into the block, but get directly adjacent to it. Useful for chests.
 * `x` - Integer
 * `y` - Integer
 * `z` - Integer

### GoalCompositeAny(Array\<Goal>?)
A composite of many goals, any one of which satisfies the composite.
For example, a GoalCompositeAny of block goals for every oak log in loaded
chunks would result in it pathing to the easiest oak log to get to.
 * `Array` - Array of goals

### GoalCompositeAll(Array\<Goal>?)
A composite of multiple goals, requiring all of them to be satisfied.
 * `Array` - Array of goals

### GoalInvert(goal)
Inverts the goal.
 * `goal` - Goal to invert

### GoalFollow(entity, range)
Follows an entity.
 * `entity` - Entity instance
 * `range` - Integer

### GoalPlaceBlock(pos, world, options)
Position the bot in order to place a block.
 * `pos` - Vec3 the position of the placed block
 * `world` - the world of the bot (Can be accessed with `bot.world`)
 * `options` - object containing all optionals properties:
   * `range` - maximum distance from the clicked face
   * `faces` - the directions of the faces the player can click
   * `facing` - the direction the player must be facing
   * `facing3D` - boolean, facing is 3D (true) or 2D (false)
   * `half` - `top` or `bottom`, the half that must be clicked

### GoalLookAtBlock(pos, world, options = {})
Path into a position were a blockface of block at pos is visible. Fourth argument is optional and contains extra options.
  * `pos` - Vec3 the block position to look at
  * `world` - the world of the bot (Can be accessed with `bot.world`)
  * `options` - object containing all optionals properties:
    * `reach` - number maximum distance from the clicked face. Default `4.5`
    * `entityHeight` - number Default is `1.6`

### GoalBreakBlock(x, y, z, bot, options)
Deprecated. Wrapper for GoalLookAtBlock. Use GoalLookAtBlock instead.
