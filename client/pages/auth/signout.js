import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import useRequest from '../../hooks/use-request';

const SignOut = () => {
  const router = useRouter();
  const [errors, doRequest] = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => router.push('/')
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out ...</div>;
};

export default SignOut;
