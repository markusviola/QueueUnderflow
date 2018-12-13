import React, { Component } from 'react';
import {Col, Card} from 'react-materialize';

class ProposalForm extends Component {

    constructor(){
        super();

        this.state = {
            minDeposit: "Calculating...",
            statement: "",
            paramName: "",
            paramVal: 0
        }
    }

    componentDidMount(){
        this.props.instance.paramGet("pMinDeposit")
        .then((_minDeposit)=>{
            this.setState({minDeposit: _minDeposit});
        })
    }

    handleSubmit(e){
        this.props.instance.paramProposeAdjustment(this.state.paramName, this.state.paramVal)
        .then((isTransaction) => {
            this.props.onProcess(isTransaction);
        });
        
        e.preventDefault();
    }

    onStatementChange(evt){
        this.setState({statement: evt.target.value})
    }

    onParamNameChange(evt){
        this.setState({paramName: evt.target.value})
    }

    onParamValChange(evt){
        this.setState({paramVal: evt.target.value})
    }

    
    render() {

    return (
        <Col m={7} s={12}>
            <Card actions={[<a href='#' className="orange-text text-darken-2" onClick={this.handleSubmit.bind(this)}><b>Submit Proposal</b></a>]}>
                <h4>Change The System!</h4>
                <div className="divider"></div>
                <br/>
                <div>
                    <label>Parameter Name:</label><br/>
                    <input type="text" onChange={this.onParamNameChange.bind(this)} />
                </div>
                <div>
                    <label>Proposed Value:</label><br/>
                    <input type="text" onChange={this.onParamValChange.bind(this)}/>
                </div>
                <div>
                    <label>Proposal Stake:</label><br/>
                    <input type="text" value={this.state.minDeposit} readOnly/>
                </div>
                <br/>
            </Card>
        </Col>
    );
  }
}

export default ProposalForm;
