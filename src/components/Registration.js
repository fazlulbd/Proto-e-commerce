import React from 'react'
import { subBanner } from '../fackData/subBanner'
import { Col, Container, Row, Form, Button, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [fullnameerror, setFullnameerror] = useState('')
  const [emailerror, setEmailerror] = useState('')
  const [passworderror, setPassworderror] = useState('')
  const [showpassword, setShowpassword] = useState(false)
  const [firebaseerror, setFirebaseerror] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoaging] = useState(false)
  let emailValidation = (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
 
  const handelFullname =(e)=>{
    setFullname(e.target.value)
    setFullnameerror('')
  }
  const handelEmail =(e)=>{
    setEmail(e.target.value)
    setEmailerror('')
    setFirebaseerror('')
  }
  const handelPassword =(e)=>{
    setPassword(e.target.value)
    setPassworderror('')
  }
  const handelshowpassword = ()=>{
    setShowpassword(!showpassword)
  }

  const handelSubmit = (e)=>{
    e.preventDefault()
    if(!fullname){
      setFullnameerror("! Enter your names")
    }
    if(!email){
      setEmailerror("! Enter your email")
    }
    else{
      if(!emailValidation){
      setEmailerror("! Enter your valide email")
      }
    }
    if(!password){
      setPassworderror("! Enter a password")
    }
    if( fullname && email && password && emailValidation){
      setLoaging(true)
      createUserWithEmailAndPassword(auth, email, password)
      .then((user) => {
        updateProfile(auth.currentUser, {
          displayName: fullname
        }).then(() => {
          console.log(user)
          sendEmailVerification(auth.currentUser)
        .then(() => {
          setLoaging(false)
          setSuccess('Registration Successfull. Please varify your email ')
          setTimeout(()=>{
            console.log("hi")
            navigate("/login")
          },2000)
        });
        }).catch((error) => {
          console.log(error)
        }); 
      })
      .catch((error) => {
        const errorCode = error.code;
        if(errorCode.includes('auth/email-already-in-use')){
          setFirebaseerror("! Email alredy in use")
          setLoaging(false)
        }
      });
    }
   
    
  }
  return (
    <>
      <div className="text-center" style={{ background: `linear-gradient(rgba(0, 0, 0, 0.596),rgba(0, 0, 0, 0.596),rgba(0, 0, 0, 0.596)), url(${subBanner.img}) no-repeat center / cover` }}>
        <h3 className='bann-text'><strong>Registraton From</strong></h3>
      </div>
      <Container>
        <Row className='d-flex justify-content-center align-items-center mt-5'>
          <Col lg={6}>
            <div className='registration-item'>
              <Form>
                <Form.Group className="mb-3" controlId="formBasic">
                {
                    success &&
                    <p className='my-4 success text-success'>{success}</p>
                  }
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" onChange={handelFullname}/>
                  {
                    fullnameerror &&
                    <p className='errormessage'>{fullnameerror}</p>
                  }
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" onChange={handelEmail} />
                  {
                    emailerror &&
                    <p className='errormessage'>{emailerror}</p>
                  }
                </Form.Group>
                <Form.Group className="mb-3 password" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type={showpassword? "text" : 'password'} onChange={handelPassword} />
                  
                  {
                    showpassword?
                    <h5 onClick={handelshowpassword}> <AiOutlineEye/></h5>
                    :
                    <h5 onClick={handelshowpassword}> <AiOutlineEyeInvisible/></h5>
                  }

                  {
                    passworderror &&
                    <p className='errormessage'>{passworderror}</p>
                  }
                </Form.Group>
                {
                  loading ?
                  <Button variant="primary" disabled>
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Loading...
                  </Button>
                  :
                  <Button variant="success" className='px-5' type="submit" onClick={handelSubmit} >
                    Sign up
                  </Button>
                }
                
                
                {
                    firebaseerror &&
                    <p className='my-3 font-numito font-semibold font-sm text-red-600'>{firebaseerror}</p>
                  }
                <hr className='my-4'/>
                <Form.Text className="text-center mb-3">
                  Already have an account  ? <Link  to='/login' className="login-link"  >Sign In</Link>
                </Form.Text>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Registration
