import React, { Component } from 'react';


class ProposalChallengerForm extends Component {

    constructor(){
        super();

        this.state = {
            minDeposit: "Calculating...",
            statement: "",
            proposalHash: ""
        }
    }

    componentDidMount(){
        this.props.instance.paramGet("pMinDeposit")
        .then((_minDeposit)=>{
            this.setState({
                minDeposit: _minDeposit,
                proposalHash: this.props.predefinedHash
            });
        })
    }

    handleSubmit(e){
        this.props.instance.paramChallengeProposal(this.refs.hash.value)
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
                    <label>Proposal ID:</label><br/>
                    <input type="text" ref="hash" value={this.state.proposalHash}/>
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
