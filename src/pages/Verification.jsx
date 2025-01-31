import { Box, Typography, Button, Stack, Grid2 } from "@mui/material";
import FormInput from "../components/login-signup/FormInput";
import { useForm } from "react-hook-form";
import { useVerifyEmailMutation } from "../services/api/authApi";
import { ArrowBack } from "@mui/icons-material";
import { CustomAlert } from "../components/CustomAlert";
import ResendCodeButton from "../components/login-signup/ResendCodeButton.jsx";
import Logo from "../assets/agteach.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef } from "react";
import { checkLoginStatus } from "../features/user/authSlice.js";

export default function VerificationPage() {
  const timeoutRef = useRef(null);
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const email = useSelector((state) => state.user.email);

  const [verifyEmail, { isLoading, isSuccess, isError }] =
    useVerifyEmailMutation();

  const onSubmit = async (data) => {
    try {
      await verifyEmail(data.emailVerifyCode).unwrap();
      dispatch(checkLoginStatus({ IsVerify: true }));
      navigate("/");
    } catch (err) {
      console.error("Verification failed", err);
    }
  };

  const handleOnClick = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setOpen(true);
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 4000);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: { sm: "80vh", xs: "100vh" },
        paddingX: 5,
        maxWidth: "1420px",
        margin: "0 auto",
      }}
    >
      <img src={Logo} alt="logo" />
      <Grid2
        container
        sx={{ width: "100%" }}
        direction={"row"}
        alignItems={"center"}
        gap={2}
      >
        <Grid2 item="true" sx={{ width: { xs: "100%", sm: "55%" } }}>
          <Stack>
            <Box
              height={{ sm: "430px", xs: "246px" }}
              objectfit={"contain"}
              component={"iframe"}
              border={"none"}
              src="https://lottie.host/embed/7e3e9b9a-bfc5-43b9-83b8-f9865bff7bf6/OkwRtcwUA1.json"
            ></Box>
          </Stack>
          <Box textAlign={"center"}>
            <Typography sx={{ typography: { xs: "h4", sm: "blgsm" } }}>
              Check your email for verification code .
            </Typography>
            <Typography variant="bsr" sx={{ color: "dark.300" }}>
              Please enter code number that you receive in the email.
            </Typography>
          </Box>
        </Grid2>
        <Grid2 item="true" sx={{ width: { xs: "100%", sm: "40%" } }}>
          <Stack width={"100%"} spacing={2}>
            <Typography variant="blgsm">
              Enter verification code
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              onClick={handleOnClick}
            >
              <FormInput
                mt={2}
                label="Code"
                type="text"
                {...register("emailVerifyCode", {
                  required: "Verification code is required",
                })}
              />
              {errors.code && (
                <Typography color="error">{errors.code.message}</Typography>
              )}
              {isSuccess && (
                <CustomAlert
                  label="Verification successful!"
                  open={open}
                  onClose={() => setOpen(false)}
                  severity="success"
                />
              )}
              {isError && (
                <CustomAlert
                  label="Incorrect Verification Code!"
                  open={open}
                  onClose={() => setOpen(false)}
                  severity="error"
                />
              )}
              <Stack gap={1.5} pt={1}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                >
                  Submit
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  disabled={isLoading}
                  startIcon={<ArrowBack />}
                  onClick={() => navigate("/auth/signup")}
                >
                  Go Back
                </Button>
                <ResendCodeButton email={email} timeoutRef={timeoutRef} />
              </Stack>
            </Box>
          </Stack>
        </Grid2>
      </Grid2>
    </Box>
  );
}
