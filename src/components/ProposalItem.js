import React, { Component } from 'react';


class ProposalItem extends Component {

    constructor(){
        super();

        this.state = {
            salt: 0,
            tokenValue: 0
        }
    }

    onChallengeClicked(){
        this.props.challengeClicked(this.props.item.proposalID);
    }

    onUpdateStatusClicked(){
        this.props.instance.paramProcessProposalResult(this.props.item.proposalID)
        .then((isTransaction) => {
            this.props.toggleProcess(isTransaction);
        });
    }

    onVoteUpClicked(){
        this.props.instance.PLCRCommitVote(this.props.item.challengeID, 1, this.state.salt, this.state.tokenValue)
        .then((isTransaction) => {
            this.props.toggleProcess(isTransaction);
        });
    }

    onVoteDownClicked(){
        this.props.instance.PLCRCommitVote(this.props.item.challengeID, 0, this.state.salt, this.state.tokenValue)
        .then((isTransaction) => {
            this.props.toggleProcess(isTransaction);
        });
    }

    onRevealVoteUpClicked(){
        this.props.instance.PLCRRevealVote(this.props.item.challengeID, 1, this.state.salt)
        .then((isTransaction) => {
            this.props.toggleProcess(isTransaction);
        });
    }

    onRevealVoteDownClicked(){
        this.props.instance.PLCRRevealVote(this.props.item.challengeID, 0, this.state.salt)
        .then((isTransaction) => {
            this.props.toggleProcess(isTransaction);
        });
    }

    onSaltChange(evt){
        this.setState({
            salt: evt.target.value
        })
    }

    onTokenAmountChange(evt){
        this.setState({
            tokenValue: evt.target.value
        })
    }

    render() {

        let challengeState;
        let challengeButton = "";
        let updateButton = "";
        let votingButtons = "";
        let commitState = "";
        let revealState = "";
        let proposalState = this.props.item.proposalExpiry;
        let hash = "";

        if(this.props.showHash){
            hash = this.props.item.proposalID;
        }
        if(this.props.item.isChampion === true) {
            challengeState = "proposal already accepted!";
            proposalState = "Challenge passed!"
            
        }
        else if(this.props.item.challengeID === 0) {
            if(this.props.item.proposalExpiry === "Process finished."){
                challengeState = "proposal is in pending state."
                updateButton = <div><button onClick={this.onUpdateStatusClicked.bind(this)}>Conclude Application</button><br/></div>
            }
            else {
                challengeState = "proposal remains unchallenged."
                challengeButton = <div><button onClick={this.onChallengeClicked.bind(this)}>Challenge!</button><br/></div>;
            }
                                    
        }
        else { 
            proposalState = "";
            if(this.props.item.commitVoteExpiry === "Voting duration concluded." &&
               this.props.item.revealVoteExpiry === "Reveal duration concluded."){

                challengeState = "proposal is in pending state."
                commitState = <div>{this.props.item.commitVoteExpiry}<br/></div>;
                revealState = <div>{this.props.item.revealVoteExpiry}<br/></div>;
                updateButton = <button onClick={this.onUpdateStatusClicked.bind(this)}>Conclude Application</button>
            }
            else {
                challengeState = "proposal has been challenged!";
                commitState = this.props.item.commitVoteExpiry;
                revealState = this.props.item.revealVoteExpiry;

                if(this.props.item.commitVoteExpiry !== "Voting duration concluded."){
                    revealState = "Reveal: Commences after voting stage.";
                    votingButtons = <div style={{display: "flex", justifyContent: "flex-start", width: "400px"}}>
                                <input type="number" placeholder="Salt" style={{width: "50px"}} onChange={this.onSaltChange.bind(this)}/>
                                <input type="number" placeholder="No. of Votes to Stake" style={{width: "100"}} onChange={this.onTokenAmountChange.bind(this)}/>
                                <button onClick={this.onVoteUpClicked.bind(this)}>Vote Up</button>
                                <button onClick={this.onVoteDownClicked.bind(this)}>Vote Down</button>
                            </div>
                }
                else{
                    votingButtons = <div style={{display: "flex", justifyContent: "flex-start", width: "400px"}}>
                                <input type="number" placeholder="Confirm salt" style={{width: "90px"}} onChange={this.onSaltChange.bind(this)}/>
                                <button onClick={this.onRevealVoteUpClicked.bind(this)}>Vote Up</button>
                                <button onClick={this.onRevealVoteDownClicked.bind(this)}>Vote Down</button>
                            </div>
                }
            }
        }

    return (
        <div className="ProposalItem">
            <br/>
            {hash}<br/>
            <strong>{this.props.item.paramName}</strong> {challengeState} <br/>
            Proposed Value: {this.props.item.paramVal}<br/>
            {proposalState}
            {commitState}
            {revealState}
            {votingButtons}
            {challengeButton}
            {updateButton}
        </div>
    );
  }
}

export default ProposalItem;
