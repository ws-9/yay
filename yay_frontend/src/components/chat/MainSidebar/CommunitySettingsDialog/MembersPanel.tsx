import { Button } from '@base-ui/react/button';
import { Field } from '@base-ui/react/field';
import { Tabs } from '@base-ui/react/tabs';
import { useState } from 'react';
import { Form } from 'react-router';

export default function MembersPanel({ communityId }: { communityId: number }) {
  return (
    <Tabs.Panel className="flex-1 space-y-4 p-6" value="members">
      <ExampleForm />
    </Tabs.Panel>
  );
}

function ExampleForm() {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  return (
    <Form
      className="flex w-full max-w-64 flex-col gap-4"
      errors={errors}
      onSubmit={async event => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const value = formData.get('url') as string;

        setLoading(true);
        const response = await submitForm(value);
        const serverErrors = {
          url: response.error,
        };

        setErrors(serverErrors);
        setLoading(false);
      }}
    >
      <Field.Root name="url" className="flex flex-col items-start gap-1">
        <Field.Label className="text-sm font-medium text-gray-900">
          Homepage
        </Field.Label>
        <Field.Control
          type="url"
          required
          defaultValue="https://example.com"
          placeholder="https://example.com"
          pattern="https?://.*"
          className="h-10 w-full rounded-md border border-gray-200 pl-3.5 text-base text-gray-900 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800"
        />
        <Field.Error className="text-sm text-red-800" />
      </Field.Root>
      <Button
        disabled={loading}
        focusableWhenDisabled
        type="submit"
        className="font-inherit m-0 flex h-10 items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-3.5 text-base leading-6 font-medium text-gray-900 outline-0 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:border-t-gray-300 active:bg-gray-200 active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] data-[disabled]:text-gray-500 hover:data-[disabled]:bg-gray-50 active:data-[disabled]:border-t-gray-200 active:data-[disabled]:bg-gray-50 active:data-[disabled]:shadow-none"
      >
        Submit
      </Button>
    </Form>
  );
}

async function submitForm(value: string) {
  // Mimic a server response
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  try {
    const url = new URL(value);

    if (url.hostname.endsWith('example.com')) {
      return { error: 'The example domain is not allowed' };
    }
  } catch {
    return { error: 'This is not a valid URL' };
  }

  return { success: true };
}
