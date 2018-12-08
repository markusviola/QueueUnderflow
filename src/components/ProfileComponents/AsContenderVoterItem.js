import React, { Component } from 'react';


class AsContenderVoterItem extends Component {

    constructor(){
        super();

        this.state = {
            salt: 0
        }
    }

    onUpdateStatusClicked(){
        this.props.instance.registryBatchUpdateStatuses([this.props.itemC.contenderHash])
        .then((isTransaction) => {
            this.props.toggleProcess(isTransaction);
        });
    }

    onRevealVoteUpClicked(){
        this.props.instance.PLCRRevealVote(this.props.itemC.challengeID, 1, this.state.salt)
        .then((isTransaction) => {
            this.props.toggleProcess(isTransaction);
        });
    }

    onRevealVoteDownClicked(){
        this.props.instance.PLCRRevealVote(this.props.itemC.challengeID, 0, this.state.salt)
        .then((isTransaction) => {
            this.props.toggleProcess(isTransaction);
        });
    }

    onRescueTokensClicked(){
        this.props.instance.PLCRRescueTokens(this.props.itemC.challengeID)
        .then((isTransaction) => {
            this.props.toggleProcess(isTransaction);
        });
    }

    onSaltChange(evt){
        this.setState({
            salt: evt.target.value
        })
    }

    render() {
        
        let challengeStatus = "";
        let updateButton = "";
        let incentiveAmount = "";
        let rescueButton = "";
        let votingButtons = "";
        let commitState = "";
        let revealState = "";
        let contenderName = this.props.itemC.contender;

        if(this.props.itemC.isConcluded){
            challengeStatus = <div>A challenge has been concluded.<br/></div>
            if(this.props.itemC.didReveal){
                if(this.props.itemC.wonTokens === 0) incentiveAmount = <div>You lost the challenge.<br/></div>
                else if(this.props.itemC.wonTokens > 0){
                    if(!this.props.itemC.hasClaimedReward){
                        incentiveAmount = <div>You won {this.props.itemC.wonTokens} tokens!<br/></div>
                    }
                    else{
                        challengeStatus = "";
                        contenderName = "";
                    }
                }
            }
            else{
                if(this.props.itemC.isTokenLocked){
                    incentiveAmount = <div>You missed to reveal your vote.<br/></div>
                    rescueButton = <div><button onClick={this.onRescueTokensClicked.bind(this)}>Rescue Tokens</button><br/></div>
                }
                else{
                    challengeStatus = "";
                    contenderName = "";        
                }
            }
        }
        else{
            if(this.props.itemC.commitVoteExpiry === "Voting duration concluded." &&
               this.props.itemC.revealVoteExpiry === "Reveal duration concluded."){
                challengeStatus = <div>The challenge is in pending state.<br/></div>
                commitState = <div>{this.props.itemC.commitVoteExpiry}<br/></div>;
                revealState = <div>{this.props.itemC.revealVoteExpiry}<br/></div>;
                updateButton = <div><button onClick={this.onUpdateStatusClicked.bind(this)}>Conclude Application</button><br/></div>
            }
            else{
                challengeStatus = <div>The voting is still on going.<br/></div>
                commitState = this.props.itemC.commitVoteExpiry;
                revealState = this.props.itemC.revealVoteExpiry;
                if(this.props.itemC.commitVoteExpiry !== "Voting duration concluded."){
                    revealState = <div>Reveal commences after voting stage.<br/></div>
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
        <div className="AsContenderVoterItem">
            <strong>{contenderName}</strong>
            {challengeStatus}
            {incentiveAmount}
            {commitState}
            {revealState}
            {votingButtons}
            {updateButton}
            {rescueButton}<br/>
        </div>
    );
  }
}

export default AsContenderVoterItem;
