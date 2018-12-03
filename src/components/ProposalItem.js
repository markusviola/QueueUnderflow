import React, { Component } from 'react';


class ProposalItem extends Component {

    constructor(){
        super();
    }

    render() {

        let challengeState;
        if(this.props.item.isChampion === true) challengeState = "proposal is already a accepted!";
        else if(this.props.item.challengeID === 0) {
            if(this.props.item.applicationExpiry === "Process finished."){
                challengeState = "proposal is in pending state."
            }
            else challengeState = "proposal remains unchallenged!";
        }
        else {
            if(this.props.item.applicationExpiry === "Process finished."){
                challengeState = "proposal is in pending state."
            }
            else challengeState = "proposal has been challenged!";
        }

    return (
        <div className="ProposalItem">
            <br/>
            <strong>{this.props.item.paramName}</strong><br/>
            Proposed Value: {this.props.item.paramVal}<br/>
            {this.props.item.proposalExpiry}
            <br/>
        </div>
    );
  }
}

export default ProposalItem;
