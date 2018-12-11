import React, { Component } from 'react';


class RegisterForm extends Component {

    constructor(){
        super();

        this.state = {
            minDeposit: "Calculating...",
            statement: ""
        }
    }

    componentDidMount(){
        this.props.instance.paramGet("minDeposit")
        .then((_minDeposit)=>{
            this.setState({minDeposit: _minDeposit});
        })
    }

    handleSubmit(e){
        console.log(window.web3.sha3((window.web3.eth.accounts[0]+this.refs.name.value+this.state.statement)));
        this.props.instance.registryRegister(this.refs.name.value, parseInt(this.state.minDeposit), this.state.statement)
        .then((isTransaction) => {
            this.props.onProcess(isTransaction);
        });
        e.preventDefault();
    }

    onStatementChange(evt){
        this.setState({statement: evt.target.value})
    }
    
    render() {

    return (
        <div className="Register">
            <h3>Register As Champion!</h3>
            <div className="divider"></div>
            <br/>
            <form onSubmit={this.handleSubmit.bind(this)}>
                <div>
                    <label>Champion Name:</label><br/>
                    <input type="text" ref="name" />
                </div>
                <div>
                    <label>Application Stake:</label><br/>
                    <input type="text" value={this.state.minDeposit} ref="stake" disabled/>
                </div>
                <div>
                    <label>Statement of Eligibility:</label><br/> 
                    <textarea onChange={this.onStatementChange.bind(this)} placeholder="Input some links of your porfolio or resume..." style={{width:"450px", height:"200px"}} />
                </div>
                <br/>
                <button type="submit">Submit</button>
            </form>    
            
            
        </div>
    );
  }
}

export default RegisterForm;
