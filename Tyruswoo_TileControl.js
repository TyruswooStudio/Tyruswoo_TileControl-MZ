//=============================================================================
// Tile Control
// For RPG Maker MZ
// By Tyruswoo and McKathlin
//=============================================================================

/*
 * MIT License
 *
 * Copyright (c) 2023 Kathy Bunn and Scott Tyrus Washburn
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var Imported = Imported || {};
Imported.Tyruswoo_TileControl = true;

var Tyruswoo = Tyruswoo || {};
Tyruswoo.TileControl = Tyruswoo.TileControl || {};

/*:
 * @target MZ
 * @plugindesc MZ v3.0.1 Change tiles dynamically during gameplay!
 * @author Tyruswoo and McKathlin
 * @url https://www.tyruswoo.com
 *
 * @help Tyruswoo Tile Control for RPG Maker MZ
 * ============================================================================
 * Plugin commands, their arguments, and short explanations:
 *
 * Set Tile                        Modify the tileID at selected location.
 *  - Tile ID                      Use a tile code (see below) or exact ID.
 *  - X,Y,Z Coordinates            Select the location of the tile to modify.
 *     > X                         On map, X coordinate at which to set tile.
 *     > Y                         On map, Y coordinate at which to set tile.
 *     > Z                         Z layer to affect. z 0-3 for layers 1-4.
 *  - Relativity & Options         Relative position of coords, and options.
 *     > Relativity Mode           Absolute, or relative to player or event.
 *        * Event ID               If relative to event: The event's ID.
 *        * Party Member           If relative to player: Leader or follower.
 *        * Orientational Shift    Change loc based on character's direction.
 *     > Allow Autotiling          True for autotiling. False for exact.
 *     > Clear Upper Layers        True to erase upper z layers. False: Keep.
 *
 * Fill Tiles                      Modify multiple tiles. Allows filters.
 *  - Tile ID                      Fill tile code (see below) or exact ID.
 *  - X,Y,Z Coordinates            Select the fill origin location.
 *     > X                         On map, X coordinate of origin.
 *     > Y                         On map, Y coordinate of origin.
 *     > Z                         Z layer to affect. z 0-3 for layers 1-4.
 *  - Relativity & Options         Relative position of coords, and options.
 *     > Relativity Mode           Absolute, or relative to player or event.
 *        * Event ID               If relative to event: The event's ID.
 *        * Party Member           If relative to player: Leader or follower.
 *        * Orientational Shift    Relative shift loc by character's direction.
 *           - Forward Shift       + to shift forward. - to shift backward.
 *           - Rightward Shift     + to shift rightward. - to shift leftward.
 *     > Allow Autotiling          True for autotiling. False for exact.
 *     > Clear Upper Layers        True to erase upper z layers. False: Keep.
 *  - Filters                      Only fill tiles that pass all filters.
 *     > Region(s) Filter          Region(s) allowed for fill.
 *     > Tile ID(s) Filter         Only allow fill at certain Tile ID(s).
 *        * Tile ID(s) Recognized  Tile ID(s) at which fill can occur.
 *        * Z Coord(s) Recognized  Z coords (layers) at which fill can occur.
 *     > Area Filter               Area to allow fill.
 *        * X1                     X coordinate of first corner of fill area.
 *        * Y1                     Y coordinate of first corner of fill area.
 *        * X2                     X coordinate of other corner of fill area.
 *        * Y2                     Y coordinate of other corner of fill area.
 *     > Distance Filter           Distance from origin to allow fill.
 *     > Hollow Filter             True for hollow. False for regular fill.
 *     > Origin Filter             Never fill origin tile, or always fill.
 *     > Creep                     Append unique tile changes, beyond fill.
 *        * Creep Distance                Distance creep spreads.
 *        * Creep Tile ID                 Tile code (see below) of creep.
 *        * Creep Z Coordinate            Z layer to affect with creep.
 *        * Creep Options                 Options for creep.
 *           - Allow Autotiling           True for autotiling. False: exact.
 *           - Clear Upper Layers         True to erase upper z layers.
 *        * Creep Filters                 Only creep on tiles passing filters.
 *           - Creep Region(s) Filter     Region(s) onto which creep can go.
 *           - Creep TileID(s) Filter     Only allow creep on these tile IDs.
 *              > Tile ID(s) Recognized   Tile ID(s) onto which creep can go.
 *              > Z Coord(s) Recognized   Z layers to search for tile ID(s).
 *           - Creep Area Filter          Area onto which creep can go.
 *              > X1                      X coordinate of 1st corner (creep).
 *              > Y1                      Y coordinate of 1st corner (creep).
 *              > X2                      X coordinate of 2nd corner (creep).
 *              > Y2                      Y coordinate of 2nd corner (creep).
 *           - Creep Hollow Filter        True: Hollow. False: Regular creep.
 *
 * Change Animation Frames         During game, change tile animation speed.
 *  - Tile Animation Frames        Frames for tile animations. Lower is faster.
 * ============================================================================
 * Plugin parameters, their arguments, and short explanations:
 *
 * Tile Animation Frames        Frames for tile animations of animated tiles.
 *                              Lower is faster. Higher is slower. Default: 30.
 *
 * Common Event on OK Press     Common event to begin when player presses the
 *                              OK button (Enter).
 *
 * Tile Info on OK Press        True: Output tile info to console window when
 *                              playtester holds Ctrl then presses Enter (OK).
 *                              (Tip: When playtesting, press F12 to open the
 *                              console window.) Default: True.
 * ============================================================================
 * Script calls (Advanced):
 *
 * $gameMap.tileCodeAt(x,y,z)
 *     Returns the "Tx,y" ("Letter X comma Y" or "Tab X comma Y") tile code
 *     at location (x,y,z) where x is the x coordinate,y is the y coordinate,
 *     and z is the z layer (0, 1, 2, or 3). Tile code returns as a string.
 *     - For example, from the default Overworld tileset, ocean returns the
 *       string "A0,0".
 *     - This script call is useful in a conditional branch.
 *       For example, if the player is in the  Overworld and the Overworld is
 *       using the default tilset, you can use a conditional branch with the
 *       following script to check whether the player is currently in a
 *       temperate/deciduous forest tile (at z=1, which is editor layer 2):
 *       > Conditional Branch (Script):
 *         $gameMap.tileCodeAt($gamePlayer.x, $gamePlayer.y, 1) == "A4,2"
 *
 * $gameMap.tileCode(x,y,z)
 *     Same as $gameMap.tileCodeAt(x,y,z).
 *
 * $gameMap.tileMatch(tileIdList, x, y, z)
 * $gameMap.tileIdInList(tileIdList, x, y, z)
 * $gameMap.autotileInList(autotileList, x, y, z)
 * $gameMap.tileIdInListAhead(tileIdList, distance, z)
 * $gameMap.tileAhead(tileIdList, distance, z)
 * $gameMap.autotileInListAhead(autotileList, distance, z)
 * $gameMap.autotileAhead(autotileList, distance, z)
 *     These script calls return true if the tile at the location matches one
 *     in the list; false otherwise. They're useful for conditional branches.
 *     - tileIdList and autotileList are arrays that can
 *       contain numbers or tile codes (as strings).
 *     - tileAhead and autotileAhead looks in the direction the player is facing,
 *       and finds whichever tile is located there at the z level indicated.
 *     - $gameMap.tileIdInListAhead() is the same as $gameMap.tileAhead().
 *     - Likwise, $gameMap.autotileInListAhead() is the same as
 *       $gameMap.autotileAhead().
 *     Example use case: When the player is pushing an event, you can look
 *     at the tile(s) 2 steps ahead of the player's current location, to
 *     determine what happens when the player tries to push the event.
 *
 * ============================================================================
 * Basics of how to use this plugin:
 * 1. To change a tile while a player is playing your game, you can create an
 *    event that runs the plugin command Set Tile.
 * 2. In the Set Tile command, type the Tile ID code for your desired tile.
 *    Use one of the three types of Tile ID codes (described below).
 * 3. Choose the coordinates (X, Y, and Z) at which to change the tile.
 *    Keep in mind that the coordinates are by default relative to the event
 *    that is running this plugin command.
 * 4. You can modify the settings in Relativity & Options, if you like.
 *    If you want absolute coordinates, or coorcinates relative to the player,
 *    you can change this here. If you want to keep upper z layers, you can do
 *    that, too. (Keep autotiling true unless you need to set an autotile
 *    to an exact value.)
 * 5. When you activate the event, the tile at the coordinates you have chosen
 *    will change to the Tile ID you chose!
 * ============================================================================
 * Tile ID Codes:
 *    There are three types of tile ID codes. You can use any of these tile
 *    codes for the "Tile ID" of plugin commands.
 *
 *    Tx,y      Where T is the tab, x is the x position in the tab's tileset,
 *              and y is the y position in the tab's tileset. Also known as
 *              "Letter X comma Y" or "Tab X comma Y".
 *               - This tile code is determined by the Tab (A, B, C, D, or E)
 *                 and the (x,y) position of the desired tile within the
 *                 tilset.
 *               - For example, in tab A, the top left tile is A0,0 (which in
 *                 the Overworld tileset is ocean).
 *               - For example, in the default Overworld tileset, use tile code
 *                 A3,1 for a whirlpool.
 *               - For example, in the default Overworld tileset, use tile code
 *                 B2,1 for a pyramid.
 *               - You can use tile code B0,0 to erase any tile.
 *              
 *              The Tx,y tile ID code assumes that you have a full tileset in
 *              Tab A. This includes A1, A2, A3, A4, and A5. If a plugin
 *              command calls for a Tile ID belonging to an absent tile sheet,
 *              the console will log a warning, and the tile will not be placed.
 *              If you do not have a full tileset in Tab A, refer to the table
 *              below for the first Y value of each A tilesheet:
 *              
 *              Tilesheet | First Y value (top of its sheet)
 *              ----------+----------------------------------
 *                     A1 |  0
 *                     A2 |  2
 *                     A3 |  6
 *                     A4 | 10
 *                     A5 | 16
 *
 *              Tabs B, C, D, and E (if present) have a single tilesheet each,
 *              so finding their x,y coordinates is straightforward.
 *
 *    Tn        Where T is the tab, and n is the number of the tile when
 *              counting tiles from left to right, starting with zero. Also
 *              known as "Letter Number" or "Tab Number".
 *               - Tip: This numbering scheme is the same as how regions are
 *                 numbered and displayed in the regions (R) tab, so you can
 *                 use the regions tab to help with counting tiles.
 *               - For example, in tab A, the first tile is A0 (which in the
 *                 Overworld tileset is ocean).
 *               - For example, in the default Overworld tileset, use tile code
 *                 A11 for a whirlpool.
 *               - For example, in the default Overworld tileset, use tile code
 *                 B10 for a pyramid.
 *               - You can use tile code B0 to erase any tile.
 *
 *              The Tn tile ID code assumes that you have a full
 *              tileset in Tab A. This includes A1, A2, A3, A4, and A5. If you
 *              do not have a full tileset in Tab A, refer to the tile code
 *              cheat sheet below:
 * 
 *              1st code of A1:   0
 *              1st code of A2:  16
 *              1st code of A3:  48
 *              1st code of A4:  80
 *              1st code of A5: 128
 *
 *    Exact     For this tile code, you must enter the exact tile ID number
 *              used in RPG Maker's inner code.
 *               - Tip: The exact tile ID code is only needed if you want to
 *                 set an autotile to an exact shape (ignoring autotiling).
 *                 Note that to ignore autotiling, the "Allow Autotiling"
 *                 option must be Off (or false) in the plugin command
 *                 arguments. (Note: Using exact tile ID for autotiles is
 *                 similar to using Shift+Click in the editor.)
 *               - Tip: To find the exact tile ID code, while playtesting,
 *                 open the console window by pressing F12 on the keyboard.
 *                 Then, move the party leader character on top of a tile
 *                 with the exact tile appearance you want. Then, hold Ctrl
 *                 while you press Enter. The exact tile IDs at that location
 *                 will be logged to the console.
 *               - For example, in the default Overworld tileset, use tile code
 *                 2048 for ocean.
 *               - For example, in the default Overworld tileset, use tile code
 *                 2576 for a whirlpool.
 *               - For example, in the default Overworld tileset, use tile code
 *                 10 for a pyramid.
 *               - You can use tile code 0 to erase any tile.
 * ============================================================================
 * Advanced uses for this plugin:
 *  - Creep! Creep is calculated after the main fill command has finished. At
 *    that time, you can add an "appendage" of any tile ID. Creep will by
 *    default be the same tile ID as the fill; however, you can also define a
 *    unique tile ID for the creep. The creep can go any distance you like,
 *    but by default only goes 1 tile further than the fill. Creep uses the
 *    tiles already filled as a large "origin" from which creep can expand.
 *     > Creep is especially useful if you want to have fluid that spreads,
 *       such as flowing water, flowing lava, or flowing poison. However, creep
 *       can be used with any tile.
 *     > Note that creep spreads in cardinal directions (north, south, east,
 *       and west), but not in diagonal directions.
 *  - Exact tiles! To set an exact tile, you must go to the plugin command's
 *    options argument, and change Allow Autotiling to false. Then, if you are
 *    making an exact shape of an autotile, you must know the exact tile ID
 *    of that shape of the autotile. To find this, create a map with that shape
 *    of autotile present, then go into playtesting mode. While standing on the
 *    autotile, hold Ctrl and press OK (Enter) to output the info of the tiles
 *    at that location to the console window. Press F12 to open the console
 *    window to see the output info. Use the exact tile ID in the plugin
 *    command. Setting exact tiles is useful when you want a particular shape
 *    of an autotile. Note that exact tiles are similar to using Shift+Click
 *    in the editor, because autotiling is prevented and any autotile can be
 *    placed anywhere.
 *  - Hollow filter! You can use this to help you achieve interesting and
 *    appealing fill shapes! Hollow shapes do respect diagonals. (This is
 *    different compared to creep or the distance filter, because both creep
 *    and the distance filter only recognize cardinally neigboring tiles.
 *    The hollow filter recognizes neighboring tiles both cardinally and
 *    diagonally.
 *  - Common Event on OK Press! (And the $gameMap.tileCodeAt(x,y,z) script!)
 *    You can use this plugin parameter to define a common event that happens
 *    when the player presses the OK button (Enter for keyboard users). If you
 *    want the OK press to detect a tile, you can have the common event use the
 *    $gameMap.tileCodeAt(x,y,z) script call in a conditional branch (see
 *    example above), so that you know what tiles are located at the player's
 *    position.
 *     > If you want to change a tile, it is usually easier to use the Fill
 *       plugin command, because it has filters. If you use the Fill plugin
 *       command, you often don't need to use the $gameMap.tileCodeAt(x,y,z)
 *       script call, because the Fill command has a Tile ID(s) Filter.
 *       However, if you don't want to change a tile, but just want to know
 *       what tile code is present, the $gameMap.tileCodeAt(x,y,z) script call
 *       is useful.
 *     > You could combine the $gameMap.tileCodeAt(x,y,z) plugin command with
 *       scripts $gameMap.xWithDirection(x,d) and $gameMap.yWithDirection(y,d)
 *       to get the tile code in front of the player, or relative to an event.
 *       However, if you want to modify a tile depending on the player's
 *       direction, you could also use the Orientational Shift relativity
 *       option to cause a tile to be modified in front of the player.
 *     > You could also use a conditional branch to check whether the player
 *       has a certain item (tool) required to modify a tile.
 * ============================================================================
 * Reference of how tile information is tracked in RPG Maker:
 *
 *    Exact tile ID reference:
 *       Tile ID 0      Beginning of Tab B.
 *       Tile ID 256    Beginning of Tab C.
 *       Tile ID 512    Beginning of Tab D.
 *       Tile ID 768    Beginning of Tab E.
 *       Tile ID 1536   Beginning of Tab A portion A5.
 *       Tile ID 2048   Beginning of Tab A portion A1. Beginning of autotiles.
 *       Tile ID 2816   Beginning of Tab A portion A2.
 *       Tile ID 4352   Beginning of Tab A portion A3.
 *       Tile ID 5888   Beginning of Tab A portion A4.
 *       Tile ID 8192   This is the maximum Tile ID.
 *
 *    z Layers:
 *       z=0: Layer 1 in editor.
 *       z=1: Layer 2 in editor.
 *       z=2: Layer 3 in editor.
 *       z=3: Layer 4 in editor.
 *       z=4: ShadowBits.
 *       z=5: Regions.
 *
 *    Shadow Bits:
 *       Bit 1: Northwest (upper left) corner shadow.
 *       Bit 2: Northeast (upper right) corner shadow.
 *       Bit 3: Southwest (lower left) corner shadow.
 *       Bit 4: Southeast (lower right) corner shadow.
 *
 *    Tile Flags:
 *       May be expressed as decimal (base 10); binary (base 2, prefix of
 *       0b, values of 0 or 1); or hexidecimal (base 16, prefix of 0x, values
 *       of 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, a, b, c, d, e, or f).
 *       Bit 1:  Impassible south side of tile. (Hint: 2 key on Numpad.)
 *       Bit 2:  Impassible west side of tile. (Hint: 4 key on Numpad.)
 *       Bit 3:  Impassible east side of tile. (Hint: 6 key on Numpad.)
 *       Bit 4:  Impassible north side of tile. (Hint: 8 key on Numpad.)
 *       Bit 5:  This is a star (*) tile, and so does not affect passage.
 *       Bit 6:  This is a ladder.
 *       Bit 7:  This is a bush.
 *       Bit 8:  This is a counter.
 *       Bit 9:  This is damage floor.
 *       Bit 10: Impassible to boats.
 *       Bit 11: Impassible to ships.
 *       Bit 12: Airships cannot land here (or if bits 1-4 all impassible.)
 *       Bit 13: Terrain Tags 1 to 7 (in binary).
 *       Bit 14: Terrain Tags 1 to 7 (in binary).
 *       Bit 15: Terrain Tags 1 to 7 (in binary).
 * ============================================================================
 * For more help using the Tile Control plugin, see Tyruswoo.com.
 * ============================================================================
 * Version History:
 *
 * v1.0  8/30/2020
 *        - Tile Control released for RPG Maker MZ!
 *
 * v1.1  9/12/2020
 *        - Fixed interpretation of boolean parameters and command arguments in
 *          some instances.
 *        - Updates Tile Control to work with Tyruswoo_FollowerControl v1.3 and
 *          higher.
 *        - Cleaned up the code so that repetitions are handled more concisely.
 * 
 * v2.0  11/8/2021
 *        - Fixed bug that was keeping A5 tiles from being placed properly
 *          when written in the form Ax,y
 *        - Fixed crash on plugin command calling for a Tile ID from an absent
 *          tile sheet. Now a warning is logged instead.
 *        - Fixed bug that kept the map from loading properly in some projects.
 *          Thanks to Cris Litvin for reporting it and helping us debug!
 *
 * v3.0  3/10/2023
 *        - Link Map allows events to change distant maps' tiles.
 *        - Added the following tile-checking script calls:
 *             $gameMap.tileIdInList(tileIdList, x, y, z)
 *             $gameMap.tileIdInListAhead(tileIdList, distance, z)
 *             $gameMap.tileAhead(tileIdList, distance, z)
 *             $gameMap.autotileInList(autotileList, x, y, z)
 *             $gameMap.autotileInListAhead(autotileList, distance, z)
 *             $gameMap.autotileAhead(autotileList, distance, z)
 *        - Fixed bug where tile changes were lost if the player opened the
 *          field menu mid-event.
 * 
 * v3.0.1  8/30/2023
 *        - This plugin is now free and open source under the MIT license.
 *
 * ============================================================================
 * MIT License
 *
 * Copyright (c) 2023 Kathy Bunn and Scott Tyrus Washburn
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 * ============================================================================
 * Remember, only you can build your dreams!
 * -Tyruswoo
 *
 * @param Tile Animation Frames
 * @type number
 * @min 1
 * @default 30
 * @desc Number of frames elapsed for every animation update of the tilemap. Lower is faster. Higher is slower. Default: 30.
 *
 * @param Common Event on OK Press
 * @type common_event
 * @desc Common event to run when the player presses OK (confirm) button. Occurs if other events not triggered. 0 for none.
 *
 * @param Tile Info on OK Press
 * @type boolean
 * @default true
 * @desc When true, the playtester can hold Ctrl then press the OK (confirm) button to output a tile's ID info to the console.
 *
 * @command set_tile
 * @text Set Tile
 * @desc Set a tile by tileId and coordinates. (To find tileId, playtest with "Tile Info on OK Press." See tileId in console with F12.)
 *
 * @arg tileId
 * @type string
 * @default A0,0
 * @text Tile ID
 * @desc Use tile code or exact tile ID. Example codes for same tile (Overworld water):   A0,0   or   A0   or   2048
 *
 * @arg coordinates
 * @type struct<coordinates>
 * @default {"x":"0","y":"0","z":"0"}
 * @text X,Y,Z Coordinates
 * @desc Coordinates at which to set tile to tileId. +x for east, +y for south. If relative: -x for west, -y for north.
 *
 * @arg relativity
 * @type struct<relativity>
 * @default {"mode":"Relative to Event","eventId":"","party_member":"","orientational_shift":"","allowAutotiling":"true","clearUpperLayers":"true"}
 * @text Relativity & Options
 * @desc Coordinates may be interpreted as absolute, or relative to an event or the player. Also, special options available.
 *
 * @command fill_tiles
 * @text Fill Tiles
 * @desc Fill tiles by tileId and filters. (To find tileId, playtest with "Tile Info on OK Press." See tileId in console with F12.)
 *
 * @arg tileId
 * @type string
 * @default A0,0
 * @text Tile ID
 * @desc Use tile code or exact tile ID. Example codes for same tile (Overworld water):   A0,0   or   A0   or   2048
 *
 * @arg coordinates
 * @type struct<coordinates>
 * @default {"x":"0","y":"0","z":"0"}
 * @text X,Y,Z Coordinates
 * @desc Z layer to fill, and (x,y) at which to begin. +x for east, +y for south. If relative: -x for west, -y for north.
 *
 * @arg relativity
 * @type struct<relativity>
 * @default {"mode":"Relative to Event","eventId":"","party_member":"","orientational_shift":"","allowAutotiling":"true","clearUpperLayers":"true"}
 * @text Relativity & Options
 * @desc Coordinates may be interpreted as absolute, or relative to an event or the player. Also, special options available.
 *
 * @arg filters
 * @type struct<filters>
 * @text Filters
 * @desc Use these filters to specify which tiles are filled. To be filled, tiles must satisfy all filters.
 *
 * @command change_animation_frames
 * @text Change Animation Frames
 * @desc Change the tile animation frames dynamically during gameplay.
 * This controls animation speed of water and animated tiles.
 *
 * @arg tileAnimationFrames
 * @type number
 * @default 30
 * @text Tile Animation Frames
 * @desc Higher for slower tile animation. Lower for faster tile animation. Zero makes animated tiles vanish. Default: 30.
 * 
 * @command link_map
 * @text Link Map
 * @desc Pick a map, and subsequent Tile Control commands will change tiles on that map instead of the current one.
 * 
 * @arg map
 * @text Map
 * @type text
 * @desc Name or ID of the map to link.
 * 
 * @command unlink_map
 * @text Unlink Map
 * @desc Return to having Tile Control commands affect the map the player is in.
 * 
 */
 
