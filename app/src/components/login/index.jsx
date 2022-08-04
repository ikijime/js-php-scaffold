import React, { Component } from 'react';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: ""
        }
    }

    onPasswordChange(e) {
        this.setState({ 
            password: e.target.value
        })
    }

    render () {
        const {password} = this.state;
        const {login, lenghtError, loginError } = this.props;

        let renderLengthError, renderError;
        console.log(lenghtError);
        renderLengthError = lenghtError ? <span className="login-error">Password to short</span> : null;
        renderError = loginError ? <span className="login-error">Invalid password</span> : null;

        return (
            <div className="login-container">
                <div className="login">
                <form>
                    {/* <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input className="form-control" id="username" aria-describedby="username" placeholder="Enter username" />
                    </div> */}
                    <div className="form-group">
                        <input 
                            type="password" 
                            className="form-control" 
                            id="inputPassword" 
                            value={password}
                            onChange={(e) => this.onPasswordChange(e)}
                            placeholder="Password" 
                        />
                    </div>
                    {renderLengthError}
                    {renderError}
                    <button 
                    //type="submit"
                    onClick={(e) => login(e, password)} 
                    className="btn mt-2
                    btn-primary">Submit</button>
                </form>
                </div>
            </div>
        )
    }
}