import React, { Component } from 'react';

class ContenderItem extends Component {

    constructor(){
        super();

        this.state = {
            
        }
    }

    onChallengeClicked(){
        this.props.challengeClicked(this.props.item);
    }

    onUpdateStatusClicked(){
        this.props.instance.registryBatchUpdateStatuses([this.props.item.contenderHash])
        .then((isTransaction) => {
            this.props.toggleProcess(isTransaction);
        });
    }

    onVoteRevealClicked(){
        this.props.selectedChallengeToReveal(this.props.item.challengeID)
    }

    onVoteCommitClicked(){
        this.props.selectedChallengeToCommit(this.props.item.challengeID)
    }

    printHashes(){
        console.log("Contender Hash: "+this.props.item.contenderHash+"  Challenge ID: "+this.props.item.challengeID);
    }

    render() {

        let challengeState;
        let challengeButton = "";
        let updateButton = "";
        let votingButtons = "";
        let commitState = "--";
        let revealState = "--";
        let applicationState = this.props.item.applicationExpiry;
    

        if(this.props.item.isChampion === true && this.props.item.isConcluded) {
            challengeState = "CHAMPION";
            applicationState = "Done"
            challengeButton = <div><a className="waves-effect waves-light teal-text text-lighten-2" onClick={this.onChallengeClicked.bind(this)}>
            <i className="material-icons right">remove_circle_outline</i><b>Rechallenge</b></a></div>
        }
        else if(this.props.item.challengeID === 0) {
            if(this.props.item.applicationExpiry === "Process finished."){
                applicationState = "Done"
                challengeState = "PENDING"
                updateButton = <a className="waves-effect waves-light teal-text text-lighten-2" onClick={this.onUpdateStatusClicked.bind(this)}>
                <i className="material-icons right">done_all</i><b>Conclude</b></a>
            }
            else {
                challengeState = "UNCHALLENGED"
                challengeButton = <a className="waves-effect waves-light teal-text text-lighten-2" onClick={this.onChallengeClicked.bind(this)}>
                <i className="material-icons right">remove_circle_outline</i><b>Challenge</b></a>
            }
                                    
        }
        else { 
            applicationState = "--";
            if(this.props.item.commitVoteExpiry === "Voting duration concluded." &&
               this.props.item.revealVoteExpiry === "Reveal duration concluded."){
                challengeState = "PENDING"
                commitState = <div>Done</div>;
                revealState = <div>Done<br/></div>;
                updateButton = <a className="waves-effect waves-light teal-text text-lighten-2" onClick={this.onUpdateStatusClicked.bind(this)}>
                <i className="material-icons right">done_all</i><b>Conclude</b></a>
            }
            else {
                challengeState = "CHALLENGED";
                commitState = this.props.item.commitVoteExpiry;
                revealState = this.props.item.revealVoteExpiry;
                if(this.props.item.commitVoteExpiry !== "Voting duration concluded."){
                    revealState = "Waiting";
                    votingButtons = <a className="waves-effect waves-light teal-text text-lighten-2" onClick={this.onVoteCommitClicked.bind(this)}>
                    <i className="material-icons right">thumbs_up_down</i><b>Commit Vote</b></a>
                }
                else{
                    commitState = <div>Done</div>;
                    votingButtons = <a className="waves-effect waves-light teal-text text-lighten-2" onClick={this.onVoteRevealClicked.bind(this)}>
                    <i className="material-icons right">thumbs_up_down</i><b>Reveal Vote</b></a>
                }
            }
        }

    return [
        <tr key className="ContenderItem">
            <td onClick={this.printHashes.bind(this)}><b>{this.props.item.contender}</b></td>
            <td><b>{challengeState}</b></td>
            <td>{applicationState}</td>
            <td>{commitState}</td>
            <td>{revealState}</td>
            <td className="right">
                {challengeButton}{votingButtons}{updateButton}
            </td>
        </tr>
    ];
  }
}

export default ContenderItem;
