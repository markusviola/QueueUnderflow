import React, { Component } from 'react';


class AsContenderChallengerItem extends Component {

    onUpdateStatusClicked(){
        this.props.instance.registryBatchUpdateStatuses([this.props.itemA.contenderHash])
        .then((isTransaction) => {
            this.props.toggleProcess(isTransaction);
        });
    }

    
    render() {
        let challengeStatus = "";
        let updateButton = "";
        let incentiveAmount = "";

        
        if(this.props.itemA.commitVoteExpiry === "Voting duration concluded." &&
            this.props.itemA.revealVoteExpiry === "Reveal duration concluded."){
            challengeStatus = <div>The voting is finished.<br/></div>
            updateButton = <div><button onClick={this.onUpdateStatusClicked.bind(this)}>Conclude Application</button><br/></div>
        }
        else{
            challengeStatus = <div>The voting is still on going.<br/></div>
        }
                   
    return (
        <div className="AsContenderChallengerItem">
            <strong>{this.props.itemA.contender}</strong><br/>
            {challengeStatus}
            {updateButton}
            {incentiveAmount}
            <br/>
        </div>
    );
  }
}

export default AsContenderChallengerItem;
