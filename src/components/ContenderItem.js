import React, { Component } from 'react';


class ContenderItem extends Component {

    constructor(){
        super();
    }

    onChallengeClicked(){
        this.props.challengeClicked(this.props.item.contenderHash);
    }

    onUpdateStatusClicked(){
        this.props.instance.registryBatchUpdateStatuses([this.props.item.contenderHash]);
    }

    render() {

        let challengeState;
        let challengeButton = "";
        let updateButton = "";

        if(this.props.item.isChampion === true) challengeState = "is already a champion!";
        else if(this.props.item.challengeID === 0) {
            if(this.props.item.applicationExpiry === "Process finished."){
                challengeState = "is in pending state."
                updateButton = <button onClick={this.onUpdateStatusClicked.bind(this)}>Update Status</button>
            }
            else {
                challengeState = "remains unchallenged."
                challengeButton = <button onClick={this.onChallengeClicked.bind(this)}>Challenge!</button>
            }
                                    
        }
        else {
            if(this.props.item.applicationExpiry === "Process finished."){
                challengeState = "is in pending state."
                updateButton = <button onClick={this.onUpdateStatusClicked.bind(this)}>Update Status</button>
            }
            else {
                challengeState = "has been challenged!";
            }
        }

    return (
        <div className="ContenderItem">
            <br/>
            <strong>{this.props.item.contender}</strong> {challengeState} {challengeButton} {updateButton} <br/>
            {this.props.item.applicationExpiry}
            <br/>
        </div>
    );
  }
}

export default ContenderItem;
