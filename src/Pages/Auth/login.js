import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import FormInput from "../../Components/Form/input";
import Loader from "../../Components/Loader/Loading";
import Swal from "sweetalert2";
import axios from "../../api/axios";
// import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import Alert from "react-bootstrap/Alert";

const Login = () => {
  const [isShow, setIsShow] = useState(false);
  // loader state
  const [isLoading, setIsLoading] = useState(true);

  // const navigate = useNavigate();

  // create sync method to fetch
  useEffect(() => {
    const DataFetch = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 400);
    };

    DataFetch();
  }, []);
  const [values, setValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState([]);

  const inputs = [
    {
      id: 1,
      label: "Username",
      name: "username",
      type: "text",
      placeholder: "input username",
      // errorMessage: errors.username,
    },
    {
      id: 2,
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "input password",
      // errorMessage: errors.password,
    },
  ];

  // if (errors.password) {
  //   inputs[1].errorMessage = errors.password[0];
  // }

  // if (errors.username) {
  //   inputs[0].errorMessage = errors.username[0];
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.get("/sanctum/csrf-cookie");
      const { data } = await axios.post("/api/login-admin", {
        username: values.username,
        password: values.password,
      });
      setErrors("");
      secureLocalStorage.clear();
      secureLocalStorage.setItem("token", data.token);
      secureLocalStorage.setItem("username", data.user.username);
      secureLocalStorage.setItem("id", data.user.id);
      secureLocalStorage.setItem("menus", data.user.role.menu);
      secureLocalStorage.setItem("role", "admin");
      Swal.fire({ icon: "success", title: "Success!", html: "Login successfully", showConfirmButton: false, allowOutsideClick: false, allowEscapeKey: false, timer: 2000 });
      setTimeout(function () {
        // navigate('/dashboard', {replace:true})
        window.location.href = "/dashboard";
      }, 2000);
    } catch (e) {
      if (e?.response?.status === 422) {
        setErrors(e.response.data.errors);
        setIsShow(true);
      } else if (e?.response?.status === 404 || e?.response?.status === 403 || e?.response?.status === 401) {
        // Swal.fire({
        //   icon: "error",
        //   title: "Error!",
        //   html: e.response.data.message,
        //   showConfirmButton: true,
        //   allowOutsideClick: false,
        //   allowEscapeKey: false,
        // });
        setIsShow(true);
      } else {
        Swal.fire({ icon: "error", title: "Error!", html: "something went wrong", showConfirmButton: true, allowOutsideClick: false, allowEscapeKey: false });
      }
    }
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <div className="wrapper bg-dark  d-flex align-items-center justify-content-center w-100" style={{ height: "100vh" }}>
        <div className="login w-400 bg-white rounded-3" style={{ padding: 30 }}>
          <img src="./assets/icon/Male User.png" alt="login" style={{ marginLeft: "100px", marginBottom: "20px" }} />
          <h3 className="mb-1" style={{ fontSize: 23 }}>
            Login Admin
          </h3>

          {isShow === true && (
            <Alert variant="danger" className="py-1 px-2" style={{ width: "300px", fontSize: "13px" }} onClose={() => setIsShow(false)} dismissible>
              {/* <p> Account is not found. Please re-check the username and password you entered. </p> */}
              {errors.username && <p className="mb-0">{errors.username[0]}</p>}
              {errors.password && <p className="mb-0">{errors.password[0]}</p>}
            </Alert>
          )}
          <Form onSubmit={handleSubmit} style={{ width: "300px" }} className="mx-auto">
            {inputs.map((input) => (
              <Form.Group key={input.id} className="mb-2 ">
                <FormInput key={input.id} {...input} value={values[input.name]} onChange={onChange} icon={input.icon} />
              </Form.Group>
            ))}
            <Button type="submit" className=" btn btn-block col-12 mt-2 mb-2 rounded" style={{ background: "#B21830", color: "white" }}>
              Login
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};
export default Login;
