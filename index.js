#!/usr/bin/env node

const program = require("commander");
const fetch = require("node-fetch");
const isNull = require("lodash.isnull");
const chalk = require("chalk");
const pad = require("lodash.pad");
const sample = require("lodash.sample");

const ABC_API_ENDPOINT =
  "https://music.abcradio.net.au/api/v1/plays/search.json?station=triplej";
const RED = "#E03125";
let header = " Now Playing ";
let footer = " On Triple J ";
const line = sample([" ", "─", "=", "-=", "░", "♥ ", "■", "■ ", "😊  "]);

program.version("1.0.5").parse(process.argv);

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
