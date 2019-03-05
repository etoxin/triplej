#!/usr/bin/env node

const program = require('commander');
const fetch = require("node-fetch");
const _ = require('lodash');

const ABC_API_ENDPOINT = "https://music.abcradio.net.au/api/v1/plays/search.json?station=triplej";

program
  .version('1.0.2')
  .parse(process.argv);

const Service_PlaySearch = () => {
  return fetch(ABC_API_ENDPOINT)
    .then(res => res.json())
    .catch(error => {
      console.log("Error", error);
    });
};

const Plays = async () => {
  const data = await Service_PlaySearch();
  const songs = data.items.map(item => {
    return {
      title: item.recording.title,
      artist: item.recording.artists[0].name,
      release: !_.isNull(item.release) ? item.release.title : '',
    }
  });

  const result = _.first(songs);
  const output = `-----------\n${result.title}\n${result.artist}\n${result.release}\n-----------`;

  console.log(output);

};

Plays();
