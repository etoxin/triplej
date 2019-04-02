#!/usr/bin/env node

const program = require("commander");
const fetch = require("node-fetch");
const chalk = require("chalk");
const open = require("open");
const isNull = require("lodash/isnull");
const pad = require("lodash/pad");
const sample = require("lodash/sample");
const flatMapDeep = require("lodash/flatMapDeep");

const ABC_API_ENDPOINT =
  "https://music.abcradio.net.au/api/v1/plays/search.json?station=triplej";
const SPOTIFY_URL = "https://open.spotify.com/search/results/";
const APPLE_URL = 'https://itunes.apple.com/au/artist/search/';
const RED = "#E03125";
let header = " Now Playing ";
let footer = " On Triple J ";

const lineCollection = [
  { symbol: "■", rarity: 25 },
  { symbol: "─", rarity: 25 },
  { symbol: "=", rarity: 20 },
  { symbol: "-=", rarity: 20 },
  { symbol: "✦", rarity: 20 },
  { symbol: "<>", rarity: 20 },
  { symbol: "░", rarity: 15 },
  { symbol: " ", rarity: 10 },
  { symbol: "/\\", rarity: 10 },
  { symbol: "↯ ", rarity: 10 },
  { symbol: "★ ", rarity: 10 },
  { symbol: "■ ", rarity: 5 },
  { symbol: "∆ ", rarity: 5 },
  { symbol: "😊  ", rarity: 3 },
  { symbol: "♥ ", rarity: 1 }
];

const line = sample(
  flatMapDeep(lineCollection, line => Array(line.rarity).fill(line.symbol))
);

program
  .version("1.0.7")
  .option("-s --spotify [Spotify]", "Open song in Spotify")
  .option("-a --apple [Apple Music]", "Open song in Apple Music")
  .parse(process.argv);

const Service_PlaySearch = () => {
  return fetch(ABC_API_ENDPOINT)
    .then(res => res.json())
    .catch(error => console.log("Error", error));
};

const Plays = async () => {
  const data = await Service_PlaySearch();
  const songs = data.items.map(item => {
    return {
      title: item.recording.title,
      artist: item.recording.artists[0].name,
      release: !isNull(item.release) ? item.release.title : "",
      time: item.played_time
    };
  });

  const result = songs[0];

  const output = `${chalk.bold(result.artist)} - ${chalk.bold(result.title)}`;
  const songString = `${result.artist} - ${result.title}`;
  let padding = songString.length;

  padding = padding < 19 ? 19 : padding;

  header = pad(header, padding, line);
  footer = pad(footer, padding, line);

  console.log(chalk.hex(RED)(header));
  console.log(output);
  console.log(chalk.hex(RED)(footer));

  if (program.spotify) {
    open(SPOTIFY_URL + escape(songString));
  }

  if (program.apple) {
    open(APPLE_URL + encodeURIComponent(songString));
  }
};

Plays();
