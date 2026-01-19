import { Dialog } from '@base-ui/react/dialog';
import { ErrorHandlingToast } from './ErrorHandlingToast';
import { useEffect, useEffectEvent, useState } from 'react';
import useCreateChannel from '../../../hooks/useCreateChannelMutation';
import { Toast } from '@base-ui/react/toast';
import { Button } from '@base-ui/react/button';
import { Form } from '@base-ui/react/form';
import { Field } from '@base-ui/react/field';

export default function ChannelDialog({
  communityId,
  open,
  onOpenChange,
}: {
  communityId: number;
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      <ErrorHandlingToast />
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-20 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute dark:opacity-70" />
          <Dialog.Popup className="fixed top-1/2 left-1/2 -mt-8 w-96 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-50 p-6 text-gray-900 outline outline-1 outline-gray-200 transition-all duration-150 data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:outline-gray-300">
            <Dialog.Title className="-mt-1.5 mb-1 text-lg font-medium">
              Create a Channel
            </Dialog.Title>
            <Dialog.Description className="mb-6 text-base text-gray-600">
              Choose a name for your new channel
            </Dialog.Description>
            <ChannelDialogForm communityId={communityId} />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function ChannelDialogForm({ communityId }: { communityId: number }) {
  const [errors, setErrors] = useState({});
  const { mutate, isPending, error } = useCreateChannel();
  const toastManager = Toast.useToastManager();

  const onNetworkError = useEffectEvent(() => {
    toastManager.add({
      title: `Network Error`,
      description: "Something's wrong from our end.",
    });
  });

  useEffect(() => {
    if (error) {
      if (error.message.includes('Failed to fetch')) {
        onNetworkError();
      }
    }
  }, [error]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const channelName = formData.get('channelName') as string;
    mutate(
      {
        name: channelName,
        communityId: communityId,
      },
      {
        onError: error => {
          if (error.message === 'Channel not found') {
            const serverErrors = {
              joinCode: error.message,
            };
            setErrors(serverErrors);
          }
        },
      },
    );
  }

  return (
    <Form errors={errors} onSubmit={handleSubmit} className="mb-6">
      <ChannelNameField />
      <div className="mt-6 flex justify-end gap-4">
        <Dialog.Close className="flex h-10 items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-3.5 text-base font-medium text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100">
          Cancel
        </Dialog.Close>
        <Button
          type="submit"
          className="flex h-10 items-center justify-center rounded-md bg-blue-600 px-3.5 text-base font-medium text-white select-none hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-blue-700"
        >
          Create Channel
        </Button>
      </div>
    </Form>
  );
}

function ChannelNameField() {
  const [channelName, setChannelName] = useState('');

  return (
    <Field.Root name="channelName" className="mb-4">
      <Field.Label className="mb-2 block text-sm font-medium">
        Channel Name
      </Field.Label>
      <Field.Control
        type="text"
        value={channelName}
        onChange={e => setChannelName(e.target.value)}
        placeholder="Enter channel name"
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        required
      />
      <Field.Error className="text-sm text-red-800" match="valueMissing">
        Please enter a name
      </Field.Error>
      <Field.Error className="text-sm text-red-800" />
    </Field.Root>
  );
}
