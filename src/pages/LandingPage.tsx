import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid2 as Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useFetchClasses } from "../hooks/api";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
}));

const ClassTitle = styled(Typography)({
  fontWeight: "bold",
  marginBottom: "8px",
});

const InfoItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginBottom: "8px",
  gap: "8px",
});

const HeroSection = styled(Box)(({ theme }) => ({
  background:
    'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/images/fitness-hero.jpg")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "white",
  padding: theme.spacing(10, 2),
  marginBottom: theme.spacing(6),
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(6, 2),
  },
}));

const LandingPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { isPending, isError, data, error } = useFetchClasses();

  // Simulate checking login status
  useEffect(() => {
    // In a real app, you would check if the user is logged in
    // For demo purposes, we'll just set a value
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleBookNow = (classId: number) => {
    if (!isLoggedIn) {
      alert("Please log in to book a class");
      return;
    }

    // In a real app, you would make an API call to book the class
    console.log(`Booking class with ID: ${classId}`);
    alert(`Successfully booked class!`);
  };

  return (
    <Box>
      <HeroSection>
        <Container>
          <Typography
            variant={isMobile ? "h4" : "h2"}
            component="h1"
            gutterBottom
          >
            Find Your Perfect Fitness Class
          </Typography>
          <Typography
            variant="h6"
            component="p"
            sx={{ maxWidth: "800px", margin: "0 auto", mb: 4 }}
          >
            Join our community and transform your life with our expert-led
            fitness classes
          </Typography>
          {!isLoggedIn && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => alert("Navigate to login page")}
            >
              Sign In to Book Classes
            </Button>
          )}
        </Container>
      </HeroSection>

      <Container sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          align="center"
          sx={{ mb: 4 }}
        >
          Available Classes
        </Typography>

        {isPending && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Loading classes...
            </Typography>
          </Box>
        )}

        {isError && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="error">
              Error loading classes: {error?.message || "Unknown error"}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </Box>
        )}

        {!isPending && !isError && data && data.length === 0 && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No classes available at the moment.
            </Typography>
          </Box>
        )}

        {!isPending && !isError && data && data.length > 0 && (
          <Grid container spacing={3}>
            {data.map((fitnessClass) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={fitnessClass.id}>
                <StyledCard>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <ClassTitle variant="h5">{fitnessClass.name}</ClassTitle>

                    <InfoItem>
                      <AccessTimeIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        {fitnessClass.time}
                      </Typography>
                    </InfoItem>

                    <InfoItem>
                      <PersonIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        Instructor: {fitnessClass.instructor}
                      </Typography>
                    </InfoItem>

                    <InfoItem>
                      <PeopleAltIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        Capacity: {fitnessClass.capacity}
                      </Typography>
                    </InfoItem>

                    <Box mt={1}>
                      <Chip
                        label={`${fitnessClass.remaining} spots left`}
                        color={
                          fitnessClass.remaining === 0
                            ? "error"
                            : fitnessClass.remaining < 5
                            ? "warning"
                            : "success"
                        }
                        size="small"
                      />
                    </Box>
                  </CardContent>

                  <CardActions>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={!isLoggedIn || fitnessClass.remaining === 0}
                      onClick={() => handleBookNow(fitnessClass.id)}
                    >
                      {fitnessClass.remaining === 0 ? "Class Full" : "Book Now"}
                    </Button>
                  </CardActions>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default LandingPage;
