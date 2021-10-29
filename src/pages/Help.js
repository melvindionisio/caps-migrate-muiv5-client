import React from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Container from "@mui/material/Container";
import Slide from "@mui/material/Slide";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import { Box } from "@mui/system";

const Help = () => {
  return (
    <Slide in={true} direction="up">
      <Container
        disableGutters
        maxWidth="xl"
        sx={{ height: "100vh", width: "100vw", overflowY: "auto" }}
      >
        <AppBar position="sticky" elevation={1}>
          <Toolbar>
            <Typography variant="h6">HELP</Typography>
          </Toolbar>
        </AppBar>
        <Box p={2} pb={8}>
          <Card variant="outlined" sx={{ marginBottom: ".5rem" }}>
            <CardHeader
              title="Melvin"
              subheader="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius
                  dolores recusandae corrupti error aliquam tempore, repudiandae
                  nisi aperiam totam, impedit nihil nulla officia id sed
                  temporibus porro qui sequi fugiat?"
            />
          </Card>
        </Box>
      </Container>
    </Slide>
  );
};

export default Help;
