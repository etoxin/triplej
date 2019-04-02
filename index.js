#!/usr/bin/env node

const program = require("commander");
const fetch = require("node-fetch");
const isNull = require("lodash/isnull");
const chalk = require("chalk");
const pad = require("lodash/pad");
const sample = require("lodash/sample");
const flatMapDeep = require("lodash/flatMapDeep");

const ABC_API_ENDPOINT =
  "https://music.abcradio.net.au/api/v1/plays/search.json?station=triplej";
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

program.version("1.0.6").parse(process.argv);

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
  let padding = `${result.artist} - ${result.title}`.length;

  padding = padding < 19 ? 19 : padding;

  header = pad(header, padding, line);
  footer = pad(footer, padding, line);

  console.log(chalk.hex(RED)(header));
  console.log(output);
  console.log(chalk.hex(RED)(footer));
};

Plays();
