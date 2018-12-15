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

    onVoteRevealClicked(){
        this.props.selectedChallengeToReveal(this.props.itemC.challengeID)
    }

    onRescueTokensClicked(){
        this.props.instance.PLCRRescueTokens(this.props.itemC.challengeID)
        .then((isTransaction) => {
            this.props.toggleProcess(isTransaction);
        });
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
                    rescueButton = <div><a className="waves-effect waves-light teal-text text-lighten-1" onClick={this.onRescueTokensClicked.bind(this)}>
                    <i className="material-icons right">restore</i><b>Rescue Tokens</b></a><br/></div>
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
                commitState = <div>Commit period concluded.<br/></div>;
                revealState = <div>Reveal period concluded.<br/></div>;
                updateButton = <div><a className="waves-effect waves-light teal-text text-lighten-1" onClick={this.onUpdateStatusClicked.bind(this)}>
                <i className="material-icons right">done_all</i><b>Conclude</b></a><br/></div>
            }
            else{
                challengeStatus = <div>The voting is still on going.<br/></div>
                commitState = this.props.itemC.commitVoteExpiry;
                revealState = this.props.itemC.revealVoteExpiry;
                if(this.props.itemC.commitVoteExpiry !== "Voting duration concluded."){
                    revealState = <div>Reveal commences after commit period.<br/></div>
                }
                else{
                    commitState = <div>Commit period concluded.<br/></div>;
                    votingButtons = <div><br/><a className="waves-effect waves-light teal-text text-lighten-1" onClick={this.onVoteRevealClicked.bind(this)}>
                    <i className="material-icons right">thumbs_up_down</i><b>Reveal Vote</b></a></div>
                }
            }
        }

        
    return (
        <div className="AsContenderVoterItem">
            <h6><b>{contenderName}</b></h6>
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
