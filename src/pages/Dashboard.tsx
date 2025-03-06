import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid2 as Grid,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useAuthStore } from "../store/authStore";
import {
  useFetchUserBookings,
  useCancelMutation,
  useFetchClasses,
} from "../hooks/api";

// 樣式組件
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
  },
}));

const InfoItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "8px",
});

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => ({
  marginBottom: theme.spacing(1),
  backgroundColor:
    status === "upcoming"
      ? theme.palette.primary.main
      : status === "completed"
      ? theme.palette.success.main
      : theme.palette.error.main,
  color: theme.palette.common.white,
}));

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  // 獲取預訂和課程數據
  const {
    data: bookings,
    isLoading: isLoadingBookings,
    error: bookingsError,
  } = useFetchUserBookings(user?.id);
  const {
    data: classes,
    isLoading: isLoadingClasses,
    error: classesError,
  } = useFetchClasses();
  const cancelMutation = useCancelMutation(user?.id, user?.token);

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await cancelMutation.mutateAsync(bookingId);
      } catch (error) {
        console.error("Error cancelling booking:", error);
      }
    }
  };

  // 合併預訂和課程數據
  const getBookingWithClassDetails = (booking: any) => {
    const classDetails = classes?.find(
      (c) => c.id === booking.classId.toString()
    );
    return {
      ...booking,
      className: classDetails?.name || "Unknown Class",
      time: classDetails?.time || "N/A",
      instructor: classDetails?.instructor || "N/A",
      location: "Main Studio", // 假設所有課程都在同一個地點
    };
  };

  if (isLoadingBookings || isLoadingClasses) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (bookingsError || classesError) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          Error loading your bookings. Please try again later.
        </Alert>
      </Container>
    );
  }

  const upcomingBookings =
    bookings
      ?.filter((booking) => booking.status === "upcoming")
      .map(getBookingWithClassDetails) || [];

  const otherBookings =
    bookings
      ?.filter((booking) => booking.status !== "upcoming")
      .map(getBookingWithClassDetails) || [];

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Dashboard
      </Typography>

      <Box mb={4}>
        <Typography variant="h5" component="h2" gutterBottom>
          Upcoming Classes
        </Typography>
        {upcomingBookings.length === 0 ? (
          <Alert severity="info">
            You don't have any upcoming classes. Browse our classes to book one!
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {upcomingBookings.map((booking) => (
              <Grid size={{ xs: 12, sm: 6, md: 6 }} key={booking.id}>
                <StyledCard>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <StatusChip
                      label={booking.status.toUpperCase()}
                      status={booking.status}
                    />
                    <Typography variant="h6" gutterBottom>
                      {booking.className}
                    </Typography>

                    <InfoItem>
                      <AccessTimeIcon color="action" fontSize="small" />
                      <Typography variant="body2">{booking.time}</Typography>
                    </InfoItem>

                    <InfoItem>
                      <PersonIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        {booking.instructor}
                      </Typography>
                    </InfoItem>

                    <InfoItem>
                      <LocationOnIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        {booking.location}
                      </Typography>
                    </InfoItem>
                  </CardContent>

                  <CardActions>
                    <Button
                      fullWidth
                      variant="contained"
                      color="error"
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancelMutation.isPending}
                    >
                      {cancelMutation.isPending
                        ? "Cancelling..."
                        : "Cancel Booking"}
                    </Button>
                  </CardActions>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {otherBookings.length > 0 && (
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Past & Cancelled Classes
          </Typography>
          <Grid container spacing={3}>
            {otherBookings.map((booking) => (
              <Grid size={{ xs: 12, sm: 6, md: 6 }} key={booking.id}>
                <StyledCard>
                  <CardContent>
                    <StatusChip
                      label={booking.status.toUpperCase()}
                      status={booking.status}
                    />
                    <Typography variant="h6" gutterBottom>
                      {booking.className}
                    </Typography>

                    <InfoItem>
                      <AccessTimeIcon color="action" fontSize="small" />
                      <Typography variant="body2">{booking.time}</Typography>
                    </InfoItem>

                    <InfoItem>
                      <PersonIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        {booking.instructor}
                      </Typography>
                    </InfoItem>

                    <InfoItem>
                      <LocationOnIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        {booking.location}
                      </Typography>
                    </InfoItem>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default Dashboard;
