import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import WeatherCard from "../popup/WeatherCard";
import { Card } from "@material-ui/core";
import { getStoredOptions, LocalStorageOptions } from "../utils/storage";
import "./contentScript.css";
import { Messages } from "../utils/messages";

const App: React.FC<{}> = () => {
  const [options, setOptions] = useState<LocalStorageOptions | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [tempScale, setTempScale] = useState<string>("metric");

  useEffect(() => {
    getStoredOptions().then((options) => {
      setOptions(options);
      setIsActive(options.overlay);
      setTempScale(options.tempScale);
    });
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((mesg) => {
      if (mesg === Messages.TOGGLE_OVERLAY) {
        setIsActive(!isActive);
      }
      if (mesg === Messages.TOGGLE_TEMPSCALE) {
        getStoredOptions().then((options) => {
          setOptions(options);
          setTempScale(options.tempScale == "metric" ? "imperial" : "metric");
        });
      }
    });
  }, [isActive]);

  return (
    <>
      {isActive && (
        <Card className="overlayCard">
          <WeatherCard
            city={options.homeCity}
            units={options.tempScale}
            onDelete={() => setIsActive(!options.overlay)}
          ></WeatherCard>
        </Card>
      )}
    </>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
