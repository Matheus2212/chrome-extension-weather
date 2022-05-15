import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./options.css";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
} from "@material-ui/core";
import "typeface-roboto";
import {
  getStoredOptions,
  setStoredOptions,
  LocalStorageOptions,
} from "../utils/storage";

type FormState = "ready" | "saving";

const App: React.FC<{}> = () => {
  const [options, setOptions] = useState<LocalStorageOptions | null>(null);
  const [formState, setFormState] = useState<FormState>("ready");

  useEffect(() => {
    getStoredOptions().then((options) => setOptions(options));
  }, []);

  const homeCityChange = (homeCity: string) => {
    setOptions({
      ...options,
      homeCity: homeCity,
    });
  };

  const handleOverlayChange = (overlay: boolean) => {
    setOptions({
      ...options,
      overlay: overlay,
    });
  };

  const handleSaveButtonClick = () => {
    setFormState("saving");
    setStoredOptions(options)
      .then(() => {
        setTimeout(function () {
          setFormState("ready");
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (!options) {
    return null;
  }

  const isFieldDisabled = formState == "ready" ? false : true;

  return (
    <Box mx="10%" my="2%">
      <Card>
        <CardContent>
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <Typography variant="h4">Options Page</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">Home city name</Typography>
              <TextField
                onChange={(event) => homeCityChange(event.target.value)}
                fullWidth
                placeholder="Enter a home city name"
                value={options.homeCity}
                disabled={isFieldDisabled}
              ></TextField>
            </Grid>
            <Grid item>
              <Typography variant="body1">Auto Overlay</Typography>
              <Switch
                color="primary"
                checked={options.overlay}
                onChange={(event, checked) => handleOverlayChange(checked)}
                disabled={isFieldDisabled}
              />
            </Grid>
            <Grid item>
              <Button
                onClick={handleSaveButtonClick}
                variant="contained"
                color="primary"
                disabled={isFieldDisabled}
              >
                {formState == "ready" ? "Save" : "Saving..."}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
