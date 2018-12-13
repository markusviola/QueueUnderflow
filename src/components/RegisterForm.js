import React, { Component } from 'react';
import {Card, CardTitle, Col} from 'react-materialize';
import registerImage from '../imgs/register.jpg'
class RegisterForm extends Component {

    constructor(){
        super();

        this.state = {
            minDeposit: "Calculating...",
            statement: "",
            name: ""
        }
    }

    componentDidMount(){
        this.props.instance.paramGet("minDeposit")
        .then((_minDeposit)=>{
            this.setState({minDeposit: _minDeposit});
        })
    }

    handleSubmit(){
        this.props.instance.registryRegister(this.state.name, parseInt(this.state.minDeposit), this.state.statement)
        .then((isTransaction) => {
            this.props.onProcess(isTransaction);
        });
    }

    onStatementChange(evt){
        this.setState({statement: evt.target.value})
    }

    onNameChange(evt){
        this.setState({name: evt.target.value})
    }

    
    render() {

    return (
        <div className="Register">
            <Card actions={[<a href='#' className="orange-text text-darken-2" onClick={this.handleSubmit.bind(this)}><b>Apply</b></a>]}>
                <h4>Register As Consultant!</h4>
                <div className="divider"></div>
                <br/>
                <div>
                    Consultant Name:<br/>
                    <input type="text" onChange={this.onNameChange.bind(this)} />
                </div>
                <div><br/>
                    Application Stake:<br/>
                    <input type="text" value={this.state.minDeposit} readOnly/>
                </div>
                <div><br/>
                    Statement of Eligibility:<br/><br/>
                    <textarea onChange={this.onStatementChange.bind(this)} placeholder=" Input some links of your porfolio or resume..." style={{width:"100%", height:"200px"}} />
                </div>
            </Card>
        </div>
    );
  }
}

export default RegisterForm;
