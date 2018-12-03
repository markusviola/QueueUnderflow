import React, { Component } from 'react';
import moment from 'moment';
import ProposalItem from './ProposalItem'

class Proposals extends Component {

    constructor(){
        super();

        this.state = {
            currentProposals: []
        }
    }

    getProposalItems(){
        this.props.instance.paramGetAllProposals()
        .then((result) => {
            setTimeout(()=>{

                for(let i=0; i<result.length; i++){
                    console.log("paramName: "+result[i].paramName);
                    console.log("paramVal: "+result[i].paramVal);
                    console.log("challengeID: "+result[i].challengeID);
                    console.log("proposalExpiry: "+result[i].proposalExpiry);
                    
                    let updatedProposals = this.state.currentProposals;
                    var expiration;
                    var date1 = new Date(result[i].proposalExpiry*1000);
                    var date2 = new Date();

                    if(date2 > date1) expiration = "Process finished."
                    else expiration = "Proposal expires "+moment(date1).from(date2)+".";

                    updatedProposals.push({
                        key: i+1,
                        paramName: result[i].paramName,
                        paramVal: result[i].paramVal,
                        challengeID: result[i].challengeID,
                        proposalExpiry: expiration,
                    })
                    this.setState({currentProposals: updatedProposals});
                }
            }, 1000)
        });
    }
    
    componentDidMount(){
        this.getProposalItems();
    }

    render() {
        
        let items;
        if(this.state.currentProposals){
            items = this.state.currentProposals.map(item => {
                return (
                    <ProposalItem key={item.key} item = {item}/>
                )
            });
        }

    return (
        <div className="Proposals">
            <h3>Proposals</h3>
            {items}
        </div>
    );
  }
}

export default Proposals;
