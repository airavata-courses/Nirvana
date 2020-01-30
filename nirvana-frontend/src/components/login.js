import React, { Component } from 'react'
import { Toolbar, AppBar, IconButton, Typography, Button, Avatar, TextField } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import LockOpenTwoToneIcon from '@material-ui/icons/LockOpenTwoTone';
import GoogleButton from 'react-google-button'
import { connect } from 'react-redux';
import { login } from '../redux/reducer';
import { SignUp } from '../redux/signupReducer';



class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            isLogin: true,
            loginButtonText: "Log In",
            visibility: "hidden"
        };
        this.userLogin = this.userLogin.bind(this);

        this.userSignup = this.userSignup.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSignup = this.handleSignup.bind(this);

    }
    handleSignup(){
        this.setState({loginButtonText: "Sign Up", visibility: "visible"})
        // document.getElementsByName("confirmPassword")[0].parentElement.parentElement.style.visibility = 'visible';
    }
    userLogin(e){
        e.preventDefault();
        this.props.login(this.state.email, this.state.password);
        this.setState({
        email: '',
        password: '',
        confirmPassword: ''
        });
    }
    userSignup(e)
    {
        e.preventDefault();
        this.props.SignUp(this.state.email, this.state.password, this.state.confirmPassword);
        this.setState({
            email: '',
            password: '',
            confirmPassword: ''
            });
    }
    handleChange(e)
    {   
        let name = e.target.name;
        let value = e.target.value;
        this.setState({name: value});
    }
   
    render() {
        let { isLoginPending, isLoginSuccess, loginError } = this.props;
        let { isSignUpPending, isSignUpSuccess, SignUpError } = this.props;


        return (
            <div>
                <div>
                    <AppBar position="static">
                        <Toolbar variant="dense">
                            <IconButton edge="start" color="inherit" aria-label="menu">

                            </IconButton>
                            <Typography variant="h6" color="inherit">
                                Photos
                            </Typography>
                        </Toolbar>
                    </AppBar>
                </div>
                <div>
                    <Card style={{ width: '50%', margin: 'auto' }}>
                        <CardContent>
                            <Avatar src="avatar.png" style={{ height: '20%', width: '20%', margin: 'auto' }} />
                            <TextField id="standard-basic" label="Email" name="email" onChange={this.handleChange}/>
                            <br />
                            <TextField id="standard-basic" label="Password" name="password" onChange={this.handleChange}/>
                            <br />
                            <TextField style={{visibility: this.state.visibility}} id="standard-basic" label="Confirm Password" name="confirmPassword" onChange={this.handleChange}/>
                            <br />
                            <Button
                                variant="contained"
                                color="primary"
                                endIcon={<LockOpenTwoToneIcon />}
                                onClick = {this.userLogin}
                            >
                                {this.state.loginButtonText}
                            </Button>
                            <br />
                            <GoogleButton
                                onClick={this.userSignup}
                            />
                            <div className="message">
                                {isLoginPending && <div>Please wait...</div>}
                                {isLoginSuccess && <div>Success.</div>}
                                {loginError && <div>{loginError.message}</div>}
                            </div>
                        </CardContent>
                        <CardActions>
                            <Button size="small"
                                onClick={this.handleSignup}
                            >
                            Sign Up!</Button>
                        </CardActions>
                    </Card>
                </div>
            </div>

        )
    }
}
const mapStateToProps = (state) => {
    return {
      isLoginPending: state.isLoginPending,
      isLoginSuccess: state.isLoginSuccess,
      loginError: state.loginError
    };
}
const mapStateToProps_SignUp = (state) => {
    return {
      isLoginPending: state.isLoginPending,
      isLoginSuccess: state.isLoginSuccess,
      loginError: state.loginError
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
      login: (email, password) => dispatch(login(email, password))
    };
}
const mapDispatchToProps_SignUp = (dispatch) => {
    return {
      login: (email, password) => dispatch(login(email, password))
    };
}

export default LoginForm;