/*~struct~coordinates:
 * @param x
 * @type number
 * @default 0
 * @min -256
 * @max 256
 * @text X
 * @desc X coordinate value.
 *
 * @param y
 * @type number
 * @default 0
 * @min -256
 * @max 256
 * @text Y
 * @desc Y coordinate value.
 *
 * @param z
 * @type number
 * @default 0
 * @min 0
 * @max 3
 * @text Z
 * @desc Z coordinate value. 0 for first layer. 1 for second layer. 2 for third layer. 3 for fourth layer.
 */

/*~struct~relativity:
 * @param mode
 * @type select
 * @option Absolute
 * @option Relative to Event
 * @option Relative to Player
 * @default Relative to Event
 * @text Relativity Mode
 * @desc Select how coordinates are to be interpreted. If relative, defaults either to this event or to player.
 *
 * @param eventId
 * @parent mode
 * @type number
 * @text Event ID
 * @desc Event ID number of the event whose coordinates are to be used for "Relative to Event." 0 (or empty) for this event.
 *
 * @param party_member
 * @parent mode
 * @type select
 * @option Player
 * @option Leader
 * @option Follower 1
 * @option Follower 2
 * @option Follower 3
 * @option Follower 4
 * @option Follower 5
 * @option Follower 6
 * @option Follower 7
 * @option Follower 8
 * @option Follower 9
 * @text Party Member
 * @desc Party member whose coordinates are used for "Relative to Player". Default: Player. Can use Follower Control plugin.
 *
 * @param orientational_shift
 * @parent mode
 * @type struct<shift>
 * @text Orientational Shift
 * @desc With "Relative to Event" or "Relative to Player", modify coordinates based on direction character is facing.
 *
 * @param allowAutotiling
 * @type boolean
 * @on Allow Autotiling
 * @off Exact Tile Only
 * @default true
 * @text Allow Autotiling
 * @desc If false, then autotiling will not occur (which is similar to Shift+Click with the editor.)
 *
 * @param clearUpperLayers
 * @type boolean
 * @on ON
 * @off OFF
 * @default true
 * @text Clear Upper Layers
 * @desc If true, then any layers above the z coordinate will be replaced with an empty tile (tile B0,0).
 */

