import React, { useEffect, useState } from "react";
import { Grid, Box, InputBase, IconButton, Paper } from "@material-ui/core";
import {
  Add as AddIcon,
  PictureInPicture as PictureInPictureIcon,
} from "@material-ui/icons";
import { createRoot } from "react-dom/client";
import "./popup.css";
import "typeface-roboto";
import WeatherCard from "./WeatherCard/WeatherCard";
import {
  getStoredCities,
  setStoredCities,
  setStoredOptions,
  getStoredOptions,
  LocalStorageOptions,
} from "../utils/storage";
import { Messages } from "../utils/messages";

const App: React.FC<{}> = () => {
  const [cities, setCities] = useState<string[]>([]);
  const [cityInput, setCityInput] = useState<string>("");
  const [options, setOptions] = useState<LocalStorageOptions | null>(null);

  useEffect(() => {
    getStoredCities().then((cities) => setCities(cities));
    getStoredOptions().then((options) => setOptions(options));
  }, []);

  const handleCityButtonClick = () => {
    if (cityInput === "") {
      return;
    }
    const updatedCities = [...cities, cityInput];
    setStoredCities(updatedCities).then(() => setCities(updatedCities));
    setCityInput("");
  };

  const handleCityDeleteButtonClick = (index: number) => {
    cities.splice(index, 1);
    const updatedCities = [...cities];
    setStoredCities(updatedCities).then(() => setCities(updatedCities));
  };

  if (!options) {
    return null;
  }

  const handleToggleOverlay = () => {
    chrome.tabs.query(
      {
        active: true,
      },
      (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, Messages.TOGGLE_OVERLAY);
        }
      }
    );
  };

  const handleTempScaleButtonClick = () => {
    const updatedOptions: LocalStorageOptions = {
      ...options,
      tempScale: options.tempScale === "metric" ? "imperial" : "metric",
    };
    setStoredOptions(updatedOptions).then(() => {
      setOptions(updatedOptions);
    });
    chrome.tabs.query(
      {
        active: true,
      },
      (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, Messages.TOGGLE_TEMPSCALE);
        }
      }
    );
  };

  return (
    <Box mx="8px" my="8px">
      <Grid container justifyContent="space-evenly">
        <Grid item>
          <Paper>
            <Box py="5px" px="15px">
              <InputBase
                placeholder="Add a city name"
                value={cityInput}
                onChange={(event) => setCityInput(event.target.value)}
              />
              <IconButton onClick={handleCityButtonClick}>
                <AddIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box py="3px">
              <IconButton onClick={handleTempScaleButtonClick}>
                {options.tempScale === "metric" ? "\u2103" : "\u2109"}
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box py="4px">
              <IconButton onClick={handleToggleOverlay}>
                <PictureInPictureIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {options.homeCity != "" && (
        <WeatherCard
          city={options.homeCity}
          units={options.tempScale}
        ></WeatherCard>
      )}
      {cities.map((city, index) => (
        <WeatherCard
          city={city}
          key={index}
          units={options.tempScale}
          onDelete={() => {
            handleCityDeleteButtonClick(index);
          }}
        ></WeatherCard>
      ))}
      <Box height="16px" />
    </Box>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
