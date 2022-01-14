import React, { useState } from "react";
import {
   Container,
   Card,
   Avatar,
   Typography,
   Box,
   IconButton,
   ListItem,
   Divider,
   ListItemText,
   ListItemAvatar,
} from "@mui/material";
import { amber, blue, grey, lightBlue, purple } from "@mui/material/colors";
import { makeStyles } from "@mui/styles";
import GradeIcon from "@mui/icons-material/Grade";
import DetailsCard from "../cards/DetailsCard";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { Link as Nlink } from "@mui/material";
import MiniMap from "../MiniMap";
import { useEffect, useContext } from "react";
import { LoginContext } from "../../contexts/LoginContext";
import { domain } from "../../fetch-url/fetchUrl";

const useStyles = makeStyles({
   avatar: {
      background: amber[700],
   },
   appbar: {
      padding: ".6rem .9rem",
      background: blue[600],
   },
   container: {
      padding: ".5rem",
      paddingTop: "1rem",
   },

   gradeIcon: {
      color: grey[200],
   },
   gradeIconActive: {
      color: amber[300],
   },
   toolbar: {
      display: "flex",
      justifyContent: "space-between",
   },
   icon: {
      color: blue[50],
   },

   infoCard: {
      border: "none",
      background: grey[100],
   },
   margin: {
      marginRight: "3px",
      marginLeft: "3px",
   },
   loaderContainer: {
      height: "100vh",
      width: "100vw",
      position: "absolute",
      top: "0",
      left: "0",
      display: "grid",
      placeItems: "center",
   },
});

const InfoItem = ({ icon, primaryText, secondaryText }) => {
   return (
      <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
         <ListItemAvatar>
            <Avatar sx={{ background: lightBlue[500] }}>{icon}</Avatar>
         </ListItemAvatar>
         <ListItemText
            primary={primaryText}
            secondary={secondaryText}
            sx={{
               ".MuiListItemText-primary": {
                  fontFamily: "Quicksand",
               },
            }}
         />
      </ListItem>
   );
};

