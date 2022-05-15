import {
  getStoredCities,
  getStoredOptions,
  setStoredCities,
  setStoredOptions,
} from "../utils/storage";
import { fetchOWData } from "../utils/api";

chrome.runtime.onInstalled.addListener(() => {
  setStoredCities([]);
  setStoredOptions({
    tempScale: "metric",
    homeCity: "",
    overlay: false,
  });

  chrome.contextMenus.create({
    contexts: ["selection"],
    title: "Add city to weather extension",
    id: "weatherExtension",
  });

  chrome.alarms.create({
    periodInMinutes: 60,
  });
});

const badge = () => {
  getStoredOptions().then((options) => {
    if (options.homeCity == "") {
      return;
    }

    fetchOWData(options.homeCity, options.tempScale).then((data) => {
      const temp = Math.round(data.main.temp);
      const symbol = options.tempScale == "metric" ? "\u2103" : "\u2109";
      chrome.action.setBadgeText({
        text: `${temp}${symbol}`,
      });
    });
  });
};

chrome.alarms.onAlarm.addListener(() => {
  badge();
});

chrome.contextMenus.onClicked.addListener((event) => {
  getStoredCities().then((cities) => {
    setStoredCities([...cities, event.selectionText]);
  });
});

badge();
