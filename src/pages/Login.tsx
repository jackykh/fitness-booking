import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router";

const LoginContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "calc(100vh - 64px)", // 減去 AppBar 的高度
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    minHeight: "calc(100vh - 56px)", // 移動設備上 AppBar 高度較小
  },
}));

const LoginPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: "450px",
  width: "100%",
  boxShadow: theme.shadows[3],
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

const Form = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(2),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  padding: theme.spacing(1.2),
}));

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // 如果用戶已經登錄，重定向到Dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password) {
      await login(username, password);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LoginContainer maxWidth="sm">
      <LoginPaper elevation={3}>
        <Typography component="h1" variant="h4" gutterBottom>
          Welcome Back
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Sign in to continue to your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isLoading || !username.trim() || !password}
          >
            {isLoading ? <CircularProgress size={24} /> : "Sign In"}
          </SubmitButton>

          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link href="/register" underline="hover">
                Sign up
              </Link>
            </Typography>
          </Box>

          <Box mt={3} textAlign="center">
            <Typography variant="caption" color="textSecondary">
              Demo credentials: username: emilys, password: emilyspass
            </Typography>
          </Box>
        </Form>
      </LoginPaper>
    </LoginContainer>
  );
};

export default Login;
