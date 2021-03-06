<!--
*** Thanks for checking out this README Template. If you have a suggestion that would
*** make this better, please fork the repo and create a pull request or simply open
*** an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
***
***
***
*** To avoid retyping too much info. Do a search and replace for the following:
*** github_username, repo, twitter_handle, email
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
<!--[![PayPal](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=E6RKPR34SH6CU)-->

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/mengistristen/openchess">
    <img src="public/images/openchess_logo.png" alt="Logo" width="80" height="80">
  </a>

  <h2 align="center">openchess</h2>

  <p align="center">
    A simple API for playing games that use an 8x8 checkerboard
    <br />
    <!-- PUT S3 DOCS HERE <a href="https://github.com/mengistristen/openchess"><strong>Explore the docs »</strong></a>
    <br />-->
    <br />
    <!-- PUT S3 DEMO HERE <a href="https://github.com/github_username/repo">View Demo</a>
    ·-->
    <a href="https://github.com/mengistristen/openchess/issues">Report Bug</a>
    ·
    <a href="https://github.com/mengistristen/openchess/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

-   [About the Project](#about-the-project)
    -   [Built With](#built-with)
-   [Getting Started](#getting-started)
-   [How To Play](#how-to-play)
    -   [Moving Pieces](#moving-pieces)
    -   [Manually Ending A Game](#manually-ending-a-game)
-   [Customization and Options](#customization-and-options)
    -   [Game Type](#game-type)
    -   [Board Options](#board-options)
        -   [Size](#size)
        -   [Color](#color)
        -   [Frame](#frame)
    -   [Piece Options](#piece-options)
        -   [Style](#style)
        -   [Margin](#margin)
    -   [Coordinates](#coordinates)
-   [Roadmap](#roadmap)
-   [Contributing](#contributing)
-   [License](#license)
-   [Contact](#contact)

<!-- ABOUT THE PROJECT -->

## About The Project

openchess is a simple api that takes http requests and returns svg images representing the current state of the game being played.

<!--[![Product Name Screen Shot][product-screenshot]](https://example.com)-->

### Built With

-   [JavaScript](https://www.javascript.com/)
-   [Express.js](https://expressjs.com/)
-   [Redis](https://redislabs.com/)

<!-- GETTING STARTED -->

## Getting Started

openchess is a public REST API. That means **no authorization** is needed.

There are endless ways to use openchess, we encourage you experiment, just remember to report any [issues](https://github.com/mengistristen/openchess/issues) you come across!

Before you can send commands and recieve svgs you must start a game, do so with a `GET` request to the following URI:
<img src="https://user-images.githubusercontent.com/33167265/90324202-903bb100-df20-11ea-8655-4603c5e16a6d.png"/>

If successful, you will get a json object with your new game key. 
This key will be used in all request that involve this game, so make sure to save it.
You can start as many games as you like, just keep in mind that latency may be introduced if we recieve too much traffic.

The above request is the most straightforward way to begin a game of **chess**. But what if you don't want to play chess? Here's how you [change the game type](#game-type).

## How To Play

### Moving Pieces

### Manually Ending A Game
    
openchess games automatically expire after **1 hour of inactivity**. However, if you feel so inclined to remove a game earlier you may do so with a `GET` request to the following URI:
<img src="https://user-images.githubusercontent.com/33167265/90324114-63d36500-df1f-11ea-9d3c-c2795750e861.png"/>

## Customization and Options
<!--
1. [Game Type](#game-type)
2. [Board Size](#board-size)
3. [Board Color](#board-color)
4. [Board Frame](#board-frame)
5. [Piece Style](#piece-style)
6. and [Piece Margin](#piece-margin)
-->

### Game Type
Despite the name, openchess actually supports playing any game that uses an 8x8 checkerboard (that we've implemented). Here's how you do it:

<img src="https://user-images.githubusercontent.com/33167265/90324230-d98c0080-df20-11ea-9427-31b98c0f556b.png"/>

Here is the list of all supported games:

| Game | game_id |
| --- | --- |
| [Chess](https://en.m.wikipedia.org/wiki/Chess) | `chess` |
| [Checkers/Draughts](https://en.m.wikipedia.org/wiki/Draughts) | `checkers` |
| [Breakthrough](https://en.wikipedia.org/wiki/Breakthrough_(board_game)) | `breakthrough` |

<!---   #### Checkers
```http
openchess.com/new%game=checkers
```

-   #### Chess
```http
openchess.com/new%game=chess
```

-   #### Checkers
```http
openchess.com/new%game=checkers
```
-   #### [Absorption](https://boardgamegeek.com/boardgame/63114/absorption)
```http
openchess.com/new%game=absorption
```
-   #### [0·1 (Zero Point One)](https://boardgamegeek.com/boardgame/114307/01-zero-point-one)
```http
openchess.com/new%game=zpo
```-->
We are always looking to add new games to openchess, if you have a suggestion for one please leave it [here](https://github.com/mengistristen/openchess/issues) or better yet, do it yourself by [contributing](#contributing).

### Board Options

#### Size
Board size is changed with the `bsize` attribute. 
```bash
curl oc.justinboehnen.com/new?bsize=400
```

#### Color
Board color is changed with the `blight` and `bdark` attributes, representing the light and dark tones of the board respectively.
```bash
curl oc.justinboehnen.com/new?blight=%23ecf0f1&bdark=rgb(66,66,66)
```
Hex color codes and RGB values are both valid inputs.
- The hash (`#`) in hex codes must be encoded as **%23**.
- RGB values must be sent in the format `rgb(R,G,B)`

#### Frame

### Piece Options

#### Style

#### Margin
Piece margin (the spacing between pieces) is changed with the `pmargin` attribute. 
```bash
curl oc.justinboehnen.com/new?pmargin=10
```

### Coordinates

## Roadmap

See the [open issues](https://github.com/mengistristen/openchess/issues) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Tristen Mengis - [LinkedIn](https://www.linkedin.com/mwlite/in/tristen-mengis-81444813b) - [@thetmeng](https://twitter.com/thetmeng) - [email](mailto:tristen.mengis@oit.edu)

Justin Boehnen - [LinkedIn](https://www.linkedin.com/in/justinboehnen/) - [@boehnenj](https://twitter.com/boehnenj) - [email](mailto:justinboehnen@gmaim.com) - [website](https://www.justinboehnen.com)

<!-- ACKNOWLEDGEMENTS

## Acknowledgements

-   []()
-   []()
-   []()
-->

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/mengistristen/openchess.svg?style=flat-square
[contributors-url]: https://github.com/mengistristen/openchess/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/mengistristen/openchess.svg?style=flat-square
[forks-url]: https://github.com/mengistristen/openchess/network/members
[stars-shield]: https://img.shields.io/github/stars/mengistristen/openchess.svg?style=flat-square
[stars-url]: https://github.com/mengistristen/openchess/stargazers
[issues-shield]: https://img.shields.io/github/issues/mengistristen/openchess.svg?style=flat-square
[issues-url]: https://github.com/mengistristen/openchess/issues
[license-shield]: https://img.shields.io/github/license/mengistristen/openchess.svg?style=flat-square
[license-url]: https://github.com/mengistristen/openchess/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