/*~struct~shift:
 * @param forward_shift
 * @type number
 * @default 0
 * @min -256
 * @max 256
 * @text Forward Shift
 * @desc Modify coordinates based on the direction the character is facing. Positive for forward. Negative for backward.
 *
 * @param rightward_shift
 * @type number
 * @default 0
 * @min -256
 * @max 256
 * @text Rightward Shift
 * @desc Modify coordinates based on the direction the character is facing. Positive for rightward. Negative for leftward.
 */

/*~struct~filters:
 * @param region_filter
 * @type number[]
 * @text Region(s) Filter
 * @desc Region(s) to recognize as appropriate for being filled. 0 to recognize tiles lacking a region.
 *
 * @param tileId_filter
 * @type struct<tileIdFilter>
 * @text Tile ID(s) Filter
 * @desc Tile ID(s) to recognize as appropriate for being filled. Also, layers (Z coords) to search for these tile ID(s).
 *
 * @param area_filter
 * @type struct<area>
 * @text Area Filter
 * @desc Coordinates defining the corners of the area to be filled. (Coordinates are affected by relativity, if any.)
 *
 * @param distance
 * @type number
 * @text Distance Filter
 * @desc Distance to fill adjacent tiles, from start coordinates. Respects boundaries defined by previous filters.
 *
 * @param hollow
 * @type boolean
 * @on Hollow
 * @off Regular Fill
 * @text Hollow Filter
 * @desc If hollow, then inside will not be filled. If regular fill, then entire selection is filled. Default: Regular.
 *
 * @param origin
 * @type select
 * @option Regular
 * @option Never Fill
 * @option Always Fill (Before Creep)
 * @option Always Fill (After Creep)
 * @text Origin Filter
 * @desc Special fill condition for the origin. The origin is the location of the (X, Y, Z) Coordinates.
 *
 * @param creep
 * @type struct<creep>
 * @text Creep
 * @desc After fill space is determined, creep onto additional tiles beyond identified fill space.
 */

/*~struct~area:
 * @param x1
 * @type number
 * @default 0
 * @min -256
 * @max 256
 * @text X1
 * @desc X1 coordinate value.
 *
 * @param y1
 * @type number
 * @default 0
 * @min -256
 * @max 256
 * @text Y1
 * @desc Y1 coordinate value.
 *
 * @param x2
 * @type number
 * @default 0
 * @min -256
 * @max 256
 * @text X2
 * @desc X2 coordinate value.
 *
 * @param y2
 * @type number
 * @default 0
 * @min -256
 * @max 256
 * @text Y2
 * @desc Y2 coordinate value.
 */

/*~struct~tileIdFilter:
 * @param tileIds_recognized
 * @type string[]
 * @default
 * @text Tile ID(s) Recognized
 * @desc Use tile code or exact tile ID. Example codes for same tile (Overworld water):   A0,0   or   A0   or   2048
 *
 * @param z_coordinates_recognized
 * @type struct<zCoordinatesRecognized>
 * @text Z Coord(s) Recognized
 * @desc Z layers to recognize as included. By default, all layers are searched for tiles matching the tile ID(s) filter.
 */
 
 /*~struct~zCoordinatesRecognized:
 * @param z0
 * @type select
 * @option Recognize
 * @option Skip
 * @default Recognize
 * @text Layer 1 (z=0)
 * @desc "Recognize" to include this layer. "Skip" to exclude this layer.
 *
 * @param z1
 * @type select
 * @option Recognize
 * @option Skip
 * @default Recognize
 * @text Layer 2 (z=1)
 * @desc "Recognize" to include this layer. "Skip" to exclude this layer.
 *
 * @param z2
 * @type select
 * @option Recognize
 * @option Skip
 * @default Recognize
 * @text Layer 3 (z=2)
 * @desc "Recognize" to include this layer. "Skip" to exclude this layer.
 *
 * @param z3
 * @type select
 * @option Recognize
 * @option Skip
 * @default Recognize
 * @text Layer 4 (z=3)
 * @desc "Recognize" to include this layer. "Skip" to exclude this layer.
 */

 /*~struct~creep:
 * @param creep_distance
 * @type number
 * @default 1
 * @text Creep Distance
 * @desc Distance for creep to travel on adjacent tiles. Respects boundaries defined by creep filters. 0 for no creep.
 *
 * @param creep_tileId
 * @type string
 * @text Creep Tile ID
 * @desc Tile code for creep. Defaults to fill tileId. Example codes for same tile (Overworld water): A0,0 or A0 or 2048
 *
 * @param creep_z_coordinate
 * @type number
 * @text Creep Z Coordinate
 * @desc Z coordinate for creep. Defaults to fill Z coordinate. 0 for Layer 1. 1 for Layer 2. 2 for layer 3. 3 for layer 4.
 *
 * @param creep_options
 * @type struct<creepOptions>
 * @default {"creepAllowAutotiling":"true","creepClearUpperLayers":"true"}
 * @text Creep Options
 * @desc Special options for creep.
 *
 * @param creep_filters
 * @type struct<creepFilters>
 * @text Creep Filters
 * @desc Use these filters to specify which tiles can have creep. To receive creep, tiles must satisfy all creep filters.
 */

/*~struct~creepOptions:
 * @param creepAllowAutotiling
 * @type boolean
 * @on Allow Autotiling
 * @off Exact Tile Only
 * @default true
 * @text Allow Autotiling
 * @desc If false, then creep autotiling will not occur (which is similar to Shift+Click with the editor.)
 *
 * @param creepClearUpperLayers
 * @type boolean
 * @on ON
 * @off OFF
 * @default true
 * @text Clear Upper Layers
 * @desc If true, then any layers above the z coordinate will be replaced with an empty tile (tile B0,0).
 */

/*~struct~creepFilters:
 * @param creep_region_filter
 * @type number[]
 * @text Creep Region(s) Filter
 * @desc Region(s) to recognize as appropriate for creep. 0 to recognize tiles lacking a region.
 *
 * @param creep_tileId_filter
 * @type struct<tileIdFilter>
 * @text Creep TileID(s) Filter
 * @desc Tile ID(s) to recognize as appropriate for creep. Also, layers (Z coords) to search for these tile ID(s).
 *
 * @param creep_area_filter
 * @type struct<area>
 * @text Creep Area Filter
 * @desc Coordinates defining the corners of the area for creep. (Coordinates are affected by relativity, if any.)
 *
 * @param creep_hollow
 * @type boolean
 * @on Hollow
 * @off Regular Creep
 * @text Creep Hollow Filter
 * @desc If hollow, then inside will not have creep. If regular, then entire selection receives creep. Default: Regular.
 */

