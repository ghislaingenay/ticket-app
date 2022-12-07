import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const SignUp = () => {
  const [formInfo, setFormInfo] = useState({ email: '', password: '' });

  const [errors, doRequest] = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: { email: formInfo.email, password: formInfo.password },
    onSuccess: () => {
      Router.push('/');
    }
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    doRequest();
  };
  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <h1>Sign Up</h1>
        <div className="form-group">
          <label>Email Address</label>
          <input
            value={formInfo.email}
            onChange={(e) =>
              setFormInfo((prevValue) => {
                return { ...prevValue, email: e.target.value };
              })
            }
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            onChange={(e) =>
              setFormInfo((prevValue) => {
                return { ...prevValue, password: e.target.value };
              })
            }
            type="password"
            value={formInfo.password}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
