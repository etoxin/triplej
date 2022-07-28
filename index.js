#!/usr/bin/env node

const program = require("commander");
const fetch = require("node-fetch");
const chalk = require("chalk");
const isNull = require("lodash/isnull");
const get = require("lodash/get");
const pad = require("lodash/pad");
const sample = require("lodash/sample");
const flatMapDeep = require("lodash/flatMapDeep");
const asciify = require('asciify-image');

let header = " Now Playing ";

const config = {
  triplej: {
    footer: ' On Triple J ',
    api: 'https://music.abcradio.net.au/api/v1/plays/search.json?station=triplej',
    color: '#E03125'
  },
  doublej: {
    footer: ' On Double J ',
    api: 'https://music.abcradio.net.au/api/v1/plays/search.json?station=doublej',
    color: '#ffffff'
  },
  unearthed: {
    footer: ' On Unearthed ',
    api: 'https://music.abcradio.net.au/api/v1/plays/search.json?station=unearthed',
    color: '#458325'
  },
}

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
  { symbol: "✨  ", rarity: 2 },
  { symbol: "♥ ", rarity: 1 }
];

const line = sample(
  flatMapDeep(lineCollection, line => Array(line.rarity).fill(line.symbol))
);

program
  .version("1.0.7")
  .option("-d --doublej [Double J]", "Get the current song being played on Double J")
  .option("-u --unearthed [Triple J Unearthed]", "Get the current song being played on Triple J Unearthed")
  .option("-a --artwork [Disable Artwork]", "Disable the artwork")
  .parse(process.argv);

const selected = program.doublej ? config.doublej
               : program.unearthed ? config.unearthed
               : config.triplej;

let footer = selected.footer;

const Service_PlaySearch = () => {
  return fetch(selected.api)
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
      time: item.played_time,
      artwork: get(item, 'release.artwork[0].url') || get(item, 'recording.artwork[0].url'),
    };
  });

  const result = songs[0];

  const output = `${chalk.bold(result.artist)} - ${chalk.bold(result.title)}`;
  const songString = `${result.artist} - ${result.title}`;
  let padding = songString.length;

  padding = padding < 19 ? 19 : padding;

  header = pad(header, padding, line);
  footer = pad(footer, padding, line);

  const imageWidth = header.length / 2;
  const options = {
    fit:    'box',
    width:  imageWidth,
    height: imageWidth
  }

  console.log(' ')
  console.log(chalk.hex(selected.color)(header));
  console.log(output);
  console.log(chalk.hex(selected.color)(footer));

  if(!program.artwork && result.artwork) {
    asciify(result.artwork, options, function (err, asciified) {
      console.log(asciified);
      console.log(' ')
    });
  }
  console.log(' ')
};

Plays();
