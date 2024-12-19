import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../app/authSlice"; // Import the registerUser thunk
import { Link, useNavigate } from "react-router-dom";
import LoginHeroSection from "./LoginHeroSection";
import ErrorText from "../../components/Typography/ErrorText";
import InputText from "../../components/Input/InputText";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth); // Get loading and error from Redux

  const [registerObj, setRegisterObj] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const submitForm = async (e) => {
    e.preventDefault();

    const { fullname, email, password } = registerObj;
    if (!fullname || !email || !password) {
      return; // You can add additional client-side validation here
    }

    // Dispatch the register action
    await dispatch(
      registerUser({ fullname: fullname, email: email, password })
    );

    // If successful, redirect to the login page
    navigate("/login");
  };

  const updateFormValue = ({ updateType, value }) => {
    setRegisterObj({ ...registerObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-5xl shadow-xl">
        <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
          <div className="hidden md:block">
            <LoginHeroSection />
          </div>
          <div className="py-24 px-10">
            <h2 className="text-2xl font-semibold mb-2 text-center">
              Register
            </h2>
            <form onSubmit={submitForm}>
              <div className="mb-4">
                <InputText
                  defaultValue={registerObj.fullname}
                  updateType="fullname"
                  containerStyle="mt-4"
                  labelTitle="Full Name"
                  updateFormValue={updateFormValue}
                />
                <InputText
                  defaultValue={registerObj.email}
                  updateType="email"
                  containerStyle="mt-4"
                  labelTitle="Email"
                  updateFormValue={updateFormValue}
                />
                <InputText
                  defaultValue={registerObj.password}
                  type="password"
                  updateType="password"
                  containerStyle="mt-4"
                  labelTitle="Password"
                  updateFormValue={updateFormValue}
                />
              </div>

              {error && <ErrorText>{error}</ErrorText>}
              <button type="submit" className={`btn mt-2 w-full btn-primary`}>
                <span className={`${loading ? "loading" : ""}`}>Register</span>
              </button>

              <div className="text-center mt-4">
                Already have an account?{" "}
                <Link to="/login">
                  <span className="inline-block hover:text-primary hover:underline">
                    Login
                  </span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
