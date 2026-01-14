import { Dialog } from '@base-ui/react/dialog';
import { Form } from '@base-ui/react/form';
import { Field } from '@base-ui/react/field';
import { Button } from '@base-ui/react/button';
import { useEffect, useEffectEvent, useState } from 'react';
import useCreateCommunity from '../../../hooks/useCreateCommunityMutation';
import { Toast } from '@base-ui/react/toast';

type DialogMode = 'join' | 'create';

export default function CommunityDialog() {
  const [mode, setMode] = useState<DialogMode>('join');
  const [joinCode, setJoinCode] = useState('');
  const [serverName, setServerName] = useState('');
  const { mutate, isPending, error } = useCreateCommunity();
  const toastManager = Toast.useToastManager();

  const onError = useEffectEvent(() => {
    toastManager.add({
      title: `Network Error`,
      description: "Something's wrong from our end.",
    });
  });

  useEffect(() => {
    if (error) {
      if (error.message.includes('Failed to fetch')) {
        onError();
      }
    }
  }, [error]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === 'join') {
      // Handle join logic
      console.log('Join with code:', joinCode);
    } else {
      // Handle create logic
      console.log('Create server:', serverName);
      mutate({ name: serverName });
    }
  }

  function reset() {
    setMode('join');
    setJoinCode('');
    setServerName('');
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

            <Form onSubmit={handleSubmit} className="mb-6">
              {mode === 'join' ? (
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
                  <Field.Error
                    className="text-sm text-red-800"
                    match="valueMissing"
                  >
                    Please enter an invite code
                  </Field.Error>
                </Field.Root>
              ) : (
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
                  <Field.Error
                    className="text-sm text-red-800"
                    match="valueMissing"
                  >
                    Please enter a community name
                  </Field.Error>
                </Field.Root>
              )}

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
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function ErrorHandlingToast() {
  return (
    <Toast.Portal>
      <Toast.Viewport className="fixed top-auto right-[1rem] bottom-[1rem] z-10 mx-auto flex w-[250px] sm:right-[2rem] sm:bottom-[2rem] sm:w-[300px]">
        <ToastList />
      </Toast.Viewport>
    </Toast.Portal>
  );
}

function ToastList() {
  const { toasts } = Toast.useToastManager();
  return toasts.map(toast => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      className="absolute right-0 bottom-0 left-auto z-[calc(1000-var(--toast-index))] mr-0 h-[var(--height)] w-full origin-bottom [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] rounded-lg border border-gray-200 bg-gray-50 bg-clip-padding p-4 shadow-lg select-none [--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))] [transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,height_0.15s] after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-[''] data-[ending-style]:opacity-0 data-[expanded]:h-[var(--toast-height)] data-[expanded]:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--offset-y)))] data-[limited]:opacity-0 data-[starting-style]:[transform:translateY(150%)] data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] data-[expanded]:data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-[expanded]:data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-[expanded]:data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))] data-[expanded]:data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))] [&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]"
    >
      <Toast.Content className="overflow-hidden transition-opacity [transition-duration:250ms] data-[behind]:pointer-events-none data-[behind]:opacity-0 data-[expanded]:pointer-events-auto data-[expanded]:opacity-100">
        <Toast.Title className="text-[0.975rem] leading-5 font-medium" />
        <Toast.Description className="text-[0.925rem] leading-5 text-gray-700" />
        <Toast.Close
          className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded border-none bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close"
        >
          <XIcon className="h-4 w-4" />
        </Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ));
}

function XIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
