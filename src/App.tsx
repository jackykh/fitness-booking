import { Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { useNavigate } from "react-router";
import { useAuthStore } from "./store/authStore";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 120000 } },
});

function App() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo and Brand */}
            <IconButton
              color="inherit"
              onClick={() => navigate("/")}
              edge="start"
              sx={{ mr: 2 }}
            >
              <FitnessCenterIcon />
            </IconButton>

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 1,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
              onClick={() => navigate("/")}
            >
              Fitness Booking
            </Typography>

            {/* Auth Buttons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {isAuthenticated ? (
                <>
                  {!isMobile && (
                    <Typography variant="body1">
                      Welcome, {user?.firstName || user?.username}
                    </Typography>
                  )}
                  <Button
                    color="inherit"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </Button>
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button color="inherit" onClick={() => navigate("/login")}>
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box sx={{ pt: 2 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<LandingPage />} />
          {/* Add other protected routes */}
          <Route element={<ProtectedRoutes isLoggedIn={isAuthenticated} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Box>
      <ToastContainer />
    </QueryClientProvider>
  );
}

export default App;