(() => {
    const pluginName = "Tyruswoo_TileControl";

	Tyruswoo.TileControl.parameters = PluginManager.parameters(pluginName);
	Tyruswoo.TileControl.param = Tyruswoo.TileControl.param || {};

	// User-Defined Plugin Parameters
	Tyruswoo.TileControl.param.tileAnimationFrames = Number(Tyruswoo.TileControl.parameters['Tile Animation Frames']);
	Tyruswoo.TileControl.param.tileInfoOnOkPress = (Tyruswoo.TileControl.parameters['Tile Info on OK Press'] == "true") ? true : false;
	Tyruswoo.TileControl.param.commonEventOnOkPress = Number(Tyruswoo.TileControl.parameters['Common Event on OK Press']);

	// Variables
	Tyruswoo.TileControl._tileAnimationFrames = Tyruswoo.TileControl.param.tileAnimationFrames;
	Tyruswoo.TileControl._pluginCommandEventId = 0; //Keep track of the most recent event to run a plugin command.
	
	// Default values for plugin command arguments.
	const defaultCoordinates = {"x":"0", "y":"0", "z":"0"};
	const defaultRelativity = {"mode":"Relative to Event","eventId":"","party_member":"","orientational_shift":"","allowAutotiling":"true","clearUpperLayers":"true"};
	const defaultOrientationalShift = {"forward_shift":"0","rightward_shift":"0"};
	const defaultFilters = {"region_filter":"","tileId_filter":"","area_filter":"","distance":"","hollow":"","origin":"","creep":""};
	const defaultRegionFilter = null;
	const defaultTileIdFilter = null;
	const defaultTileIdsFilter = null;
	const defaultTileIdZFilter = {"z0":"Recognize","z1":"Recognize","z2":"Recognize","z3":"Recognize"};
	const defaultAreaFilter = null;
	const defaultCreep = {"creep_distance":"","creep_tileId":"","creep_z_coordinate":"","creep_options":"","creep_filters":""};
	const defaultCreepOptions = {"creepAllowAutotiling":"true","creepClearUpperLayers":"true"};
	const defaultCreepFilters = {"creep_region_filter":"","creep_tileId_filter":"","creep_area_filter":"","creep_hollow":""};
	const defaultCreepRegionFilter = null;
	const defaultCreepTildIdFilter = null;
	const defaultCreepTileIdsFilter = null;
	const defaultCreepTileIdZFilter = {"z0":"Recognize","z1":"Recognize","z2":"Recognize","z3":"Recognize"};
	const defaultCreepAreaFilter = null;

	const TILE_SELECTOR_ROW_SIZE = 8;
	const TILES_PER_A_SHEET = [ 0, 16, 32, 32, 48, 128 ];
	const FIRST_A_CODE_NUMBER = [ 0, 0, 16, 48, 80, 128 ];
	const TILE_SHEET_INDEXES_BY_NAME = {
		A1: 0, A2: 1, A3: 2, A4: 3, A5: 4, B: 5, C: 6, D: 7, E: 8
	};
	
	//=============================================================================
	// Tile Control Functions
	//=============================================================================

	Tyruswoo.TileControl.loadReferenceMapSync = function(mapId) {
		if ($gameMap && mapId == $gameMap.mapId() && $dataMap) {
			// It's the currently loaded map. No need to open it again.
			return $dataMap;
		} else if (Tyruswoo.mapCache && Tyruswoo.mapCache[mapId]) {
			// It's a cached map. Retrieve it.
			return Tyruswoo.mapCache[mapId];
		}
		// If we're still here, we need to load a not-yet-cached map.
		const fs = require('fs');
		const path = "data/Map%1.json".format(mapId.padZero(3));
		const json = fs.readFileSync(path, 'utf8');
		const mapObj = JSON.parse(json);
		Tyruswoo.mapCache = Tyruswoo.mapCache || [];
		Tyruswoo.mapCache[mapId] = mapObj;
		return mapObj;
	};

	Tyruswoo.TileControl.tileIdExists = function(tilesetId, tileId) {
		const tileSheetName = this.getTileSheetNameOfTileId(tileId);
		return this.tileSheetExists(tilesetId, tileSheetName);
	};

	Tyruswoo.TileControl.getSheetNumberOfCode = function(codeNumber) {
		for (var i = 1; i < 5; i++) {
			if (codeNumber < FIRST_A_CODE_NUMBER[i+1]) {
				return i;
			}
		}
		// It's on or after the first A5 tile.
		return 5;
	};

	Tyruswoo.TileControl.tileSheetExists = function(tilesetId, tileSheetName) {
		const sheetIndex = TILE_SHEET_INDEXES_BY_NAME[tileSheetName];
		if (undefined === sheetIndex) {
			return false;
		}
		const tileset = $dataTilesets[tilesetId];
		const sheetName = tileset.tilesetNames[sheetIndex];
		return !!sheetName && sheetName.length > 0;
	};

	Tyruswoo.TileControl.getTileSheetNameOfTileId = function(tileId) {
		if (tileId < Tilemap.TILE_ID_B) {
			console.warn("Unexpected negative tile ID: " + tileId);
			return "?";
		} else if (tileId < Tilemap.TILE_ID_C) {
			return "B";
		} else if (tileId < Tilemap.TILE_ID_D) {
			return "C";
		} else if (tileId < Tilemap.TILE_ID_E) {
			return "D";
		} else if (tileId < Tilemap.TILE_ID_A5) {
			return "E";
		} else if (Tilemap.isTileA1(tileId)) {
			return "A1";
		} else if (Tilemap.isTileA2(tileId)) {
			return "A2";
		} else if (Tilemap.isTileA3(tileId)) {
			return "A3";
		} else if (Tilemap.isTileA4(tileId)) {
			return "A4";
		} else if (Tilemap.isTileA5(tileId)) {
			return "A5";
		} else {
			console.warn("Unexpected tile ID: " + tileId);
			return "?";
		}
	};

	// New method
	// This method takes a tileId as input, and returns the tileCode.
	Tyruswoo.TileControl.tileCodeFromId = function(tileId) {
		var tileCode = "";
		var codeX = 0;
		var codeY = 0;
		if (tileId >= Tilemap.TILE_ID_A1) {
			codeY = Math.floor((tileId - Tilemap.TILE_ID_A1) / (48 * 8));
			codeX = Math.floor((tileId - Tilemap.TILE_ID_A1 - codeY * 48 * 8) / 48);
			tileCode = "A" + codeX + "," + codeY;
		} else if (tileId >= Tilemap.TILE_ID_A5) {
			codeY = Math.floor((tileId - Tilemap.TILE_ID_A5) / 8) + 16;
			codeX = tileId - Tilemap.TILE_ID_A5 - (codeY - 16) * 8;
			tileCode = "A" + codeX + "," + codeY;
		} else if (tileId >= Tilemap.TILE_ID_E) {
			codeY = Math.floor((tileId - Tilemap.TILE_ID_E) / 8);
			codeX = tileId - Tilemap.TILE_ID_E - codeY * 8;
			tileCode = "E" + codeX + "," + codeY;
		} else if (tileId >= Tilemap.TILE_ID_D) {
			codeY = Math.floor((tileId - Tilemap.TILE_ID_D) / 8);
			codeX = tileId - Tilemap.TILE_ID_D - codeY * 8;
			tileCode = "D" + codeX + "," + codeY;
		} else if (tileId >= Tilemap.TILE_ID_C) {
			codeY = Math.floor((tileId - Tilemap.TILE_ID_C) / 8);
			codeX = tileId - Tilemap.TILE_ID_C - codeY * 8;
			tileCode = "C" + codeX + "," + codeY;
		} else if (tileId >= Tilemap.TILE_ID_B) {
			codeY = Math.floor((tileId - Tilemap.TILE_ID_B) / 8);
			codeX = tileId - Tilemap.TILE_ID_B - codeY * 8;
			tileCode = "B" + codeX + "," + codeY;
		}
		return tileCode;
	};
	
	// With input of args from Tile Control plugin command, outputs an array [x, y, z], with accounting for relativity options.
	Tyruswoo.TileControl.extract_xyz_array = function(args, linkedMap=null) {
		const coordinates = args.coordinates ? JSON.parse(args.coordinates) : defaultCoordinates;
		const relativity = args.relativity ? JSON.parse(args.relativity) : defaultRelativity;
		const orientational_shift = relativity.orientational_shift ? JSON.parse(relativity.orientational_shift) : defaultOrientationalShift;
		var x = Number(coordinates.x);
		var y = Number(coordinates.y);
		const z = Number(coordinates.z);
		if (relativity.mode == "Relative to Event") {
			const eventId = Number(relativity.eventId) ? Number(relativity.eventId) : Tyruswoo.TileControl._pluginCommandEventId;
			let event;
			let direction;
			if (linkedMap) {
				event = linkedMap.events[eventId];
				direction = event.direction;
			} else {
				event = $gameMap.event(eventId);
				direction = event.direction();
			}
			if (event) {
				const f = Number(orientational_shift.forward_shift) ? Number(orientational_shift.forward_shift) : 0;
				const r = Number(orientational_shift.rightward_shift) ? Number(orientational_shift.rightward_shift) : 0;
				const xy_shift = Tyruswoo.TileControl.orientationalShift(direction, f, r);
				x = x + event.x + xy_shift[0];
				y = y + event.y + xy_shift[1];
			}
		} else if (relativity.mode == "Relative to Player") {
			var p = $gamePlayer; //By default, the party leader is selected.
			if (Imported.Tyruswoo_FollowerControl) { //However, if Tyruswoo_FollowerControl is installed, then the currently selected follower is automatically selected.
				p = Tyruswoo.FollowerControl.follower();
			}
			if (relativity.party_member == "Leader") {
				p = $gamePlayer; //Regardless of whether Tyruswoo_FollowerControl is installed, the "Leader" option can be used to select the leader.
			} else if (relativity.party_member.substr(0, 8) == "Follower") {
				const n = Number(relativity.party_member.substr(9)); //Get the number at the end of this string.
				p = $gamePlayer.followers().follower(n - 1);
			}
			if (p) {
				const f = Number(orientational_shift.forward_shift) ? Number(orientational_shift.forward_shift) : 0;
				const r = Number(orientational_shift.rightward_shift) ? Number(orientational_shift.rightward_shift) : 0;
				const xy_shift = Tyruswoo.TileControl.orientationalShift(p.direction(), f, r);
				x = x + p.x + xy_shift[0];
				y = y + p.y + xy_shift[1];
			}
		}
		return [x, y, z];
	};
	
	Tyruswoo.TileControl.orientationalShift = function(direction, f = 0, r = 0) { //direction, forward shift, and rightward shift.
		var xShift = 0;
		var yShift = 0;
		switch(direction) {
			case 2:
				xShift -= r;
				yShift += f;
				break;
			case 4:
				xShift -= f;
				yShift -= r;
				break;
			case 6:
				xShift += f;
				yShift += r;
				break;
			case 8:
				xShift += r;
				yShift -= f;
				break;
		}
		return [xShift, yShift];
	};

	Tyruswoo.TileControl.getEditingMap = function() {
		editingMapId = $gameMap ? $gameMap.editingMapId() : 0;
		if (0 == editingMapId) {
			console.log("Editing map is not available.");
			return null;
		}

		if ($gameMap && editingMapId == $gameMap.mapId()) {
			return $dataMap; // It's the current map.
		} else {
			// It's a remote map.
			return this.loadReferenceMapSync(editingMapId);
		}
	};

	//=============================================================================
	// Scene_Map
	// Tile data persistence by McKathlin.
	//=============================================================================

	// Alias method
	// Tile data persistence by McKathlin.
	Tyruswoo.TileControl.Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
	Scene_Map.prototype.onMapLoaded = function() {
		var mapId = this._transfer ? $gamePlayer.newMapId() : $gameMap.mapId();
		DataManager.restoreTileChanges(mapId);
		Tyruswoo.TileControl.Scene_Map_onMapLoaded.call(this);
	};

	//=============================================================================
	// DataManager
	// Tile data persistence by McKathlin.
	//=============================================================================

	// New method
	// Tile data persistence by McKathlin.
	DataManager.restoreTileChanges = function(mapId) {
		if (mapId <= 0 || !$gameTileChanges || !$gameTileChanges[mapId]) {
			return;
		}
		//console.log("Restoring tile changes...");
		var mapTileChanges = $gameTileChanges[mapId];
		for (var index in mapTileChanges) {
			$dataMap.data[index] = mapTileChanges[index];
		}
	};

	// Alias method
	// Tile data persistence by McKathlin.
	Tyruswoo.TileControl.DataManager_createGameObjects = DataManager.createGameObjects;
	DataManager.createGameObjects = function() {
		Tyruswoo.TileControl.DataManager_createGameObjects.call(this);
		$gameTileChanges = {};
	};

	// Alias method
	// Tile data persistence by McKathlin.
	Tyruswoo.TileControl.DataManager_makeSaveContents = DataManager.makeSaveContents;
	DataManager.makeSaveContents = function() {
		// A save data does not contain $gameTemp, $gameMessage, or $gameTroop.
		var contents = Tyruswoo.TileControl.DataManager_makeSaveContents.call(this);
		contents.tileChanges = $gameTileChanges;
		return contents;
	};

	// Alias method
	// Tile data persistence by McKathlin.
	Tyruswoo.TileControl.DataManager_extractSaveContents = DataManager.extractSaveContents;
	DataManager.extractSaveContents = function(contents) {
		Tyruswoo.TileControl.DataManager_extractSaveContents.call(this, contents);
		$gameTileChanges = contents.tileChanges || {};
	};
	
	//=============================================================================
	// PluginManager
	//=============================================================================
	
	// set_tile
	PluginManager.registerCommand(pluginName, "set_tile", args => {
		const linkedMap = $gameMap ? $gameMap.linkedMap() : null;
		const xyz = Tyruswoo.TileControl.extract_xyz_array(args, linkedMap);
		const relativity = args.relativity ? JSON.parse(args.relativity) : defaultRelativity;
		$gameMap.setTileId(xyz[0], xyz[1], xyz[2], args.tileId, relativity.clearUpperLayers, relativity.allowAutotiling);
	});
	
	// fill_tiles
	PluginManager.registerCommand(pluginName, "fill_tiles", args => {
		const linkedMap = $gameMap ? $gameMap.linkedMap() : null;
		const xyz = Tyruswoo.TileControl.extract_xyz_array(args, linkedMap);
		const relativity = args.relativity ? JSON.parse(args.relativity) : defaultRelativity;
		const filters = args.filters ? JSON.parse(args.filters) : defaultFilters;
		const region_filter = filters.region_filter ? JSON.parse(filters.region_filter) : defaultRegionFilter;
		const tileId_filter = (filters && filters.tileId_filter) ? JSON.parse(filters.tileId_filter) : defaultTileIdFilter;
		const tileIds_filter = (filters && tileId_filter && tileId_filter.tileIds_recognized) ? JSON.parse(tileId_filter.tileIds_recognized) : defaultTileIdsFilter;
		const z_coords_filter = (filters && tileId_filter && tileId_filter.z_coordinates_recognized) ? JSON.parse(tileId_filter.z_coordinates_recognized) : defaultTileIdZFilter;
		const area_filter = (filters && filters.area_filter) ? JSON.parse(filters.area_filter) : defaultAreaFilter;
		const creep = (filters && filters.creep) ? JSON.parse(filters.creep) : defaultCreep;
		const creep_options = (filters && creep && creep.creep_options) ? JSON.parse(creep.creep_options) : defaultCreepOptions;
		const creep_filters = (filters && creep && creep.creep_filters) ? JSON.parse(creep.creep_filters) : defaultCreepFilters;
		const creep_region_filter = (filters && creep && creep_filters && creep_filters.creep_region_filter) ? JSON.parse(creep_filters.creep_region_filter) : defaultCreepRegionFilter;
		const creep_tileId_filter = (filters && creep && creep_filters && creep_filters.creep_tileId_filter) ? JSON.parse(creep_filters.creep_tileId_filter) : defaultCreepTildIdFilter;
		const creep_tileIds_filter = (filters && creep && creep_filters && creep_tileId_filter && creep_tileId_filter.tileIds_recognized) ? JSON.parse(creep_tileId_filter.tileIds_recognized) : defaultCreepTileIdsFilter;
		const creep_z_coords_filter = (filters && creep && creep_filters && creep_tileId_filter && creep_tileId_filter.z_coordinates_recognized)
			? JSON.parse(creep_tileId_filter.z_coordinates_recognized) : defaultCreepTileIdZFilter;
		const creep_area_filter = (filters && creep && creep_filters && creep_filters.creep_area_filter) ? JSON.parse(creep_filters.creep_area_filter) : defaultCreepAreaFilter;
		$gameMap.fillTiles(xyz[0], xyz[1], xyz[2], args.tileId, relativity.clearUpperLayers, relativity.allowAutotiling, region_filter, tileIds_filter, z_coords_filter, area_filter, filters.distance, filters.hollow,
			filters.origin, creep.creep_distance, creep.creep_tileId, creep.creep_z_coordinate, creep_options.creepClearUpperLayers, creep_options.creepAllowAutotiling, creep_region_filter, creep_tileIds_filter,
			creep_z_coords_filter, creep_area_filter, creep_filters.creep_hollow);
	});

	// change_animation_frames
	PluginManager.registerCommand(pluginName, "change_animation_frames", args => {
		Tyruswoo.TileControl._tileAnimationFrames = args.tileAnimationFrames;
	});

	// link_map
	PluginManager.registerCommand(pluginName, "link_map", args => {
		const mapId = /^\d+$/.test(args.map) ? Number(args.map) :
			Tyruswoo.EventAI.getMapIdByName(args.map);
		$gameMap.linkMap(mapId);
	});

	// unlink_map
	PluginManager.registerCommand(pluginName, "unlink_map", args => {
		$gameMap.unlinkMap();
	});
	
	//=============================================================================
	// Game_Interpreter
	//=============================================================================

	// Alias method
	// Plugin Command
	Tyruswoo.TileControl.Game_Interpreter_command357 = Game_Interpreter.prototype.command357;
	Game_Interpreter.prototype.command357 = function(params) {
		// Keep track of the most recent event that used a plugin command.
		Tyruswoo.TileControl._pluginCommandEventId = this.eventId(); 
		return Tyruswoo.TileControl.Game_Interpreter_command357.call(this, params);
	};

	//=============================================================================
	// Tilemap - rmmz_core.js
	//=============================================================================

	// Replacement method
	// Updates the tilemap for each frame.
	Tilemap.prototype.update = function() {
		this.animationCount++;
		// Use animation frames as set by user.
		this.animationFrame = Math.floor(
			this.animationCount / Tyruswoo.TileControl._tileAnimationFrames); 
		for (const child of this.children) {
			// Thanks to Cris Litvin for helping us find and fix the bug on the line below!
			if (child && child.update) {
				child.update();
			}
		}
		if ($gameMap._needsTilemapRefresh) {
			// If a tile is set, then the tilemap needs to refresh.
			$gameMap._needsTilemapRefresh = false;
			this.refresh();
		}
	};

	//=============================================================================
	// Game_Player
	//=============================================================================
	
	// Replacement method
	Game_Player.prototype.triggerButtonAction = function() {
		if (Input.isTriggered("ok")) {
			if (Tyruswoo.TileControl.param.tileInfoOnOkPress && Input.isPressed("control")) {
				$gameMap.logTileInfo($gamePlayer.x, $gamePlayer.y);
			}
			if (this.getOnOffVehicle()) {
				return true;
			}
			this.checkEventTriggerHere([0]);
			if ($gameMap.setupStartingEvent()) {
				return true;
			}
			this.checkEventTriggerThere([0, 1, 2]);
			if ($gameMap.setupStartingEvent()) {
				return true;
			}
			if (Tyruswoo.TileControl.param.commonEventOnOkPress > 0) {
				$gameTemp.reserveCommonEvent(
					Tyruswoo.TileControl.param.commonEventOnOkPress);
				return true;
			}
		}
		return false;
	};

	//=============================================================================
	// Game_Map expansion
	//=============================================================================

	// Alias method
	// Tile data persistence by McKathlin.
	Tyruswoo.TileControl.Game_Map_initialize = Game_Map.prototype.initialize;
	Game_Map.prototype.initialize = function(mapId) {
		Tyruswoo.TileControl.Game_Map_initialize.call(this, mapId);
		this._needsTilemapRefresh = false;
	};

	// Alias method
	// Tile data persistence by McKathlin.
	Tyruswoo.TileControl.Game_Map_setup = Game_Map.prototype.setup;
	Game_Map.prototype.setup = function(mapId) {
		Tyruswoo.TileControl.Game_Map_setup.call(this, mapId);
		delete this._mapToEdit; // Remove save-bloating legacy member
		this.unlinkMap();
	};

	// New method
	// Link Map
	Game_Map.prototype.linkMap = function(mapId) {
		if (mapId == this.mapId()) {
			this.unlinkMap(); // Editing local map
			return;
		}
		if (!mapId || mapId < 0) {
			throw new Error("Can't link invalid map ID: " + mapId);
			return;
		}

		// If you're here, there's a remote map ID to link.
		this._linkedMapId = mapId;
	};

	// New method
	// Unlink Map
	Game_Map.prototype.unlinkMap = function() {
		this._linkedMapId = null;
	};

	// New method
	Game_Map.prototype.isTileEditingLocal = function() {
		return !this._linkedMapId;
	};

	// New method
	Game_Map.prototype.isTileEditingRemote = function() {
		return !this.isTileEditingLocal();
	};

	Game_Map.prototype.editingMapId = function() {
		return this._linkedMapId || this._mapId;
	};

	// New method
	Game_Map.prototype.linkedMapId = function() {
		return this._linkedMapId;
	};

	Game_Map.prototype.mapToEdit = function() {
		return Tyruswoo.TileControl.getEditingMap();
	};

	// New method
	Game_Map.prototype.linkedMap = function() {
		return this._linkedMapId ? this.mapToEdit() : null;
	};

	// New method
	Game_Map.prototype.isLinkedValid = function(x, y) {
		const map = this.mapToEdit();
		return x >= 0 && x < map.width && y >= 0 && y < map.height;
	};

	// New method
	Game_Map.prototype.linkedTilesetId = function() {
		return this.mapToEdit().tilesetId;
	};

	// New method
	// like Game_Map.prototype.autotileType,
	// except it works with the linked map, if any, or this map otherwise.
	Game_Map.prototype.linkedAutotileType = function(x, y, z) {
		const tileId = this.linkedTileId(x, y, z);
		return tileId >= 2048 ? Math.floor((tileId - 2048) / 48) : -1;
	};

	// New method
	// Like Game_Map.prototype.regionId,
	// except it works with the linked map, if any, or this map otherwise.
	Game_Map.prototype.linkedRegionId = function(x, y) {
		return this.isLinkedValid(x, y) ? this.linkedTileId(x, y, 5) : 0;
	};

	// New method
	// Like Game_Map.prototype.tileId,
	// except it works with the linked map, if any, or this map otherwise.
	Game_Map.prototype.linkedTileId = function(x, y, z) {
		const map = this.mapToEdit();
		const width = map.width;
		const height = map.height;
		return map.data[(z * height + y) * width + x] || 0;
	};

	// New method
	// Tile data persistence by McKathlin.
	Game_Map.prototype.getTileChangeData = function(mapId) {
		if (!mapId || mapId <= 0) {
			throw new Error("Invalid Map ID: " + mapId);
		}
		if (!$gameTileChanges[mapId]) {
			$gameTileChanges[mapId] = {};
		}
		return $gameTileChanges[mapId];
	};

	// New method
	// This method is useful as a script in a Conditional Branch.
	Game_Map.prototype.tileCodeAt = function(x, y, z) {
		const tileId = this.linkedTileId(x, y, z);
		return Tyruswoo.TileControl.tileCodeFromId(tileId);
	};

	// New method
	// This method is useful as a script in a Conditional Branch.
	Game_Map.prototype.tileCode = function(x, y, z) {
		return this.tileCodeAt(x, y, z);
	};
	
	// New method
	// This method is useful as a script in a Conditional Branch.
	// tileIdList may be an integer, a tileCode string, or an array of integers and/or tileCode strings.
	Game_Map.prototype.tileIdInList = function(tileIdList, xCoord, yCoord, z = 0) {
		var x = xCoord ? xCoord : $gamePlayer.x;
		var y = yCoord ? yCoord : $gamePlayer.y;
		var tileIdInList = false;
		if (tileIdList) {
			const tileId = this.linkedTileId(x, y, z);
			if (typeof tileIdList === 'number') {
				if (tileId === tileIdList) {
					tileIdInList = true;
				}
			} else if (typeof tileIdList === 'string') {
				tileIdList = this.readTileCode(tileIdList);
				if (tileId === tileIdList) {
					tileIdInList = true;
				}
			} else if (tileIdList.length) {
				for (var i = 0; i < tileIdList.length; i++) {
					if (typeof tileIdList[i] === 'string') {
						tileIdList[i] = this.readTileCode(tileIdList[i]);
					}
					if (tileId === tileIdList[i]) {
						tileIdInList = true;
					}
				}
			}
		}
		return tileIdInList;
	};

	// New method
	// This method is useful as a script in a Conditional Branch.
	// Looks a distance ahead of the player to determine the tile there at indicated z level.
	Game_Map.prototype.tileIdInListAhead = function(tileIdList, distance = 1, z = 0) {
		var x = $gamePlayer.x;
		var y = $gamePlayer.y;
		var d = $gamePlayer.direction();
		for (var i = 0; i < distance; i++) {
			x = this.xWithDirection(x, d); // Find tile in this direction.
			y = this.yWithDirection(y, d);
		}
		return this.tileIdInList(tileIdList, x, y, z);
	};
	
	// New method
	// This method is useful as a script in a Conditional Branch.
	Game_Map.prototype.tileAhead = function(tileIdList, distance = 1, z = 0) {
		return this.tileIdInListAhead(tileIdList, distance, z);
	};
	
	// New method
	// This method is useful as a script in a Conditional Branch.
	// autotileList may be an integer, a tileCode string, or an array of integers and/or tileCode strings.
	Game_Map.prototype.autotileInList = function(autotileList, xCoord, yCoord, z = 0) {
		var x = xCoord ? xCoord : $gamePlayer.x;
		var y = yCoord ? yCoord : $gamePlayer.y;
		var autotileInList = false;
		if (autotileList) {
			const autotile = this.autotileType(x, y, z);
			if (typeof autotileList === 'number') {
				if (autotile === autotileList) {
					autotileInList = true;
				}
			} else if (typeof autotileList === 'string') {
				autotileList = this.readTileCode(autotileList);
				autotileList = this.autotileTypeById(autotileList);
				if (autotile === autotileList) {
					autotileInList = true;
				}
			} else if (autotileList.length) {
				for (var i = 0; i < autotileList.length; i++) {
					if (typeof autotileList[i] === 'string') {
						autotileList[i] = this.readTileCode(autotileList[i]);
						autotileList[i] = this.autotileTypeById(autotileList[i]);
					}
					if (autotile === autotileList[i]) {
						autotileInList = true;
					}
				}
			}
		}
		return autotileInList;
	};
	
	// New method
	// This method is useful as a script in a Conditional Branch.
	// Looks a distance ahead of the player to determine the autotile type there at indicated z level.
	Game_Map.prototype.autotileInListAhead = function(autotileList, distance = 1, z = 0) {
		var x = $gamePlayer.x;
		var y = $gamePlayer.y;
		var d = $gamePlayer.direction();
		for (var i = 0; i < distance; i++) {
			x = this.xWithDirection(x, d); // Find tile in this direction.
			y = this.yWithDirection(y, d);
		}
		return this.autotileInList(autotileList, x, y, z);
	};
	
	// New method
	// This method is useful as a script in a Conditional Branch.
	Game_Map.prototype.autotileAhead = function(autotileList, distance = 1, z = 0) {
		return this.autotileInListAhead(autotileList, distance, z);
	};

	// New method
	Game_Map.prototype.logTileInfo = function(x, y) {
		// CAUTION: This log only works reliably for local tile changes.
		var output = "Tile Info at (" + x + "," + y + "):\n";
		const flags = this.tilesetFlags();
		for (z = 0; z <= 3; z++) {
			var tileId = this.linkedTileId(x, y, z);
			var a = this.linkedAutotileType(x, y, z);
			var tileCode = this.tileCodeAt(x, y, z);
			var flag = flags[tileId];
			var flag_text = flag + " (0b" + flag.toString(2) + ") (0x" + flag.toString(16) + ")";
			var text1 = "\x1b[30mTile \x1b[34m";
			var text2 = x + " " + y + " " + z;
			var text3 = "\x1b[30m tileId \x1b[34m" + tileId + "\x1b[30m Autotile Type \x1b[34m" + a;
			var text4 = "\x1b[30m Flag \x1b[34m" + flag_text;
			var text5 = "\x1b[30m Code \x1b[32m" + tileCode + "\n";
			output += text1 + text2 + text3 + text4 + text5;
		}
		output += "\x1b[30mSpecial properties from flags:";
		var text6 = "";
		if (this.isLadder(x, y)) {text6 += "\x1b[34m Ladder";}
		if (this.isBush(x, y)) {text6 += "\x1b[34m Bush";}
		if (this.isCounter(x, y)) {text6 += "\x1b[34m Counter";}
		if (this.isDamageFloor(x, y)) {text6 += "\x1b[34m DamageFloor";}
		if (this.isBoatPassable(x, y)) {text6 += "\x1b[34m BoatPassable";}
		if (this.isShipPassable(x, y)) {text6 += "\x1b[34m ShipPassable";}
		if (this.isAirshipLandOk(x, y)) {text6 += "\x1b[34m AirshipLandOk";}
		if (!text6.length) {output += "\x1b[30m None.";}
		output += text6 + "\n";
		var s = this.shadowBits(x, y);
		s = s + " (0b" + s.toString(2) + ")";
		const r = this.linkedRegionId(x, y);
		const t = this.terrainTag(x, y);
		output += "\x1b[30mShadow Bits: \x1b[34m" + s + "\n" + "\x1b[30mTile Region: \x1b[34m" + r + "\n" + "\x1b[30mTerrain Tag: \x1b[34m" + t;
		console.log(output);
	};

	// New method
	Game_Map.prototype.shadowBits = function(x, y) {
		return this.isLinkedValid(x, y) ? this.linkedTileId(x, y, 4) : 0;
	};

	// New method
	Game_Map.prototype.setTileId = function(x = 0, y = 0, z = 0, tileId = 0, clearUpperLayers = true, allowAutotiling = true) {
		x = Math.round(x);
		y = Math.round(y);
		z = Math.round(z);
		const map = this.mapToEdit();
		if (x < 0 || x >= map.width ||
		   y < 0 || y >= map.height) { //Prevent attempts to change tiles at locations outside the bounds of the map.
			return false;
		}
		tileId = this.readTileCode(tileId);
		if (typeof clearUpperLayers != 'boolean') {
			clearUpperLayers = (clearUpperLayers == 'true') ? true : false;
		}
		if (typeof allowAutotiling != 'boolean') {
			allowAutotiling = (allowAutotiling == 'true') ? true : false;
		}
		if (clearUpperLayers) {
			for (var zz = z + 1; zz < 4; zz++) {
				this.setExactTileId(x, y, zz, 0);
			}
		}
		const a = this.autotileTypeById(tileId);
		if (allowAutotiling && a > -1) {
			tileId = this.shapeAutotile(x, y, z, a) ? this.shapeAutotile(x, y, z, a) : tileId;
		}
		this.setExactTileId(x, y, z, tileId);
		if (allowAutotiling) {
			this.autotileNeighbor(x, y, z);
			this.autotileNeighbor(x, y - 1, z);
			this.autotileNeighbor(x + 1, y, z);
			this.autotileNeighbor(x, y + 1, z);
			this.autotileNeighbor(x - 1, y, z);
			this.autotileNeighbor(x - 1, y - 1, z);
			this.autotileNeighbor(x - 1, y + 1, z);
			this.autotileNeighbor(x + 1, y - 1, z);
			this.autotileNeighbor(x + 1, y + 1, z);
		}
	};

	// New method
	Game_Map.prototype.readTileCode = function(arg) {
		var tileId = 0;
		const codeLetter = typeof arg == "string" ? arg.toLowerCase().charAt(0) : null;
		var codeNumber = -1;
		var codeX = 0;
		var codeY = 0;
		if (typeof arg == "string") {
			if (arg.charAt(2) && arg.charAt(2) == ',') {
				codeX = parseInt(arg.charAt(1));
				codeY = parseInt(arg.substr(3));
				codeNumber = (codeY * TILE_SELECTOR_ROW_SIZE) + codeX;
			} else {
				codeNumber = parseInt(arg.substr(1));
			}
		}
		switch(codeLetter) {
			case 'a':
				let sheetNumber = Tyruswoo.TileControl.getSheetNumberOfCode(codeNumber);
				if (sheetNumber < 5) { // A1 through A4
					tileId = Tilemap.TILE_ID_A1 + codeNumber * 48;
				} else { // A5 tiles
					tileId = Tilemap.TILE_ID_A5 + codeNumber - 128;
				}
				break;
			case 'b':
				tileId = Tilemap.TILE_ID_B + codeNumber;
				break;
			case 'c':
				tileId = Tilemap.TILE_ID_C + codeNumber;
				break;
			case 'd':
				tileId = Tilemap.TILE_ID_D + codeNumber;
				break;
			case 'e':
				tileId = Tilemap.TILE_ID_E + codeNumber;
				break;
			default:
				tileId = arg;
		}
		return tileId;
	};

	// New method
	Game_Map.prototype.autotileTypeById = function(tileId) {
		return tileId >= Tilemap.TILE_ID_A1 ? Math.floor((tileId - Tilemap.TILE_ID_A1) / 48) : -1;
	};

	// New method
	Game_Map.prototype.setExactTileId = function(x, y, z, tileId) {
		if (!Tyruswoo.TileControl.tileIdExists(this.linkedTilesetId(), tileId)) {
			const tileSheetName = Tyruswoo.TileControl.getTileSheetNameOfTileId(tileId);
			console.warn("Tile ID %1 is on Sheet %2, which does not exist in Tileset %3.\nTile was not placed.".format(
			tileId, tileSheetName, this._tilesetId));
			return;
		}
		const map = this.mapToEdit();
		const mapId = this.editingMapId();
		const index = (z * map.height + y) * map.width + x;
		if (!$gameTileChanges[mapId]) {
			$gameTileChanges[mapId] = {};
		}
		$gameTileChanges[mapId][index] = tileId;
		map.data[index] = tileId;
		if (this.isTileEditingLocal()) {
			$dataMap.data[index] = tileId;
			// Every time a tile ID is set on this map, refresh.
			this._needsTilemapRefresh = true; 
		}
	};

	// New method
	// Use this when correct autotileType is already present on the map's tile, but it just needs to be re-shaped.
	Game_Map.prototype.autotileNeighbor = function(x, y, z) {
		const map = this.mapToEdit();
		if (x < 0 || x >= map.width || y < 0 || y >= map.height) {
			return;
		}
		for (var zz = z; zz < 4; zz++) {
			var a = this.linkedAutotileType(x, y, zz);
			if (a > -1) {
				const tileId = this.shapeAutotile(x, y, zz, a);
				this.setExactTileId(x, y, zz, tileId);
			}
		}
	};

	// New method
	// Use this when autotileType is known but not yet present on the map's tile.
	Game_Map.prototype.shapeAutotile = function(x, y, z, a) {
		if (a <= -1) { //Check if this is an autotile. If this is not an autotile, we must not try to shape it.
			console.log("Game_Map.shapeAutotile(): \x1b[31mWarning!\x1b[30m\nAt coords x", x, "y", y, "z", z, "attempted shapeAutotile function on autotileType", a, "which is not an autotile.");
			return false;
		}
		const map = this.mapToEdit();
		var n = false; // Keep track of whether there is a matching autotile neighboring in the given direction.
		var e = false;
		var s = false;
		var w = false;
		var nw = false;
		var ne = false;
		var se = false;
		var sw = false;
		const a_n = this.linkedAutotileType(x, y - 1, z); //Determine the autotile type of neighboring tiles.
		const a_e = this.linkedAutotileType(x + 1, y, z);
		const a_s = this.linkedAutotileType(x, y + 1, z);
		const a_w = this.linkedAutotileType(x - 1, y, z);
		const a_nw = this.linkedAutotileType(x - 1, y - 1, z);
		const a_ne = this.linkedAutotileType(x + 1, y - 1, z);
		const a_se = this.linkedAutotileType(x + 1, y + 1, z);
		const a_sw = this.linkedAutotileType(x - 1, y + 1, z);
		if (a_n == a || y - 1 < 0) {n = true;} //If the neighboring tile's autotile type matches the current tile's autotile type, then remember this.
		if (a_e == a || x + 1 >= map.width) {e = true;}
		if (a_s == a || y + 1 >= map.height) {s = true;}
		if (a_w == a || x - 1 < 0) {w = true;}
		if (a_nw == a || y - 1 < 0 || x - 1 < 0) {nw = true;}
		if (a_ne == a || y - 1 < 0 || x + 1 >= map.width) {ne = true;}
		if (a_se == a || y + 1 >= map.height || x + 1 >= map.width) {se = true;}
		if (a_sw == a || y + 1 >= map.height || x - 1 < 0) {sw = true;}
		const baseTileId = a * 48 + 2048;
		var tileId = baseTileId;
		if (Tilemap.isWaterfallTile(baseTileId)) { //Waterfall Animation Autotiles
			tileId += this.calculateWaterfallShape(e, w);
		} else if (Tilemap.isTileA3(baseTileId) || Tilemap.isWallSideTile(baseTileId)) { //Buildings Autotiles
			tileId += this.calculateAutotileNESWShape(n, e, s, w);
		} else { //All other autotiles.
			tileId += this.calculateAutotileShape(n, e, s, w, nw, ne, se, sw);
		}
		return tileId;
	};

	// New method.
	// This method accounts for all cardinal and diagonal autotiles.
	// Although the if and else statements below may seem strangely arranged, they coordinate with the
	// progression of the tileId and the corresponding autotile shapes. There are 48 tileIds for shapes,
	// but only 47 of the tileIds are needed to account for all possible shapes. Therefore, shapes range from 0-46.
	// n, e, s, w, nw, ne, se, sw: These boolean values indicate whether a matching autotile is located
	// in the corresponding direction from the autotile being shaped.
	Game_Map.prototype.calculateAutotileShape = function(n, e, s, w, nw, ne, se, sw) {
		var shape = 0;
		if (n && e && s && w) { //Shapes 0-15.
			if (!nw) shape += 1;
			if (!ne) shape += 2;
			if (!se) shape += 4;
			if (!sw) shape += 8;
		} else if (n && e && s && !w){ //Shapes 16-19.
			shape += 16;
			if (!ne) shape += 1;
			if (!se) shape += 2;
		} else if (!n && e && s && w){ //Shapes 20-23.
			shape += 20;
			if (!se) shape += 1;
			if (!sw) shape += 2;
		} else if (n && !e && s && w){ //Shapes 24-27.
			shape += 24;
			if (!sw) shape += 1;
			if (!nw) shape += 2;
		} else if (n && e && !s && w){ //Shapes 28-31.
			shape += 28;
			if (!nw) shape += 1;
			if (!ne) shape += 2;
		} else if (n && !e && s && !w){ //Shape 32.
			shape += 32;
		} else if (!n && e && !s && w){ //Shape 33.
			shape += 33;
		} else if (!n && e && s && !w){ //Shapes 34-35.
			shape += 34;
			if (!se) shape += 1;
		} else if (!n && !e && s && w){ //Shapes 36-37.
			shape += 36;
			if (!sw) shape += 1;
		} else if (n && !e && !s && w){ //Shapes 38-39.
			shape += 38;
			if (!nw) shape += 1;
		} else if (n && e && !s && !w){ //Shapes 40-41.
			shape += 40;
			if (!ne) shape += 1;
		} else if (!n && !e && s && !w){ //Shape 42.
			shape += 42;
		} else if (!n && e && !s && !w){ //Shape 43.
			shape += 43;
		} else if (n && !e && !s && !w){ //Shape 44.
			shape += 44;
		} else if (!n && !e && !s && w){ //Shape 45.
			shape += 45;
		} else if (!n && !e && !s && !w){ //Shape 46
			shape += 46;
			//tileId+47 (Shape 47) is not used; it is a duplicate of tileId+46 (Shape 46).
		}
		return shape;
	};

	// New method
	// For calculating the shape (appearance) of waterfall tiles.
	Game_Map.prototype.calculateWaterfallShape = function(e, w) {
		var shape = 0; //Shape 0.
		if (e && !w) { //Shape 1.
			shape += 1;
		} else if (!e && w) { //Shape 2.
			shape += 2;
		} else if (!e && !w) { //Shape 3.
			shape += 3;
		}
		return shape;
	};

	// New method
	// For calculating the shape (appearance) of building (roof and building edge) tiles (A3 tiles), and wall side tiles (certain A4 tiles).
	Game_Map.prototype.calculateAutotileNESWShape = function(n, e, s, w) {
		var shape = 0; //Shapes 0-15.
		if (!w) shape += 1;
		if (!n) shape += 2;
		if (!e) shape += 4;
		if (!s) shape += 8;
		return shape;
	};

	// New method
	Game_Map.prototype.fillTiles = function(x = 0, y = 0, z = 0, tileId = 0, clearUpperLayers = true, allowAutotiling = true, regions = [], tileIds_filter = [], tileIds_z_filter = [], area_filter, distance, hollow = false,
		origin, creepDistance = 0, creepTileId = null, creepZ = null, creepClearUpperLayers = true, creepAllowAutotiling = true,
		creepRegions = [], creepTileIds_filter = [], creepTileIds_z_filter = [], creepArea_filter, creepHollow = false) {
		x = Math.round(x);
		y = Math.round(y);
		z = Math.round(z);
		const map = this.mapToEdit();
		const width = map.width;
		const height = map.height;
		if (x < 0 || x >= width || y < 0 || y >= height) { //Prevent attempts to change tiles at locations outside the bounds of the map.
			return false;
		}
		tileId = this.readTileCode(tileId);
		if (typeof clearUpperLayers != 'boolean') {
			clearUpperLayers = (clearUpperLayers == "true") ? true : false;
		}
		if (typeof allowAutotiling != 'boolean') {
			allowAutotiling = (allowAutotiling == "true") ? true : false;
		}
		if (typeof hollow != 'boolean') {
			hollow = (hollow == "true") ? true : false;
		}
		creepDistance = Number(creepDistance);
		var tiles = [];
		for (var yy = 0; yy < height; yy++) { //Find all tile locations (x and y coordinates) on the current map.
			for (var xx = 0; xx < width; xx++) {
				const tile = {x:xx, y:yy};
				tiles.push(tile);
			}
		}
		if (regions && regions.length) { //Region(s) filter.
			const tilesInRegion = this.regionsFilter(tiles, regions);
			if (!tilesInRegion.length && tiles.length) {
				console.log("\x1b[31mTile Fill: Warning!\x1b[30m\nOf", tiles.length, "tiles entered into the Region(s) filter, none of the tiles passed the Region(s) filter.");
			}
			tiles = tilesInRegion;
		}
		if (tileIds_filter && tileIds_filter.length) { //Tile ID(s) filter.
			const tilesMatchingTileIdsFilter = this.tileIdsFilter(tiles, tileIds_filter, tileIds_z_filter);
			if (!tilesMatchingTileIdsFilter.length && tiles.length) {
				console.log("\x1b[31mTile Fill: Warning!\x1b[30m\nOf", tiles.length, "tiles entered into the Tile ID(s) filter, none of the tiles passed the Tile ID(s) filter.");
			}
			tiles = tilesMatchingTileIdsFilter;
		}
		if (area_filter) { //Area filter.
			const tilesInArea = this.areaFilter(tiles, area_filter, x, y);
			if (!tilesInArea.length && tiles.length) {
				console.log("\x1b[31mTile Fill: Warning!\x1b[30m\nOf", tiles.length, "tiles entered into the Area filter, none of the tiles passed the Area filter.");
			}
			tiles = tilesInArea;
		}
		if (distance && Number(distance)) { //Distance (adjacent) filter.
			const originTiles = [];
			const originTile = {x:x, y:y};
			originTiles.push(originTile);
			const tilesInDistance = this.distanceFilter(tiles, distance, originTiles);
			if (!tilesInDistance.length && tiles.length) {
				console.log("\x1b[31mTile Fill: Warning!\x1b[30m\nOf", tiles.length, "tiles entered into the Distance filter, none of the tiles passed the Distance filter.");
			}
			tiles = tilesInDistance;
		}
		if (hollow) { //Hollow filter.
			const tilesAtEdge = this.hollowFilter(tiles);
			tiles = tilesAtEdge;
		}
		if (origin && origin == "Never Fill") { //Origin filter: Never Fill
			const tilesWithoutOrigin = [];
			for (var t = 0; t < tiles.length; t++) {
				if ((tiles[t].x != x) || (tiles[t].y != y)) {
					tilesWithoutOrigin.push(tiles[t]);
				}
			}
			tiles = tilesWithoutOrigin;
		}
		if (origin && origin == "Always Fill (Before Creep)") { //Origin filter: Always Fill (Before Creep)
			var originAlreadyIncluded = false;
			for (var t; t < tiles.length; t++) {
				if ((tiles[t].x == x) && (tiles[t].y == y)) {
					originAlreadyIncluded = true;
				}
			}
			if (!originAlreadyIncluded) {
				const originTile = {x:x, y:y};
				tiles.push(originTile);
			}
		}
		if (tileId) { //If there is a tileId, then fill tiles with tileId.
			for (var t = 0; t < tiles.length; t++) {
				this.setTileId(tiles[t].x, tiles[t].y, z, tileId, clearUpperLayers, allowAutotiling);
			}
		}
		if (creepDistance) { //Creep
			if (creepTileId != null && creepTileId != "") {
				creepTileId = this.readTileCode(creepTileId);
			} else {
				creepTileId = tileId;
			}

			if (creepZ != null && creepZ != "") {
				creepZ = Math.round(creepZ);
			} else {
				creepZ = z;
			}

			if (typeof creepClearUpperLayers != 'boolean') {
				creepClearUpperLayers = (creepClearUpperLayers == "true");
			}
			if (typeof creepAllowAutotiling != 'boolean') {
				creepAllowAutotiling = (creepAllowAutotiling == "true");
			}
			if (typeof creepHollow != 'boolean') {
				creepHollow = (creepHollow == "true");
			}
			var creepTiles = [];
			for (var yy = 0; yy < height; yy++) { //Find all tile locations (x and y coordinates) on the current map, as long as locations are not in the Fill space.
				for (var xx = 0; xx < width; xx++) {
					var inFillTiles = false;
					for (var t = 0; t < tiles.length; t++) {
						if ((tiles[t].x == xx) && tiles[t].y == yy) {inFillTiles = true;}
					}
					if (!inFillTiles) {
						const tile = {x:xx, y:yy};
						creepTiles.push(tile);
					}
				}
			}
			if (creepRegions && creepRegions.length) { //Creep Region(s) filter.
				const creepTilesInRegion = this.regionsFilter(creepTiles, creepRegions);
				if (!creepTilesInRegion.length && creepTiles.length) {
					console.log("\x1b[31mTile Fill: Warning!\x1b[30m\nOf", creepTiles.length, "tiles entered into the Creep Region(s) filter, none of the tiles passed the Creep Region(s) filter.");
				}
				creepTiles = creepTilesInRegion;
			}
			if (creepTileIds_filter && creepTileIds_filter.length) { //Creep Tile ID(s) filter.
				const creepTilesMatchingTileIdsFilter = this.tileIdsFilter(creepTiles, creepTileIds_filter, creepTileIds_z_filter);
				if (!creepTilesMatchingTileIdsFilter.length && creepTiles.length) {
					console.log("\x1b[31mTile Fill: Warning!\x1b[30m\nOf", creepTiles.length, "tiles entered into the Creep Tile ID(s) filter, none of the tiles passed the Creep Tile ID(s) filter.");
				}
				creepTiles = creepTilesMatchingTileIdsFilter;
			}
			if (creepArea_filter) { //Creep Area filter.
				const creepTilesInArea = this.areaFilter(creepTiles, creepArea_filter, x, y);
				if (!creepTilesInArea.length && creepTiles.length) {
					console.log("\x1b[31mTile Fill: Warning!\x1b[30m\nOf", creepTiles.length, "tiles entered into the Creep Area filter, none of the tiles passed the Creep Area filter.");
				}
				creepTiles = creepTilesInArea;
			}
			if (creepDistance) { //Creep Distance (adjacent) filter.
				const excludeOrigin = true;
				const creepTilesInDistance = this.distanceFilter(creepTiles.concat(tiles), creepDistance, tiles, excludeOrigin); //Find all creepTiles that are creepDistance away from any of the Fill tiles.
				if (!creepTilesInDistance.length && creepTiles.length) {
					console.log("\x1b[31mTile Fill: Warning!\x1b[30m\nOf", creepTiles.length, "tiles entered into the Creep Distance filter, none of the tiles passed the Creep Distance filter.");
				}
				creepTiles = creepTilesInDistance;
			}
			if (creepHollow) { //Creep Hollow filter.
				const creepTilesAtEdge = this.hollowFilter(creepTiles);
				creepTiles = creepTilesAtEdge;
			}
			if (creepTileId !== null) { //If there is a creepTildId, then apply creep.
				for (var t = 0; t < creepTiles.length; t++) {
					this.setTileId(creepTiles[t].x, creepTiles[t].y, creepZ, creepTileId, creepClearUpperLayers, creepAllowAutotiling);
				}
			}
		}
		if (origin && origin == "Always Fill (After Creep)") { //Origin filter: Always Fill (After Creep)
			this.setTileId(x, y, z, tileId, clearUpperLayers, allowAutotiling);
		}
	};
	
	// New method
	Game_Map.prototype.regionsFilter = function(tiles, regions) {
		for (var i = 0; i < regions.length; i++) {
			regions[i] = Number(regions[i]);
		}
		const tilesInRegion = [];
		for (var t = 0; t < tiles.length; t++) {
			if (regions.indexOf(this.linkedRegionId(tiles[t].x, tiles[t].y)) >= 0) {
				tilesInRegion.push(tiles[t])
			}
		}
		return tilesInRegion;
	};
	
	// New method
	Game_Map.prototype.tileIdsFilter = function(tiles, tileIds_filter, tileIds_z_filter) {
		for (var i = 0; i < tileIds_filter.length; i++) {
			tileIds_filter[i] = this.readTileCode(tileIds_filter[i]);
		}
		const tilesMatchingTileIdsFilter = [];
		for (var t = 0; t < tiles.length; t++) {
			var match = false;
			for (var zz = 0; zz < 4; zz++) {
				if (tileIds_z_filter) {
					if (zz == 0 && tileIds_z_filter.z0 && tileIds_z_filter.z0 == "Skip") {continue;}
					if (zz == 1 && tileIds_z_filter.z1 && tileIds_z_filter.z1 == "Skip") {continue;}
					if (zz == 2 && tileIds_z_filter.z2 && tileIds_z_filter.z2 == "Skip") {continue;}
					if (zz == 3 && tileIds_z_filter.z3 && tileIds_z_filter.z3 == "Skip") {continue;}
				}
				const tileId_1 = this.linkedTileId(tiles[t].x, tiles[t].y, zz);
				for (var i = 0; i < tileIds_filter.length; i++) {
					const tileId_2 = tileIds_filter[i];
					if (this.isTileMatch(tileId_1, tileId_2)) {
						match = true;
					}
				}
			}
			if (match) {
				tilesMatchingTileIdsFilter.push(tiles[t])
			}
		}
		return tilesMatchingTileIdsFilter;
	};
	
	// New method
	Game_Map.prototype.areaFilter = function(tiles, area_filter, origin_x, origin_y) {
		const x1 = Number(area_filter.x1) ? Number(area_filter.x1) + origin_x : origin_x;
		const y1 = Number(area_filter.y1) ? Number(area_filter.y1) + origin_y : origin_y;
		const x2 = Number(area_filter.x2) ? Number(area_filter.x2) + origin_x : origin_x;
		const y2 = Number(area_filter.y2) ? Number(area_filter.y2) + origin_y : origin_y;
		const tilesInArea = [];
		for (var t = 0; t < tiles.length; t++) {
			for (var j = y1; j <= y2; j++) { //Find all tiles in this area.
				for (var i = x1; i <= x2; i++) {
					if (i == tiles[t].x && j == tiles[t].y) {tilesInArea.push(tiles[t])}
				}
			}
		}
		return tilesInArea;
	};
	
	// New method
	Game_Map.prototype.distanceFilter = function(tiles, distance, originTiles, excludeOrigin = false) { //Find all tiles that are distance away from originTiles.
		distance = Number(distance);
		const tilesInDistance = [];
		const tilesAlreadyScanned = [];
		var tilesToScan = originTiles;
		for (var d = 0; d <= distance; d++) {
			const tilesToCheckNext = [];
			for (var s = 0; s < tilesToScan.length; s++) {
				const tilesAdjacent = [];
				for (var t = 0; t < tiles.length; t++) {
					if ((tilesToScan[s].x == tiles[t].x) && (tilesToScan[s].y == tiles[t].y)) {
						var pushTile = true;
						if (excludeOrigin) {
							for (var i = 0; i < originTiles.length; i++) {
								if ((tilesToScan[s].x == originTiles[i].x) && (tilesToScan[s].y == originTiles[i].y)) {pushTile = false;}
							}
						}
						if (pushTile) {
							tilesInDistance.push(tilesToScan[s]);
						}
						tilesAdjacent.push({x:tilesToScan[s].x+1, y:tilesToScan[s].y});
						tilesAdjacent.push({x:tilesToScan[s].x-1, y:tilesToScan[s].y});
						tilesAdjacent.push({x:tilesToScan[s].x, y:tilesToScan[s].y+1});
						tilesAdjacent.push({x:tilesToScan[s].x, y:tilesToScan[s].y-1});
					}
				}
				tilesAlreadyScanned.push(tilesToScan[s]);
				for (var a = 0; a < tilesAdjacent.length; a++) {
					var inCurrentScan = false; //If tile is currently being scanned, we do not need to scan it again.
					for (var i = 0; i < tilesToScan.length; i++) {
						if ((tilesAdjacent[a].x == tilesToScan[i].x) && (tilesAdjacent[a].y == tilesToScan[i].y)) {
							inCurrentScan = true;
						}
					}
					var inPastScan = false; //If the tile has already been scanned, we do not need to scan it again.
					for (var i = 0; i < tilesAlreadyScanned.length; i++) {
						if ((tilesAdjacent[a].x == tilesAlreadyScanned[i].x) && (tilesAdjacent[a].y == tilesAlreadyScanned[i].y)) {
							inPastScan = true;
						}
					}
					var inTilesToCheckNext = false; //Only allow a tile to have one instance in tilesToCheckNext.
					for (var i = 0; i < tilesToCheckNext.length; i++) {
						if ((tilesAdjacent[a].x == tilesToCheckNext[i].x) && (tilesAdjacent[a].y == tilesToCheckNext[i].y)) {
							inTilesToCheckNext = true;
						}
					}
					if (!inCurrentScan && !inPastScan && !inTilesToCheckNext) {
						tilesToCheckNext.push(tilesAdjacent[a]);
					}
				}
			}
			tilesToScan = tilesToCheckNext;
		}
		return tilesInDistance;
	};
	
	// New method
	Game_Map.prototype.hollowFilter = function(tiles) { //Find all tiles that are at the edge of tiles.
		const tilesAtEdge = [];
		for (var t = 0; t < tiles.length; t++) {
			var n = false;
			var e = false;
			var s = false;
			var w = false;
			var ne = false;
			var se = false;
			var sw = false;
			var nw = false;
			for (var i = 0; i < tiles.length; i++) {
				if (tiles[t].x == tiles[i].x) {
					if (tiles[t].y == tiles[i].y + 1) {
						n = true;
					} else if (tiles[t].y == tiles[i].y - 1) {
						s = true;
					}
				}
				if (tiles[t].y == tiles[i].y) {
					if (tiles[t].x == tiles[i].x + 1) {
						w = true;
					} else if (tiles[t].x == tiles[i].x - 1) {
						e = true;
					}
				}
				if (tiles[t].y == tiles[i].y + 1) { //Tile to the north.
					if (tiles[t].x == tiles[i].x + 1) {
						nw = true;
					} else if (tiles[t].x == tiles[i].x - 1) {
						ne = true;
					}
				}
				if (tiles[t].y == tiles[i].y - 1) { //Tile to the south.
					if (tiles[t].x == tiles[i].x + 1) {
						sw = true;
					} else if (tiles[t].x == tiles[i].x - 1) {
						se = true;
					}
				}
			}
			if (!n || !e || !s || !w || !ne || !se || !sw || !nw) {
				tilesAtEdge.push(tiles[t]);
			}
		}
		return tilesAtEdge;
	};

	// New method
	Game_Map.prototype.isTileMatch = function(tileId_1, tileId_2) {
		const a1 = this.autotileTypeById(tileId_1);
		const a2 = this.autotileTypeById(tileId_2);
		if (((a1 == a2) && (a1 != -1)) || tileId_1 == tileId_2) {
			return true;
		}
		return false;
	};

})();
