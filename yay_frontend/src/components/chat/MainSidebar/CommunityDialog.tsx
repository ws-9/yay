import { Dialog } from '@base-ui/react/dialog';
import { Form } from '@base-ui/react/form';
import { Field } from '@base-ui/react/field';
import { Button } from '@base-ui/react/button';
import { useEffect, useEffectEvent, useState } from 'react';
import useCreateCommunity from '../../../hooks/useCreateCommunityMutation';
import { Toast } from '@base-ui/react/toast';
import { ErrorHandlingToast } from './ErrorHandlingToast';
import useJoinCommunity from '../../../hooks/useJoinCommunityMutation';

type DialogMode = 'join' | 'create';

export default function CommunityDialog() {
  const [mode, setMode] = useState<DialogMode>('join');

  function reset() {
    setMode('join');
  }

  return (
    <>
      <ErrorHandlingToast />
      <Dialog.Root onOpenChange={open => open && reset()}>
        <Dialog.Trigger className="flex h-10 w-full items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-3.5 text-base font-medium text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100">
          +
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-20 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute dark:opacity-70" />
          <Dialog.Popup className="fixed top-1/2 left-1/2 -mt-8 w-96 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-50 p-6 text-gray-900 outline outline-1 outline-gray-200 transition-all duration-150 data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:outline-gray-300">
            <Dialog.Title className="-mt-1.5 mb-1 text-lg font-medium">
              {mode === 'join' ? 'Join a Server' : 'Create a Server'}
            </Dialog.Title>
            <Dialog.Description className="mb-6 text-base text-gray-600">
              {mode === 'join'
                ? 'Enter an invite code to join an existing server'
                : 'Choose a name for your new server'}
            </Dialog.Description>
            <CommunityDialogForm mode={mode} setMode={setMode} />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function CommunityDialogForm({
  mode,
  setMode,
}: {
  mode: DialogMode;
  setMode: React.Dispatch<React.SetStateAction<DialogMode>>;
}) {
  const [errors, setErrors] = useState({});
  const {
    mutate: mutateCommunity,
    isPending: isCommunityPending,
    error: communityError,
  } = useCreateCommunity();
  const {
    mutate: mutateMembership,
    isPending: isMembershipPending,
    error: memberError,
  } = useJoinCommunity();
  const toastManager = Toast.useToastManager();

  const onNetworkError = useEffectEvent(() => {
    toastManager.add({
      title: `Network Error`,
      description: "Something's wrong from our end.",
    });
  });

  useEffect(() => {
    if (communityError) {
      if (communityError.message.includes('Failed to fetch')) {
        onNetworkError();
      }
    }
    if (memberError) {
      if (memberError.message.includes('Failed to fetch')) {
        onNetworkError();
      }
    }
  }, [communityError, memberError]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (mode === 'join') {
      const joinCode = formData.get('joinCode') as string;
      mutateMembership(
        { communityId: Number.parseInt(joinCode) },
        {
          onError: error => {
            if (error.message === 'Community not found') {
              const serverErrors = {
                joinCode: error.message,
              };
              setErrors(serverErrors);
            }
          },
        },
      );
    } else {
      const serverName = formData.get('serverName') as string;
      mutateCommunity({ name: serverName });
    }
  }

  return (
    <Form errors={errors} onSubmit={handleSubmit} className="mb-6">
      {mode === 'join' ? <JoinField /> : <ServerField />}

      <Button
        type="button"
        onClick={() => setMode(mode === 'join' ? 'create' : 'join')}
        className="text-sm text-blue-600 hover:underline"
      >
        {mode === 'join'
          ? 'Or create a new server'
          : 'Or join an existing server'}
      </Button>

      <div className="mt-6 flex justify-end gap-4">
        <Dialog.Close className="flex h-10 items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-3.5 text-base font-medium text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100">
          Cancel
        </Dialog.Close>
        <Button
          type="submit"
          className="flex h-10 items-center justify-center rounded-md bg-blue-600 px-3.5 text-base font-medium text-white select-none hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-blue-700"
        >
          {mode === 'join' ? 'Join Server' : 'Create Server'}
        </Button>
      </div>
    </Form>
  );
}

function ServerField() {
  const [serverName, setServerName] = useState('');

  return (
    <Field.Root name="serverName" className="mb-4">
      <Field.Label className="mb-2 block text-sm font-medium">
        Server Name
      </Field.Label>
      <Field.Control
        type="text"
        value={serverName}
        onChange={e => setServerName(e.target.value)}
        placeholder="My Awesome Server"
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        required
      />
      <Field.Error className="text-sm text-red-800" match="valueMissing">
        Please enter a community name
      </Field.Error>
    </Field.Root>
  );
}

function JoinField() {
  const [joinCode, setJoinCode] = useState('');

  return (
    <Field.Root name="joinCode" className="mb-4">
      <Field.Label className="mb-2 block text-sm font-medium">
        Invite Code
      </Field.Label>
      <Field.Control
        type="text"
        value={joinCode}
        onChange={e => setJoinCode(e.target.value)}
        placeholder="Enter invite code"
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        required
      />
      <Field.Error className="text-sm text-red-800" match="valueMissing">
        Please enter an invite code
      </Field.Error>
      <Field.Error className="text-sm text-red-800" />
    </Field.Root>
  );
}
