import { useMutation } from '@tanstack/react-query';
import { useAuthActions } from '../store/authStore';
import { API_LOGIN_URL } from '../constants';

type LoginInput = {
  username: string;
  password: string;
};

type LoginResponse = {
  jwtToken: string;
};

function useLoginMutation() {
  const { login } = useAuthActions();

  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: async function (data) {
      const response = await fetch(API_LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(json));
      }

      return json;
    },
    onSuccess: data => {
      login(data.jwtToken);
    },
  });
}

// define a union for the error

export function useLogin() {
  const { mutate, isPending, error } = useLoginMutation();

  function login(input: LoginInput): void {
    mutate(input);
  }

  return {
    login,
    isPending,
    error,
  };
}
