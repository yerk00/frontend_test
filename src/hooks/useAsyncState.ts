import { useCallback, useState } from "react";

export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export const useAsyncState = <T>() => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const run = useCallback(async (asyncFn: () => Promise<T>) => {
    setState({
      data: null,
      isLoading: true,
      error: null,
    });

    try {
      const data = await asyncFn();

      setState({
        data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Ocurrió un error inesperado";

      setState({
        data: null,
        isLoading: false,
        error: message,
      });
    }
  }, []);

  return {
    ...state,
    run,
  };
};