const About = ({ boardinghouse }) => {
   const classes = useStyles();
   const [isStarred, setIsStarred] = useState(false);
   const [stars, setStars] = useState(null);
   const { currentUser } = useContext(LoginContext);
   const [reloader, setReloader] = useState(0);

   useEffect(() => {
      const abortCont = new AbortController();
      fetch(`${domain}/api/stars/${boardinghouse.id}`, {
         signal: abortCont.signal,
      })
         .then((res) => {
            if (!res.ok) {
               throw Error("Something went wrong!");
            }
            return res.json();
         })
         .then((data) => {
            setStars(data.totalStars);
            fetch(
               `${domain}/api/boarding-houses/update-popularity/${boardinghouse.id}`,
               {
                  method: "PUT",
                  body: JSON.stringify({
                     stars: stars,
                  }),
                  headers: {
                     "Content-Type": "application/json",
                  },
               }
            )
               .then((res) => res.json())
               .then((data) => {
                  console.log(data.message);
               })
               .catch((err) => console.log(err));
         })
         .catch((err) => {
            if (err.name === "AbortError") {
               console.log("fetch aborted");
            } else {
               setStars(0);
            }
         });
      return () => {
         abortCont.abort();
      };
   }, [boardinghouse, reloader, stars]);

   useEffect(() => {
      const abortCont = new AbortController();
      fetch(
         `${domain}/api/stars/isstarred/${boardinghouse.id}/${currentUser.id}`,
         {
            signal: abortCont.signal,
         }
      )
         .then((res) => res.json())
         .then((data) => {
            console.log(data);
            setIsStarred(data.isStarred);
         })
         .catch((err) => {
            if (err.name === "AbortError") {
               console.log("fetch aborted");
            } else {
               console.log(err);
            }
         });
      return () => {
         abortCont.abort();
      };
   }, [currentUser, boardinghouse]);

   const handleAddStar = () => {
      fetch(`${domain}/api/stars/add/${boardinghouse.id}/${currentUser.id}`, {
         method: "POST",
         body: JSON.stringify({
            seekerName: currentUser.name,
         }),
         headers: {
            "Content-Type": "application/json",
         },
      })
         .then((res) => {
            return res.json();
         })
         .then((data) => {
            console.log(data.message);
            setIsStarred(true);
            setReloader((prevCount) => prevCount + 1);
         })
         .catch((err) => console.log(err));
   };

   const handleRemoveStar = () => {
      fetch(
         `${domain}/api/stars/delete/${boardinghouse.id}/${currentUser.id}`,
         {
            method: "DELETE",
         }
      )
         .then((res) => {
            return res.json();
         })
         .then((data) => {
            console.log(data.message);
            setIsStarred(false);
            setReloader((prevCount) => prevCount + 1);
         })
         .catch((err) => console.log(err));
   };

   return (
      <Box
         sx={{
            height: "85vh",
            overflowY: "auto",
         }}
      >
         <Card
            sx={{
               borderRadius: 0,
               display: "flex",
               flexDirection: "column",
               alignItems: "center",
               padding: 2,
               paddingTop: 5,
               position: "relative",
            }}
            elevation={0}
         >
            <Avatar
               sx={{
                  background: purple[400],
                  height: 110,
                  width: 110,
                  fontSize: 40,
                  fontWeight: "bold",
               }}
            >
               {boardinghouse.name.charAt(0)}
            </Avatar>
            <Typography variant="h6" sx={{ fontFamily: "Quicksand", mt: 1 }}>
               {boardinghouse.name}
            </Typography>
            <Box
               sx={{
                  display: "flex",
                  itemsCenter: "center",
               }}
            >
               <GradeIcon
                  fontSize="small"
                  className={`${classes.gradeIconActive} ${classes.margin}`}
               />
               <Typography variant="body2" color="textSecondary">
                  {stars || boardinghouse.popularity || 0} stars
               </Typography>
            </Box>
            <Typography
               variant="body1"
               color="text.secondary"
               sx={{ mt: 2, fontStyle: "italic" }}
            >
               {boardinghouse.tagline}
            </Typography>
            {isStarred ? (
               <IconButton
                  size="large"
                  onClick={handleRemoveStar}
                  sx={{
                     // boxShadow: "inset 0px 0px 10px 1px rgba(0,0,0,0.09)",
                     position: "absolute",
                     top: ".5rem",
                     right: ".5rem",
                  }}
               >
                  <GradeIcon
                     fontSize="large"
                     className={classes.gradeIconActive}
                  />
               </IconButton>
            ) : (
               <IconButton
                  size="large"
                  onClick={handleAddStar}
                  sx={{
                     // boxShadow: "inset 0px 0px 10px 1px rgba(0,0,0,0.09)",
                     position: "absolute",
                     top: ".5rem",
                     right: ".5rem",
                  }}
               >
                  <GradeIcon fontSize="large" className={classes.gradeIcon} />
               </IconButton>
            )}
         </Card>
         <Divider />

         <Container
            maxWidth="sm"
            disableGutters
            sx={{
               padding: 2,
               paddingBottom: "5rem",
            }}
         >
            <DetailsCard title="Owner">
               <InfoItem
                  icon={<PersonPinIcon />}
                  primaryText={boardinghouse.owner}
                  secondaryText={"Owner"}
               />
            </DetailsCard>

            <DetailsCard title="Contacts">
               <InfoItem
                  icon={<PhoneOutlinedIcon />}
                  primaryText={
                     <Nlink
                        underline="hover"
                        color="primary"
                        href={`tel: ${boardinghouse.contacts}`}
                     >
                        {boardinghouse.contacts}
                     </Nlink>
                  }
                  secondaryText={"Contact Number"}
               />
            </DetailsCard>

            <DetailsCard title="Location">
               <InfoItem
                  icon={<LocationOnIcon />}
                  primaryText={boardinghouse.completeAddress}
                  secondaryText={"Full Address"}
               />
               <InfoItem
                  icon={<GpsFixedIcon />}
                  primaryText={
                     <Typography
                        variant="body1"
                        color="initial"
                        sx={{ fontFamily: "Quicksand" }}
                     >
                        {boardinghouse.longitude}{" "}
                        <Typography variant="caption" color="text.secondary">
                           LNG
                        </Typography>{" "}
                        - {boardinghouse.latitude}{" "}
                        <Typography variant="caption" color="text.secondary">
                           LAT
                        </Typography>
                     </Typography>
                  }
                  secondaryText={"Coordinates"}
               />
            </DetailsCard>

            <DetailsCard title="House Protocols">Do's and Dont's</DetailsCard>
            <DetailsCard title="We Offer">Offers</DetailsCard>
            <DetailsCard title="Gender/s Allowed">
               <InfoItem
                  icon={<LocationOnIcon />}
                  primaryText={boardinghouse.genderAllowed}
               />
            </DetailsCard>
            <DetailsCard title="Water source">Bombahan</DetailsCard>
            <DetailsCard title="Price Range">Price</DetailsCard>
            <DetailsCard title="Total Rooms">n Rooms</DetailsCard>

            <Box sx={{ mb: 2, mt: 4 }}>
               <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                  sx={{
                     mt: 2,
                     mb: 1,
                     textTransform: "uppercase",
                     fontFamily: "Quicksand",
                     fontSize: 12,
                  }}
               >
                  {boardinghouse.name}'s Location
               </Typography>
               <MiniMap ownerId={boardinghouse.ownerId} />
            </Box>
         </Container>
      </Box>
   );
};

export default About;
