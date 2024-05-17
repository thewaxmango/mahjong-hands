tenhou-log
==========

Scripts for downloading and aggregating logs from [Tenhou online riichi mahjong](http://tenhou.net/3)

If you're using chrome, you'll need selenium (`pip install selenium`), and the latest version of [Chromedriver](http://chromedriver.chromium.org/) that matches your Chrome version.

Thanks to [MaxB](https://github.com/maxb/tenhou-log) and [NegativeMjark](https://github.com/NegativeMjark/tenhou-log) for their earlier work on this.

*Setting Up*
---

If you don't already have Python, download it from [the downloads page.](https://www.python.org/downloads/) Versions 3.6.x and 3.7.x will definitely work.

[Download this repo](https://github.com/ApplySci/tenhou-log/archive/master.zip) and unzip it somewhere memorable.

Open a terminal or command prompt in the "tenhou-log-master" folder and enter `pip install -r requirements.txt`. This will install all the python dependencies. If you're going to extract logs from Chrome, you'll need to download a version of [ChromeDriver](http://chromedriver.chromium.org/) that matches your version of Chrome. Put chromedriver.exe somewhere in your PATH.

Finally, open TenhouConfig.py in a text editor and change the fields to be suitable for you. You can then run the `getlogs.py` file to download your logs, and run `analyseMyLogs.py` to see some stats. Every time you run `getlogs.py`, the new games that are found will be added. It can find the last 40 games played, so if you want complete stats, you will need to run `getlogs.py` at least once every 40 games.


*Retrieving and archiving logs*
---

XML game logs are stored in a 7-zipped pickle file.

`getlogs.py`
---------------
Finds games to download from Firefox localStorage (by default). It also (on request, not default) tries Chrome localStorage. If directly accessing the localStorage file fails (leveldb access for Chrome fails on windows), it automates opening the browser and gets the localStorage that way: this is ugly but effective. It can also take game IDs or game URLs from the command line. It then calls `tenhoulogs.py` with the list of game IDs. There are several command-line options to change the behaviour:

| Arguments  | Explanation |
| ------------- | ------------- |
| -u MyID / --user MyID  | User IDs, space-separated  |
| -nf / --no-firefox  | Skips checking Firefox for logs  |
| -c / --chrome | Checks Chrome for logs |
| --urls "url1, url2" | URLs of games to load |
| --ids "id1, id2" | IDs of games to load |
| --json | Output JSON to the command line |
| --wait | Wait for 5 minutes before updating, eg to ensure Dropbox is synched |
| --force | Update all games, even if they've already been retrieved |
| --no-web | Do not retrieve games from the web |

`tenhoulogs.py`
------------------
Cycles over a bunch of ids, downloads them, and adds them into the store. Stores all those logs in a 7zipped pickle file. Also dumps out a csv file of game results with R-rate changes, which can be combined with the game logs from [nodocchi.moe](https://nodocchi.moe/tenhoulog/) to chart your progress.

`TenhouConfig.py`
------------------
**You must customise this file** to specify your own Tenhou account name(s) and the directory you want the output files to be stored in.

---

*Analysing logs*
---

`analyseMyLogs.py`
--------------
Cycles through one or more log compilations (as created by `tenhoulogs.py`) and aggregate results. Uses `TenhouConfig.py` for account names and work directory, `TenhouDecoder.py` to process the log files, and `TenhouYaku.py` to produce the summary stats. There are some command line arguments to change the behaviour:

| Arguments  | Explanation |
| ------------- | ------------- |
| -w / --winner | Only count yaku for when the user wins the hand (default) |
| -l / --loser | Only count yaku for when the user lost the hand |
| -a / --all | Count yaku from all hands |
| --since yyyymmdd | Only include games since this date |
| --before yyyymmdd | Only include games before this date |

`TenhouDecoder.py`
---------------------
Processes a raw tenhou xml log file, and turns into a python object that can be examined easily. Uses `Data.py` to dump out objects as plain text.

`TenhouYaku.py`
---------------------
Counts the frequency of each yaku in winning hands. Now customisable so that you can specify only the yaku in your own winning hands, or in all winning hands, or only hands you dealt into. It now also logs outcomes of hands where you riichid - how many points you won or lost on that hand, how the hand resolved (you won, you dealt in, draw, someone else tsumod, someone else dealt into someone else and you were just a bystander).

`translations.js`
---------------------
Taken directly from the [Tenhou UI translator](https://gitlab.com/zefiris/tenhou-english-ui), and used for the yaku names. Keeps it consistent with the translator plugins, and allows the possibility to switch languages (not yet implemented here)

`Data.py`
----------
dumps out complicated objects as plain text

`searchLogs.py`
---------------------
Outputs all game IDs that suit the search criteria. By default, this will just output all of the games, but you can filter them using command line arguments:

| Arguments  | Explanation |
| ------------- | ------------- |
| --since yyyymmdd | Only include games since this date, exclusive |
| --before yyyymmdd | Only include games before this date, inclusive |
| --player "Player1 Player2" | Only include games where at least one of these players played |
| --lobby "0" | Only include games played in this lobby |
| --yaku "Ryanpeikou" | Only include games where a player scored this yaku |
| --sanma | Only include three-player games |
| --no-sanma | Only include four-player games. Mutually exclusive with --sanma |

---

Log Format
==========

```
<SHUFFLE>
 - seed         Seed for RNG for generating walls and dice rolls.
 - ref          ?
<GO>            Start of game
 - type             Lobby type.
 - lobby            Lobby number.
<UN>            User list or user reconnect
 - n[0-3]           Names for each player as URLEncoded UTF-8.
 - dan              List of ranks for each player.
 - rate             List of rates for each player.
 - sx               List of sex ("M" or "F") for each player.
<BYE>           User disconnect
 - who              Player who disconnected.
<TAIKYOKU>      Start of round
 - oya              Dealer
<INIT>          Start of hand
 - seed             Six element list:
                        Round number,
                        Number of combo sticks,
                        Number of riichi sticks,
                        First dice minus one,
                        Second dice minus one,
                        Dora indicator.
 - ten              List of scores for each player     
 - oya              Dealer
 - hai[0-3]         Starting hands as a list of tiles for each player.
<[T-W][0-9]*>   Player draws a tile.
<[D-G][0-9]*>   Player discards a tile.
<N>             Player calls a tile.
 - who              The player who called the tile.
 - m                The meld.
<REACH>         Player declares riichi.
 - who              The player who declared riichi
 - step             Where the player is in declaring riichi:
                        1 -> Called "riichi"
                        2 -> Placed point stick on table after discarding.
 - ten              List of current scores for each player.
<DORA>          New dora indicator.
 - hai              The new dora indicator tile.
<AGARI>         A player won the hand
 - who              The player who won.
 - fromwho          Who the winner won from: themselves for tsumo, someone else for ron.
 - paoWho           If yakuman with Pao, who was liable.
 - hai              The closed hand of the winner as a list of tiles.
 - m                The open melds of the winner as a list of melds.
 - machi            The waits of the winner as a list of tiles.
 - doraHai          The dora as a list of tiles.
 - dorahaiUra       The ura dora as a list of tiles.
 - yaku             List of yaku and their han values.
                            0 -> tsumo
                            1 -> riichi
                            2 -> ippatsu
                            3 -> chankan
                            4 -> rinshan
                            5 -> haitei
                            6 -> houtei
                            7 -> pinfu
                            8 -> tanyao
                            9 -> ippeiko
                        10-17 -> fanpai
                        18-20 -> yakuhai
                           21 -> daburi
                           22 -> chiitoi
                           23 -> chanta
                           24 -> itsuu
                           25 -> sanshokudoujin
                           26 -> sanshokudou
                           27 -> sankantsu
                           28 -> toitoi
                           29 -> sanankou
                           30 -> shousangen
                           31 -> honrouto
                           32 -> ryanpeikou
                           33 -> junchan
                           34 -> honitsu
                           35 -> chinitsu
                           52 -> dora
                           53 -> uradora
                           54 -> akadora
 - yakuman          List of yakuman.
                           36 -> renhou
                           37 -> tenhou
                           38 -> chihou
                           39 -> daisangen
                        40,41 -> suuankou
                           42 -> tsuiisou
                           43 -> ryuuiisou
                           44 -> chinrouto
                        45,46 -> chuurenpooto
                        47,48 -> kokushi
                           49 -> daisuushi
                           50 -> shousuushi
                           51 -> suukantsu
 - ten              Three element list:
                        The fu points in the hand,
                        The point value of the hand,
                        The limit value of the hand:
                            0 -> No limit
                            1 -> Mangan
                            2 -> Haneman
                            3 -> Baiman
                            4 -> Sanbaiman
                            5 -> Yakuman
 - ba               Two element list of stick counts:
                        The number of combo sticks,
                        The number of riichi sticks.
 - sc               List of scores and the changes for each player.
 - owari            Final scores including uma at the end of the game.
<RYUUKYOKU>     The hand ended with a draw
 - type             The type of draw: 
                        "yao9"   -> 9 ends
                        "reach4" -> Four riichi calls
                        "ron3"   -> Triple ron
                        "kan4"   -> Four kans
                        "kaze4"  -> Same wind discard on first round
                        "nm"     -> Nagashi mangan.
 - hai[0-3]         The hands revealed by players as a list of tiles.
 - ba               Two element list of stick counts:
                        The number of combo sticks,
                        The number of riichi sticks.
 - sc               List of scores and the changes for each player.
 - owari            Final scores including uma at the end of the game.
```

Meld Format
-----------

```
    CHI

     0                   1
     0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    | Base Tile | |   |   |   | |   |
    |    and    |0| T2| T1| T0|1|Who|   
    |Called Tile| |   |   |   | |   |
    +-----------+-+---+---+---+-+---+

        Base Tile and Called Tile:
            ((Base / 9) * 7 + Base % 9) * 3 + Chi
        T[0-2]:
            Tile[i] - 4 * i - Base * 4
        Who:
            Offset of player the tile was called from.
        Tile[0-2]:
            The tiles in the chi.
        Base:
            The lowest tile in the chi / 4.
        Called:
            Which tile out of the three was called.

    PON or CHAKAN

     0                   1
     0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |  Base Tile  |   |   |K|P| |   |
    |     and     | 0 | T4|A|O|0|Who|
    | Called Tile |   |   |N|N| |   |
    +---------------+-+---+-+-+-+---+

        Base Tile and Called Tile:
            Base * 3 + Called
        T4:
            Tile4 - Base * 4
        PON:
            Set iff the meld is a pon.
        KAN:
            Set iff the meld is a pon upgraded to a kan.
        Who:
            Offset of player the tile was called from.
        Tile4:
            The tile which is not part of the pon.
        Base:
            A tile in the pon / 4.
        Called:
            Which tile out of the three was called.

    KAN

     0                   1
     0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |   Base Tile   |           |   |
    |      and      |     0     |Who|
    |   Called Tile |           |   |
    +---------------+-+---+-+-+-+---+

        Base Tile and Called Tile:
            Base * 4 + Called
        Who:
            Offset of player the tile was called from or 0 for a closed kan.
        Base:
            A tile in the kan / 4. 
        Called:
            Which tile out of the four was called.

``` 
