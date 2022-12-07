import { useState } from 'react';
import axios from 'axios';
const SignUp = () => {
  const [formInfo, setFormInfo] = useState({ email: '', password: '' });

  const [errors, setErrors] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/signup', {
        email: formInfo.email,
        password: formInfo.password
      });
      console.log(response.data);
    } catch (err) {
      setErrors(err.response.data);
    }
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
        {errors.length > 0 && (
          <div className="alert alert-danger">
            <h4>...Oops</h4>
            <ul className="my-0">
              {errors.map((err, i) => (
                <li key={i}>{err.message}</li>
              ))}
            </ul>
          </div>
        )}
        <button className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
