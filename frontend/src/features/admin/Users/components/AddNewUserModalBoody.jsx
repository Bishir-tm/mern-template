import { useState } from "react";
import { useDispatch } from "react-redux";
import ErrorText from "../../../../components/Typography/ErrorText";
import { showNotification } from "../../../common/headerSlice";
import { createUser } from "../usersSlice";

function AddUserModalBody({ closeModal }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    password: "",
    pin: "",
    bvn: "",
    role: "user", // Default role
  });

  const saveUser = () => {
    if (user.fullname.trim() === "")
      return setErrorMessage("Fullname is required!");
    if (user.email.trim() === "") return setErrorMessage("Email is required!");
    if (user.password.trim() === "")
      return setErrorMessage("Password is required!");

    setLoading(true);
    dispatch(createUser(user))
      .unwrap()
      .then(() => {
        dispatch(
          showNotification({ message: "User Created Successfully!", status: 1 })
        );
        closeModal();
      })
      .catch(() => {
        setErrorMessage("Failed to create user. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    setErrorMessage("");
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* Fullname */}
      <div className="mt-4">
        <label htmlFor="fullname" className="block text-sm font-medium">
          Fullname
        </label>
        <input
          type="text"
          id="fullname"
          name="fullname"
          value={user.fullname}
          onChange={handleInputChange}
          className="input input-bordered w-full mt-2"
          placeholder="Enter Fullname"
        />
      </div>

      {/* Email */}
      <div className="mt-4">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={user.email}
          onChange={handleInputChange}
          className="input input-bordered w-full mt-2"
          placeholder="Enter Email"
        />
      </div>

      {/* Password */}
      <div className="mt-4">
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={user.password}
          onChange={handleInputChange}
          className="input input-bordered w-full mt-2"
          placeholder="Enter Password"
        />
      </div>

      {/* PIN (Optional) */}
      <div className="mt-4">
        <label htmlFor="pin" className="block text-sm font-medium">
          PIN (Optional)
        </label>
        <input
          type="number"
          id="pin"
          name="pin"
          value={user.pin}
          onChange={handleInputChange}
          className="input input-bordered w-full mt-2"
          placeholder="Enter PIN"
        />
      </div>

      {/* BVN (Optional) */}
      <div className="mt-4">
        <label htmlFor="bvn" className="block text-sm font-medium">
          BVN (Optional)
        </label>
        <input
          type="number"
          id="bvn"
          name="bvn"
          value={user.bvn}
          onChange={handleInputChange}
          className="input input-bordered w-full mt-2"
          placeholder="Enter BVN"
        />
      </div>

      {/* Error Message */}
      <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>

      {/* Modal Actions */}
      <div className="modal-action">
        <button className="btn btn-error" onClick={closeModal}>
          Cancel
        </button>
        <button
          className={`btn btn-primary px-6 ${loading ? "loading" : ""}`}
          onClick={saveUser}
        >
          Save
        </button>
      </div>
    </>
  );
}

export default AddUserModalBody;
