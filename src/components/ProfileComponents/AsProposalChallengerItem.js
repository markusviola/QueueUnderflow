import React, { Component } from 'react';


class AsProposalChallengerItem extends Component {

    onUpdateStatusClicked(){
        this.props.instance.paramProcessProposalResult(this.props.itemB.proposalID)
        .then((isTransaction) => {
            this.props.toggleProcess(isTransaction);
        });
    }

    
    render() {
        let challengeStatus = "";
        let updateButton = "";
        let incentiveAmount = "";

        
        if(this.props.itemB.commitVoteExpiry === "Voting duration concluded." &&
            this.props.itemB.revealVoteExpiry === "Reveal duration concluded."){
            challengeStatus = <div>The voting is finished.<br/></div>
            updateButton = <div><button onClick={this.onUpdateStatusClicked.bind(this)}>Conclude Application</button><br/></div>
        }
        else{
            challengeStatus = <div>The voting is still on going.<br/></div>
        }
                   
    return (
        <div className="AsProposalChallengerItem">
            <strong>{this.props.itemB.paramName}</strong><br/>
            Proposed Value: {this.props.itemB.paramVal}<br/>
            {challengeStatus}
            {updateButton}
            {incentiveAmount}
            <br/>
        </div>
    );
  }
}

export default AsProposalChallengerItem;
