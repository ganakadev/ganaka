import { Button, Paper, TextInput, Title } from "@mantine/core";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { dashboardAPI } from "../store/api/dashboardApi";
import { authLocalStorage } from "../utils/authLocalStorage";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRTKNotifier } from "../utils/hooks/useRTKNotifier";

export const SignIn = () => {
  // HOOKS
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        developerToken: z.string().min(1, "Developer key is required"),
      })
    ),
  });

  // API
  const [signIn, signInAPI] = dashboardAPI.useLazySignInQuery();
  useRTKNotifier({
    requestName: "Sign In",
    error: signInAPI.error,
  });

  // HANDLERS
  const onSubmit = handleSubmit(async (data) => {
    try {
      // Sign in
      const result = await signIn(data);

      if (result.error) {
        console.error(
          "Invalid developer key. Please check your credentials and try again."
        );
        return;
      }

      if (result.data?.data) {
        // Store token and username
        authLocalStorage.setToken(data.developerToken);
        authLocalStorage.setUsername(result.data.data.username);

        // Redirect to dashboard
        navigate("/");
      } else {
        console.error("Failed to fetch user details. Please try again.");
      }
    } catch {
      console.error("An error occurred. Please try again.");
    }
  });
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  // DRAW
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5">
      <Title ta="center">Sign In</Title>
      <Paper withBorder shadow="md" p={30} w="600px" radius="md">
        <TextInput
          {...register("developerToken")}
          label="Developer Key"
          placeholder="Enter your developer key"
          onKeyDown={handleKeyDown}
          disabled={signInAPI.isLoading || signInAPI.isFetching}
          error={errors.developerToken?.message}
          required
          mb="md"
        />
        <Button
          fullWidth
          onClick={onSubmit}
          loading={signInAPI.isLoading || signInAPI.isFetching}
        >
          Sign In
        </Button>
      </Paper>
    </div>
  );
};
