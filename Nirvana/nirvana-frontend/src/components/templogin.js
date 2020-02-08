import React, { Component } from 'react'
import { Toolbar, AppBar, IconButton, Typography, Button, Avatar, TextField } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import LockOpenTwoToneIcon from '@material-ui/icons/LockOpenTwoTone';
import GoogleButton from 'react-google-button';
import axios from 'axios';
import {api_gateway_url} from '../constants/constants'
import cookie from 'react-cookies'
import PrimarySearchAppBar from './navbar';
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
    handleSignup() {
        this.setState({ loginButtonText: "Sign Up", visibility: "visible" })
        // document.getElementsByName("confirmPassword")[0].parentElement.parentElement.style.visibility = 'visible';
    }
    userLogin(e) {
        e.preventDefault();
        const payload = {
            email: this.state.email,
            password: this.state.password
        }
        console.log(payload)
        axios.post(api_gateway_url + 'authenticateUser', payload).
        then(res=>{
            console.log(res)
            if(res.data["ApiCall"] == 'login Successful'){
                cookie.save('jwt', res.data['jwt'])
                // Route to the dashboard!............................................
                // Edit here later

            }
            
        })
        
    }
    userSignup(e) {
        e.preventDefault();
        const payload = {
            email: this.state.email,
            password: this.state.password,
            
        }
        console.log(payload)
        axios.post(api_gateway_url + 'signUP', payload).
        then(res=>{
            console.log(res)
            if(res.data["ApiCall"] == 'login Successful'){
                cookie.save('jwt', res.data['jwt'])
                // Route to the dashboard!............................................
                // Edit here later

            }
        })

    }
    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
      }

    render() {
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
                            <TextField id="standard-basic" label="Email" name="email" onChange={this.handleChange} />
                            <br />
                            <TextField id="standard-basic" label="Password" name="password" onChange={this.handleChange} />
                            <br />
                            <TextField style={{ visibility: this.state.visibility }} id="standard-basic" label="Confirm Password" name="confirmPassword" onChange={this.handleChange} />
                            <br />
                            <Button
                                variant="contained"
                                color="primary"
                                endIcon={<LockOpenTwoToneIcon />}
                                onClick={this.userLogin}
                            >
                                {this.state.loginButtonText}
                            </Button>
                            <br />
                            
                            
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
export default LoginForm
