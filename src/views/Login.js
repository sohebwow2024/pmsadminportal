import { useSkin } from "@hooks/useSkin";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Form,
  Label,
  Input,
  Button
} from "reactstrap";

import "@styles/react/pages/page-authentication.scss";
import logo from "@src/assets/images/logo/hostynnist-logo.png";
import { userDataStorage } from "../redux/usermanageReducer";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { skin } = useSkin();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!userName || !password) {
      toast.error("Enter username and password");
      return;
    }

    // Simple (no-API) login for local/testing use
    const mockUser = {
      UserName: userName,
      Username: userName,
      UserID: 1,
      LoginID: 1,
      Token: "local-dev-token",
      SecretKey: "123",
      UserRoleType: "SuperAdmin",
      UserRole: "SuperAdmin",
      Status: "Active",
      PropertyID: 1,
      HotelName: "Demo Hotel",
      CompanyID: 1,
      CompanyName: "Demo Company"
    };

    dispatch(userDataStorage(mockUser));

    // Router.js expects localStorage `userData` to be an array with `[0].UserRole`
    localStorage.setItem(
      "userData",
      JSON.stringify([
        {
          UserRole: mockUser.UserRole,
          userRole: mockUser.UserRole,
          username: userName,
          token: mockUser.Token,
          loginID: mockUser.LoginID,
          userID: mockUser.UserID
        }
      ])
    );

    toast.success(`Welcome ${userName}`);
    navigate("/dashboard", { replace: true });
  };

  const title = skin === "dark" ? "Welcome Back" : "Welcome Back";

  return (
    <div className="auth-wrapper auth-basic px-2">
      <div className="auth-inner my-2">
        <Card className="mb-0">
          <CardBody>
            <Link
              className="brand-logo"
              to="/"
              onClick={(e) => e.preventDefault()}
            >
              <h2 className="brand-text text-primary ms-1">Hostynnist</h2>
            </Link>

            <CardTitle tag="h4" className="mb-1">
              <img
                className="fallback-logo"
                height={28}
                width={30}
                src={logo}
                alt="logo"
              />{" "}
              {title}
            </CardTitle>

            <Form className="auth-login-form mt-2" onSubmit={handleLogin}>
              <Row>
                <Col xs="12" className="mb-1">
                  <Label className="form-label" for="login-username">
                    Username
                  </Label>
                  <Input
                    id="login-username"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    autoFocus
                    invalid={submitted && !userName}
                    placeholder="Enter username"
                  />
                </Col>

                <Col xs="12" className="mb-1">
                  <Label className="form-label" for="login-password">
                    Password
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    invalid={submitted && !password}
                    placeholder="Enter password"
                  />
                </Col>

                <Col xs="12">
                  <Button color="primary" type="submit" block>
                    Sign in
                  </Button>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Login;
