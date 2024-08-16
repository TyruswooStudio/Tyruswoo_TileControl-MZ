# Tyruswoo Tile Control for RPG Maker MZ

Change tiles dynamically during gameplay!

Great for farming, secret passages, making water or lava flow, mining, enemies that break walls, placing furniture, etc!

## Plugin Commands
```
Set Tile                        Modify the tileID at selected location.
 - Tile ID                      Use a tile code (see below) or exact ID.
 - X,Y,Z Coordinates            Select the location of the tile to modify.
    > X                         On map, X coordinate at which to set tile.
    > Y                         On map, Y coordinate at which to set tile.
    > Z                         Z layer to affect. z 0-3 for layers 1-4.
 - Relativity & Options         Relative position of coords, and options.
    > Relativity Mode           Absolute, or relative to player or event.
       * Event ID               If relative to event: The event's ID.
       * Party Member           If relative to player: Leader or follower.
       * Orientational Shift    Change loc based on character's direction.
    > Allow Autotiling          True for autotiling. False for exact.
    > Clear Upper Layers        True to erase upper z layers. False: Keep.

Fill Tiles                      Modify multiple tiles. Allows filters.
 - Tile ID                      Fill tile code (see below) or exact ID.
 - X,Y,Z Coordinates            Select the fill origin location.
    > X                         On map, X coordinate of origin.
    > Y                         On map, Y coordinate of origin.
    > Z                         Z layer to affect. z 0-3 for layers 1-4.
 - Relativity & Options         Relative position of coords, and options.
    > Relativity Mode           Absolute, or relative to player or event.
       * Event ID               If relative to event: The event's ID.
       * Party Member           If relative to player: Leader or follower.
       * Orientational Shift    Relative shift loc by character's direction.
          - Forward Shift       + to shift forward. - to shift backward.
          - Rightward Shift     + to shift rightward. - to shift leftward.
    > Allow Autotiling          True for autotiling. False for exact.
    > Clear Upper Layers        True to erase upper z layers. False: Keep.
 - Filters                      Only fill tiles that pass all filters.
    > Region(s) Filter          Region(s) allowed for fill.
    > Tile ID(s) Filter         Only allow fill at certain Tile ID(s).
       * Tile ID(s) Recognized  Tile ID(s) at which fill can occur.
       * Z Coord(s) Recognized  Z coords (layers) at which fill can occur.
    > Area Filter               Area to allow fill.
       * X1                     X coordinate of first corner of fill area.
       * Y1                     Y coordinate of first corner of fill area.
       * X2                     X coordinate of other corner of fill area.
       * Y2                     Y coordinate of other corner of fill area.
    > Distance Filter           Distance from origin to allow fill.
    > Hollow Filter             True for hollow. False for regular fill.
    > Origin Filter             Never fill origin tile, or always fill.
    > Creep                     Append unique tile changes, beyond fill.
       * Creep Distance                Distance creep spreads.
       * Creep Tile ID                 Tile code (see below) of creep.
       * Creep Z Coordinate            Z layer to affect with creep.
       * Creep Options                 Options for creep.
          - Allow Autotiling           True for autotiling. False: exact.
          - Clear Upper Layers         True to erase upper z layers.
       * Creep Filters                 Only creep on tiles passing filters.
          - Creep Region(s) Filter     Region(s) onto which creep can go.
          - Creep TileID(s) Filter     Only allow creep on these tile IDs.
             > Tile ID(s) Recognized   Tile ID(s) onto which creep can go.
             > Z Coord(s) Recognized   Z layers to search for tile ID(s).
          - Creep Area Filter          Area onto which creep can go.
             > X1                      X coordinate of 1st corner (creep).
             > Y1                      Y coordinate of 1st corner (creep).
             > X2                      X coordinate of 2nd corner (creep).
             > Y2                      Y coordinate of 2nd corner (creep).
          - Creep Hollow Filter        True: Hollow. False: Regular creep.

Change Animation Frames         During game, change tile animation speed.
 - Tile Animation Frames        Frames for tile animations. Lower is faster.
```

## Plugin parameters
```
Tile Animation Frames        Frames for tile animations of animated tiles.
                             Lower is faster. Higher is slower. Default: 30.

Common Event on OK Press     Common event to begin when player presses the
                             OK button (Enter).

Tile Info on OK Press        True: Output tile info to console window when
                             playtester holds Ctrl then presses Enter (OK).
                             (Tip: When playtesting, press F12 to open the
                             console window.) Default: True.
```

