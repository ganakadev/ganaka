import { Alert } from "@mantine/core";
import { modals } from "@mantine/modals";

export const useDeleteConfirmModal = () => {
  // HANDLERS
  const invokeModal = ({
    onConfirm,
    artifact,
    isLoading,
    value,
  }: {
    onConfirm: () => Promise<void>;
    value: string;
    artifact: "run";
    isLoading: boolean;
  }) => {
    modals.openConfirmModal({
      title: `Delete ${artifact}?`,
      centered: true,
      children: (
        <div className="relative">
          <Alert variant="light" color="red" title="Warning">
            {`This action is irreversible and will delete all data associated with
            the ${artifact}:`}
            <br />
            <strong>{value}</strong>
          </Alert>
        </div>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: {
        color: "var(--mantine-color-red-text)",
        loading: isLoading,
      },
      onCancel: modals.closeAll,
      onConfirm: () => {
        onConfirm()
          .then(() => {
            modals.closeAll();
          })
          .catch((error) => {
            console.error(error);
          });
      },
    });
  };

  // RETURN
  return {
    invokeModal,
  };
};
