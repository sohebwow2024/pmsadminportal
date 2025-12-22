// import { useSkin } from "@hooks/useSkin"
import { Link } from "react-router-dom"
import { Facebook, Twitter, Mail, GitHub } from "react-feather"
import InputPasswordToggle from "@components/input-password-toggle"
import {
  Row,
  Card,
  Col,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button
} from "reactstrap"
import "@styles/react/pages/page-authentication.scss"
import { useState } from "react"

const HouseKeepingLogin = () => {
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRemberME] = useState(false)

  console.log(email)
  console.log(password)
  return (
    <Row className="auth-inner m-0 d-flex justify-content-center">
      <Col
        className="align-items-center auth-bg px-2 p-lg-2 py-2"
        lg="6"
        sm="6"
      >
        <Card className="p-3">
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1">
              Login To New User
            </CardTitle>
            <CardText className="mb-2">
              Please sign-in to your account & start the adventure
            </CardText>
            <Form
              className="auth-login-form mt-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="mb-1">
                <Label className="form-label" for="login-email">
                  Email
                </Label>
                <Input
                  type="email"
                  id="login-email"
                  placeholder="john@example.com"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-1">
                <div className="d-flex justify-content-between">
                  <Label className="form-label" for="login-password">
                    Password
                  </Label>
                  <Link to="/forgot-password">
                    <small>Forgot Password?</small>
                  </Link>
                </div>
                <InputPasswordToggle
                  className="input-group-merge"
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-check mb-1">
                <Input type="checkbox" id="remember-me" checked={rememberMe === true} onChange={() => setRemberME(!rememberMe)}/>
                <Label className="form-check-label" for="remember-me">
                  Remember Me
                </Label>
              </div>
              <Button tag={Link} to="/housekeepinglogin/newloginuser" target='blank' color="primary" block>
                Sign in
              </Button>
            </Form>
          </Col>
        </Card>
      </Col>
    </Row>
  )
}

export default HouseKeepingLogin