## Script calls (Advanced)
```
$gameMap.tileCodeAt(x,y,z)
    Returns the "Tx,y" ("Letter X comma Y" or "Tab X comma Y") tile code
    at location (x,y,z) where x is the x coordinate,y is the y coordinate,
    and z is the z layer (0, 1, 2, or 3). Tile code returns as a string.
    - For example, from the default Overworld tileset, ocean returns the
      string "A0,0".
    - This script call is useful in a conditional branch.
      For example, if the player is in the  Overworld and the Overworld is
      using the default tilset, you can use a conditional branch with the
      following script to check whether the player is currently in a
      temperate/deciduous forest tile (at z=1, which is editor layer 2):
      > Conditional Branch (Script):
        $gameMap.tileCodeAt($gamePlayer.x, $gamePlayer.y, 1) == "A4,2"

$gameMap.tileCode(x,y,z)
    Same as $gameMap.tileCodeAt(x,y,z).

$gameMap.tileMatch(tileIdList, x, y, z)
$gameMap.tileIdInList(tileIdList, x, y, z)
$gameMap.autotileInList(autotileList, x, y, z)
$gameMap.tileIdInListAhead(tileIdList, distance, z)
$gameMap.tileAhead(tileIdList, distance, z)
$gameMap.autotileInListAhead(autotileList, distance, z)
$gameMap.autotileAhead(autotileList, distance, z)
    These script calls return true if the tile at the location matches one
    in the list; false otherwise. They're useful for conditional branches.
    - tileIdList and autotileList are arrays that can
      contain numbers or tile codes (as strings).
    - tileAhead and autotileAhead looks in the direction the player is facing,
      and finds whichever tile is located there at the z level indicated.
    - $gameMap.tileIdInListAhead() is the same as $gameMap.tileAhead().
    - Likwise, $gameMap.autotileInListAhead() is the same as
      $gameMap.autotileAhead().
    Example use case: When the player is pushing an event, you can look
    at the tile(s) 2 steps ahead of the player's current location, to
    determine what happens when the player tries to push the event.
```

## Basics of how to use this plugin
1. To change a tile while a player is playing your game, you can create an
   event that runs the plugin command Set Tile.
2. In the Set Tile command, type the Tile ID code for your desired tile.
   Use one of the three types of Tile ID codes (described below).
3. Choose the coordinates (X, Y, and Z) at which to change the tile.
   Keep in mind that the coordinates are by default relative to the event
   that is running this plugin command.
4. You can modify the settings in Relativity & Options, if you like.
   If you want absolute coordinates, or coorcinates relative to the player,
   you can change this here. If you want to keep upper z layers, you can do
   that, too. (Keep autotiling true unless you need to set an autotile
   to an exact value.)
5. When you activate the event, the tile at the coordinates you have chosen
   will change to the Tile ID you chose!

## Tile ID Codes
   There are three types of tile ID codes. You can use any of these tile
   codes for the "Tile ID" of plugin commands.

### Tx,y

Where T is the tab, x is the x position in the tab's tileset,
and y is the y position in the tab's tileset. Also known as
"Letter X comma Y" or "Tab X comma Y".

- This tile code is determined by the Tab (A, B, C, D, or E)
  and the (x,y) position of the desired tile within the tilset.
- For example, in tab A, the top left tile is A0,0 (which in
  the Overworld tileset is ocean).
- For example, in the default Overworld tileset, use tile code
  A3,1 for a whirlpool.
- For example, in the default Overworld tileset, use tile code
  B2,1 for a pyramid.
- You can use tile code B0,0 to erase any tile.
  
  The Tx,y tile ID code assumes that you have a full tileset in
  Tab A. This includes A1, A2, A3, A4, and A5. If a plugin
  command calls for a Tile ID belonging to an absent tile sheet,
  the console will log a warning, and the tile will not be placed.
  If you do not have a full tileset in Tab A, refer to the table
  below for the first Y value of each A tilesheet:
  
| Tilesheet | First Y value (top of its sheet) |
|-----------|----------------------------------|
|        A1 |  0                               |
|        A2 |  2                               |
|        A3 |  6                               |
|        A4 | 10                               |
|        A5 | 16                               |

Tabs B, C, D, and E (if present) have a single tilesheet each,
so finding their x,y coordinates is straightforward.

### Tn

Where T is the tab, and n is the number of the tile when
counting tiles from left to right, starting with zero. Also
known as "Letter Number" or "Tab Number".
- Tip: This numbering scheme is the same as how regions are
  numbered and displayed in the regions (R) tab, so you can
  use the regions tab to help with counting tiles.
- For example, in tab A, the first tile is A0 (which in the
  Overworld tileset is ocean).
