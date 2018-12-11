import React, { Component } from 'react';


class ProposalForm extends Component {

    constructor(){
        super();

        this.state = {
            minDeposit: "Calculating...",
            statement: ""
        }
    }

    componentDidMount(){
        this.props.instance.paramGet("pMinDeposit")
        .then((_minDeposit)=>{
            this.setState({minDeposit: _minDeposit});
        })
    }

    handleSubmit(e){
        this.props.instance.paramProposeAdjustment(this.refs.paramName.value, this.refs.paramVal.value)
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
        <div className="ProposalForm">
            <h3>Change The System!</h3>
            <div className="divider"></div>
            <br/>
            <form onSubmit={this.handleSubmit.bind(this)}>
                <div>
                    <label>Parameter Name:</label><br/>
                    <input type="text" ref="paramName" />
                </div>
                <div>
                    <label>Proposed Value:</label><br/>
                    <input type="text" ref="paramVal"/>
                </div>
                <div>
                    <label>Proposal Stake:</label><br/>
                    <input type="text" value={this.state.minDeposit} ref="stake" disabled/>
                </div>
                <br/>
                <button type="submit">Submit</button>
            </form>    
        </div>
    );
  }
}

export default ProposalForm;
