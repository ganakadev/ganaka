import { Button, Paper, Text, TextInput, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import {
  useGetGrowwCredentialsQuery,
  useUpdateGrowwCredentialsMutation,
  useDeleteGrowwCredentialsMutation,
} from "../../store/api/dashboardApi";
import { useRTKNotifier } from "../../utils/hooks/useRTKNotifier";

export const Settings = () => {
  // STATE
  const [growwApiKey, setGrowwApiKey] = useState("");
  const [growwApiSecret, setGrowwApiSecret] = useState("");

  // API
  const getGrowwCredentialsAPI = useGetGrowwCredentialsQuery();
  useRTKNotifier({
    requestName: "Get Groww Credentials",
    error: getGrowwCredentialsAPI.error,
  });

  const [updateGrowwCredentialsMutation, { isLoading: isUpdating }] =
    useUpdateGrowwCredentialsMutation();
  const [deleteGrowwCredentialsMutation, { isLoading: isDeleting }] =
    useDeleteGrowwCredentialsMutation();

  // Load existing credentials when component mounts
  useEffect(() => {
    if (getGrowwCredentialsAPI.data?.data) {
      // Don't populate the fields with actual values for security
      // Just show empty fields if credentials exist
      if (getGrowwCredentialsAPI.data.data.hasGrowwApiKey) {
        requestAnimationFrame(() => {
          setGrowwApiKey("");
        setGrowwApiSecret("");
        })
      }
    }
  }, [getGrowwCredentialsAPI.data]);

  // HANDLERS
  const handleSave = async () => {
    if (!growwApiKey.trim() || !growwApiSecret.trim()) {
      notifications.show({
        title: "Validation Error",
        message: "Both API Key and Secret are required",
        color: "red",
      });
      return;
    }

    try {
      await updateGrowwCredentialsMutation({
        growwApiKey: growwApiKey.trim(),
        growwApiSecret: growwApiSecret.trim(),
      }).unwrap();
      notifications.show({
        title: "Success",
        message: "Groww credentials updated successfully",
        color: "green",
      });
      // Clear the form after successful save
      setGrowwApiKey("");
      setGrowwApiSecret("");
      // Refetch to update the masked key display
      await getGrowwCredentialsAPI.refetch();
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? String((error.data as { message?: string }).message || "Failed to update credentials")
          : "Failed to update credentials";
      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteGrowwCredentialsMutation().unwrap();
      notifications.show({
        title: "Success",
        message: "Groww credentials deleted successfully",
        color: "green",
      });
      // Clear the form
      setGrowwApiKey("");
      setGrowwApiSecret("");
      // Refetch to update the status 
      await getGrowwCredentialsAPI.refetch();
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? String((error.data as { message?: string }).message || "Failed to delete credentials")
          : "Failed to delete credentials";
      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
      });
    }
  };

  // DRAW
  const isLoading = getGrowwCredentialsAPI.isLoading;
  const hasCredentials =
    getGrowwCredentialsAPI.data?.data.hasGrowwApiKey &&
    getGrowwCredentialsAPI.data?.data.hasGrowwApiSecret;
  const maskedKey = getGrowwCredentialsAPI.data?.data.growwApiKeyMasked;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Title order={1} mb="xl">
        Settings
      </Title>

      <Paper p="md" withBorder>
        <Title order={2} mb="md">
          Groww API Credentials
        </Title>
        <Text c="dimmed" mb="md">
          Configure your Groww API credentials to use your own rate limits. These credentials will
          be encrypted and stored securely.
        </Text>

        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            {hasCredentials && maskedKey && (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <Text size="sm" c="dimmed" mb="xs">
                  Current API Key (masked):
                </Text>
                <Text size="sm" fw={500}>
                  {maskedKey}
                </Text>
              </div>
            )}

            <div className="space-y-4">
              <TextInput
                label="Groww API Key"
                placeholder="Enter your Groww API key"
                value={growwApiKey}
                onChange={(e) => setGrowwApiKey(e.target.value)}
                type="password"
                required
              />

              <TextInput
                label="Groww API Secret"
                placeholder="Enter your Groww API secret"
                value={growwApiSecret}
                onChange={(e) => setGrowwApiSecret(e.target.value)}
                type="password"
                required
              />

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    handleSave().catch((error) => console.error(error));
                  }}
                  disabled={!growwApiKey.trim() || !growwApiSecret.trim() || isUpdating}
                  loading={isUpdating}
                >
                  {hasCredentials ? "Update Credentials" : "Save Credentials"}
                </Button>

                {hasCredentials && (
                  <Button
                    color="red"
                    variant="light"
                    onClick={() => {
                      handleDelete().catch((error) => console.error(error));
                    }}
                    disabled={isDeleting}
                    loading={isDeleting}
                  >
                    Delete Credentials
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </Paper>
    </div>
  );
};