- For example, in the default Overworld tileset, use tile code
  A11 for a whirlpool.
- For example, in the default Overworld tileset, use tile code
  B10 for a pyramid.
- You can use tile code B0 to erase any tile.

  The Tn tile ID code assumes that you have a full
  tileset in Tab A. This includes A1, A2, A3, A4, and A5. If you
  do not have a full tileset in Tab A, refer to the tile code
  cheat sheet below:

  1st code of A1:   0
  1st code of A2:  16
  1st code of A3:  48
  1st code of A4:  80
  1st code of A5: 128

### Exact

For this tile code, you must enter the exact tile ID number used in
RPG Maker's inner code.

- Tip: The exact tile ID code is only needed if you want to
  set an autotile to an exact shape (ignoring autotiling).
  Note that to ignore autotiling, the "Allow Autotiling"
  option must be Off (or false) in the plugin command
  arguments. (Note: Using exact tile ID for autotiles is
  similar to using Shift+Click in the editor.)
- Tip: To find the exact tile ID code, while playtesting,
  open the console window by pressing F12 on the keyboard.
  Then, move the party leader character on top of a tile
  with the exact tile appearance you want. Then, hold Ctrl
  while you press Enter. The exact tile IDs at that location
  will be logged to the console.
- For example, in the default Overworld tileset, use tile code
  2048 for ocean.
- For example, in the default Overworld tileset, use tile code
  2576 for a whirlpool.
- For example, in the default Overworld tileset, use tile code
  10 for a pyramid.
- You can use tile code 0 to erase any tile.

## Advanced uses for this plugin:
- Creep! Creep is calculated after the main fill command has finished. At
   that time, you can add an "appendage" of any tile ID. Creep will by
   default be the same tile ID as the fill; however, you can also define a
   unique tile ID for the creep. The creep can go any distance you like,
   but by default only goes 1 tile further than the fill. Creep uses the
   tiles already filled as a large "origin" from which creep can expand.
    - Creep is especially useful if you want to have fluid that spreads,
      such as flowing water, flowing lava, or flowing poison. However, creep
      can be used with any tile.
    - Note that creep spreads in cardinal directions (north, south, east,
      and west), but not in diagonal directions.
- Exact tiles! To set an exact tile, you must go to the plugin command's
   options argument, and change Allow Autotiling to false. Then, if you are
   making an exact shape of an autotile, you must know the exact tile ID
   of that shape of the autotile. To find this, create a map with that shape
   of autotile present, then go into playtesting mode. While standing on the
   autotile, hold Ctrl and press OK (Enter) to output the info of the tiles
   at that location to the console window. Press F12 to open the console
   window to see the output info. Use the exact tile ID in the plugin
   command. Setting exact tiles is useful when you want a particular shape
   of an autotile. Note that exact tiles are similar to using Shift+Click
   in the editor, because autotiling is prevented and any autotile can be
   placed anywhere.
