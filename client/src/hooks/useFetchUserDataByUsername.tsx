import { useEffect } from 'react'
import { useLazyGetUserDataByUsernameQuery } from '@/redux/api/userApi';
import { IUser } from '@/interfaces/interface';

interface useFetchUserDataByUsernameProps {
  username: string | undefined;
}

interface useFetchUserDataByUsernameReturn {
  user: IUser | undefined;
  isLoading: boolean;
  isError: boolean;
  error: any;
}

function useFetchUserDataByUsername({ username }: useFetchUserDataByUsernameProps): useFetchUserDataByUsernameReturn {
  const [getUserDataByUsername, { 
    data, 
    isLoading,
    isError,
    error,
  }] = useLazyGetUserDataByUsernameQuery();

  useEffect(() => { 
    if (username) {
      getUserDataByUsername({ username });
    }
  }, [username]);

  return { user: data?.user, isLoading, isError, error };
}

export default useFetchUserDataByUsername
