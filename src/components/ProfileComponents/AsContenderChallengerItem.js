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
            
            if(this.props.itemA.isConcluded){
                if(this.props.itemA.isChampion){
                    challengeStatus = <div>You lost the challenge.<br/></div>
                }
                else{
                    challengeStatus = <div>You won the challenge!<br/></div>
                }
            }
            else{
                challengeStatus = <div>The voting is finished.<br/></div>
                updateButton = <div><a className="waves-effect waves-light teal-text text-lighten-1" onClick={this.onUpdateStatusClicked.bind(this)}>
                <i className="material-icons right">done_all</i><b>Conclude</b></a><br/></div>
            }
        }
        else{
            challengeStatus = <div>The voting is still on going.<br/></div>
        }
                   
    return (
        <div className="AsContenderChallengerItem">
            <h6><b>{this.props.itemA.contender}</b></h6>
            {challengeStatus}
            {updateButton}
            {incentiveAmount}
            <br/>
        </div>
    );
  }
}

export default AsContenderChallengerItem;
