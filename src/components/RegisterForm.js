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
            <div className="card grey-text text-lighten-5 z-depth-0" style={{backgroundColor: "#7f2099", margin: 0,paddingTop: "1px", paddingBottom: "1px", paddingLeft: "30px", borderTopLeftRadius: "25px", borderBottomRightRadius: "25px"}}><h4>Register As Consultant</h4></div>
            <Card actions={[<a href='#' className="teal-text text-lighten-1" onClick={this.handleSubmit.bind(this)}><b>Confirm Application</b></a>]}>
                <div style={{color: "#999999"}}>
                    <div>
                        Consultant Name:
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
                </div>
                
            </Card>
        </div>
    );
  }
}

export default RegisterForm;