- Hollow filter! You can use this to help you achieve interesting and
  appealing fill shapes! Hollow shapes do respect diagonals. (This is
  different compared to creep or the distance filter, because both creep
  and the distance filter only recognize cardinally neigboring tiles.
  The hollow filter recognizes neighboring tiles both cardinally and
  diagonally.
- Common Event on OK Press! (And the `$gameMap.tileCodeAt(x,y,z)` script!)
  You can use this plugin parameter to define a common event that happens
  when the player presses the OK button (Enter for keyboard users). If you
  want the OK press to detect a tile, you can have the common event use the
  `$gameMap.tileCodeAt(x,y,z)` script call in a conditional branch (see
  example above), so that you know what tiles are located at the player's
   position.
    - If you want to change a tile, it is usually easier to use the Fill
      plugin command, because it has filters. If you use the Fill plugin
      command, you often don't need to use the `$gameMap.tileCodeAt(x,y,z)`
      script call, because the Fill command has a Tile ID(s) Filter.
      However, if you don't want to change a tile, but just want to know
      what tile code is present, the $gameMap.tileCodeAt(x,y,z) script call
      is useful.
    - You could combine the $gameMap.tileCodeAt(x,y,z) plugin command with
      scripts `$gameMap.xWithDirection(x,d)` and `$gameMap.yWithDirection(y,d)`
      to get the tile code in front of the player, or relative to an event.
      However, if you want to modify a tile depending on the player's
      direction, you could also use the Orientational Shift relativity
      option to cause a tile to be modified in front of the player.
    - You could also use a conditional branch to check whether the player
      has a certain item (tool) required to modify a tile.

## Reference of how tile information is tracked in RPG Maker

### Exact tile ID reference

| Tile ID | Location on Tabs   |
|---------|--------------------|
|       0 | Beginning of Tab B |
|     256 | Beginning of Tab C |
|     512 | Beginning of Tab D |
|     768 | Beginning of Tab E |
|    1536 | Beginning of Tab A portion A5 |
|    2048 | Beginning of Tab A portion A1. Beginning of autotiles. |
|    2816 | Beginning of Tab A portion A2 |
|    4352 | Beginning of Tab A portion A3 |
|    5888 | Beginning of Tab A portion A4 |
|    8192 | This is the maximum Tile ID |

### z Layers

| z | Layer             |
|---|-------------------|
| 0 | Layer 1 in editor |
| 1 | Layer 2 in editor |
| 2 | Layer 3 in editor |
| 3 | Layer 4 in editor |
| 4 | ShadowBits        |
| 5 | Regions           |

### Shadow Bits

| Bit   | Corner                                 |
|-------|----------------------------------------|
| Bit 1 | Northwest (upper left) corner shadow   |
| Bit 2 | Northeast (upper right) corner shadow  |
| Bit 3 | Southwest (lower left) corner shadow   |
| Bit 4 | Southeast (lower right) corner shadow  |

### Tile Flags

May be expressed as decimal (base 10); binary (base 2, prefix of
`0b`, values of 0 or 1); or hexidecimal (base 16, prefix of `0x`, values
of 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, a, b, c, d, e, or f).

| Bit    |  Meaning                                                    |
|--------|-------------------------------------------------------------|
|  Bit 1 |  Impassible south side of tile. (Hint: 2 key on Numpad.)    |
|  Bit 2 |  Impassible west side of tile. (Hint: 4 key on Numpad.)     |
|  Bit 3 |  Impassible east side of tile. (Hint: 6 key on Numpad.)     |
|  Bit 4 |  Impassible north side of tile. (Hint: 8 key on Numpad.)    |
|  Bit 5 |  This is a star (*) tile, and so does not affect passage.   |
|  Bit 6 |  This is a ladder.                                          |
|  Bit 7 |  This is a bush.                                            |
|  Bit 8 |  This is a counter.                                         | 
|  Bit 9 |  This is damage floor.                                      |
| Bit 10 | Impassible to boats.                                        |
| Bit 11 | Impassible to ships.                                        |
| Bit 12 | Airships cannot land here (or if bits 1-4 all impassible.)  |
| Bit 13 | Terrain Tags 1 to 7 (in binary).                            |
| Bit 14 | Terrain Tags 1 to 7 (in binary).                            |
| Bit 15 | Terrain Tags 1 to 7 (in binary).                            |

### Visit [**Tyruswoo.com**](https://www.tyruswoo.com) to [ask for help](https://www.tyruswoo.com/contact-us/), [donate](https://www.tyruswoo.com/donate/), or browse more of our [plugins](https://www.tyruswoo.com/downloads/rpg-maker-plugin-downloads/).

## Version History

v1.0  8/30/2020
- Tile Control released for RPG Maker MZ!

v1.1  9/12/2020
- Fixed interpretation of boolean parameters and command arguments in
  some instances.
- Updates Tile Control to work with `Tyruswoo_FollowerControl` v1.3 and
  higher.
- Cleaned up the code so that repetitions are handled more concisely.

v2.0  11/8/2021
- Fixed bug that was keeping A5 tiles from being placed properly
  when written in the form `Ax,y`
- Fixed crash on plugin command calling for a Tile ID from an absent
  tile sheet. Now a warning is logged instead.
- Fixed bug that kept the map from loading properly in some projects.
  Thanks to Cris Litvin for reporting it and helping us debug!

v3.0  3/10/2023
- Link Map allows events to change distant maps' tiles.
- Added the following tile-checking script calls:
    - `$gameMap.tileIdInList(tileIdList, x, y, z)`
    - `$gameMap.tileIdInListAhead(tileIdList, distance, z)`
    - `$gameMap.tileAhead(tileIdList, distance, z)`
    - `$gameMap.autotileInList(autotileList, x, y, z)`
    - `$gameMap.autotileInListAhead(autotileList, distance, z)`
    - `$gameMap.autotileAhead(autotileList, distance, z)`
- Fixed bug where tile changes were lost if the player opened the
  field menu mid-event.

**v3.0.1** - 8/30/2023
- This plugin is now free and open source under the [MIT license](https://opensource.org/license/mit/).

> **Remember, only you can build your dreams!**
> 
> *Tyruswoo*
