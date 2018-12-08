import React, { Component } from 'react';


class ProposalChallengerForm extends Component {

    constructor(){
        super();

        this.state = {
            minDeposit: "Calculating...",
            statement: "",
            selectedProposal: {}
        }
    }

    componentDidMount(){
        this.props.instance.paramGet("pMinDeposit")
        .then((_minDeposit)=>{
            this.setState({
                minDeposit: _minDeposit
            });
        })
    }

    handleSubmit(e){
        this.props.instance.paramChallengeProposal(this.props.selectedProposal.proposalID)
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
        <div className="ProposalChallengerForm">
            <h3>Challenge A Proposal!</h3>
            <form onSubmit={this.handleSubmit.bind(this)}>
                <div style={{width: "300px"}}>
                    <b><label>Parameter: {this.props.selectedProposal.paramName}</label></b><br/>
                    <b><label>Proposed Value: {this.props.selectedProposal.paramVal}</label></b><br/><br/>
                </div>
                <div>
                    <label>Challenge Stake:</label><br/>
                    <input type="text" value={this.state.minDeposit} ref="stake" disabled/>
                </div>
                <br/>
                <button type="submit">Submit</button>
            </form>    
        </div>
    );
  }
}

export default ProposalChallengerForm;
