import React, { Component } from 'react';
import AsContenderChallengerItem from './ProfileComponents/AsContenderChallengerItem';
import AsProposalChallengerItem from './ProfileComponents/AsProposalChallengerItem';
import AsContenderVoterItem from './ProfileComponents/AsContenderVoterItem';
import AsProposalVoterItem from './ProfileComponents/AsProposalVoterItem';


class Profile extends Component {

    constructor(){
        super();

        this.state = {
            challengedContenders: [],
            challengedProposals: [],
            votedContenders: [],
            votedProposals: [],
            challengedContendersStatus: false,
            challengedProposalsStatus: false,
            votedContendersStatus: false,
            votedProposalsStatus: false     
        }
    }

    componentDidUpdate(prevProps){
        if(!this.props.dataStatusA && !this.props.dataStatusB){
            if((this.props.dataStatusA !== prevProps.dataStatusA) || (this.props.dataStatusB !== prevProps.dataStatusB)){
                this.getVotedContenders();
                this.getVotedProposals();
            }
        }
    }

    //OPTIMIZE THIS NO NEED OF REVEAL JUST RECYCLE CONTENDER/PROPOSAL ITEM CONDITIONS
    async getVotedProposals(){
        let updatedVotedProposals = []
        for(let i=0; i<this.props.currentProposals.length; i++){

            let proposal = this.props.currentProposals[i];
            let didCommit = await this.props.instance.PLCRDidCommit(proposal.challengeID);
            if((proposal.challengeID === 0 || proposal.challenger === "") || !didCommit) continue;
            
            let claimStatus = await this.props.instance.paramIncentiveClaimStatus(proposal.challengeID);

            if(claimStatus === "Error") continue;
            let winnings = 0;
            
            if(claimStatus === false){
                winnings = await this.props.instance.paramViewVoterIncentive(proposal.challengeID);
                if(winnings === "Error") continue;
            }

            updatedVotedProposals.push({
                key: i+1,
                proposalID: proposal.proposalID,
                paramName: proposal.paramName,
                paramVal: proposal.paramVal,
                challengeID: proposal.challengeID,
                proposalExpiry: proposal.proposalExpiry,
                incentivePool: proposal.incentivePool,
                isConcluded: proposal.isConcluded,
                commitVoteExpiry: proposal.commitVoteExpiry,
                revealVoteExpiry: proposal.revealVoteExpiry,
                challenger: proposal.challenger,
                wonTokens: winnings,
                hasClaimedReward: claimStatus
            });
        }
        this.setState({votedProposals: updatedVotedProposals, votedProposalsStatus: true}, () => {console.log(this.state.votedProposals)});
    }

    //OPTIMIZE THIS NO NEED OF REVEAL JUST RECYCLE CONTENDER/PROPOSAL ITEM CONDITION
    async getVotedContenders(){
        let updatedVotedContenders = []
        for(let i=0; i<this.props.currentContenders.length; i++){

            let contender = this.props.currentContenders[i];
            let didCommit = await this.props.instance.PLCRDidCommit(contender.challengeID);
            if((contender.challengeID === 0 || contender.challenger === "") || !didCommit) continue;

            let claimStatus = await this.props.instance.registryIncentiveClaimStatus(contender.challengeID);
            if(claimStatus === "Error") continue;
            let winnings = 0;

            if(claimStatus === false){
                winnings = await this.props.instance.registryViewVoterIncentive(contender.challengeID);
                if(winnings === "Error") continue;
            }

            updatedVotedContenders.push({
                key: i+1,
                contenderHash: contender.contenderHash,
                contender: contender.contender,
                issuer: contender.issuer,
                isChampion: contender.isChampion,
                challengeID: contender.challengeID,
                applicationExpiry: contender.applicationExpiry,
                incentivePool: contender.incentivePool,
                isConcluded: contender.isConcluded,
                commitVoteExpiry: contender.commitVoteExpiry,
                commitVoteExpiry: contender.commitVoteExpiry,
                challenger: contender.challenger,
                wonTokens: winnings,
                hasClaimedReward: claimStatus
            });
        }
        this.setState({votedContenders: updatedVotedContenders, votedContendersStatus: true}, () => {console.log(this.state.votedContenders)});
    }

    componentDidMount(){
        if(this.props.dataStatusA === false && this.props.dataStatusB === false){
            this.getVotedContenders();
            this.getVotedProposals();
        }
    }

    handleToggleProcess(isTransaction){
        this.props.onProcess(isTransaction);
    }

    
    render() {
        let processA = "";
        let processB = "";
        let processC = "";
        let processD = "";

        
        if(this.props.dataStatusA === true){
            processA = <img id="process" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif" style={{width: "50px"}}/>
        }
        if(this.props.dataStatusB === true){
            processB = <img id="process" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif" style={{width: "50px"}}/>
        }
        if(this.state.votedContendersStatus === false){
            processC = <img id="process" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif" style={{width: "50px"}}/>
        }
        if(this.state.votedProposalsStatus === false){
            processD = <img id="process" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif" style={{width: "50px"}}/>
        }

        let itemsA;
        if(this.props.currentContenders){
            itemsA = this.props.currentContenders.filter(
                (itemA) => {
                    if(itemA.contender === "" ||
                    ((itemA.challengeID === 0 || itemA.challenger === "") || itemA.challenger !== this.props.instance.getCurrentAccount())) return false;
                    else return true;
                }).map(itemA => {
                return (
                    <AsContenderChallengerItem toggleProcess = {this.handleToggleProcess.bind(this)} instance = {this.props.instance}  key={itemA.key} itemA = {itemA}/>
                )
            });
        }

        let itemsB;
        if(this.props.currentProposals){
            itemsB = this.props.currentProposals.filter(
                (itemB) => {
                    if(itemB.paramName === "" ||
                    ((itemB.challengeID === 0 || itemB.challenger === "") || itemB.challenger !== this.props.instance.getCurrentAccount())) return false;
                    else return true;
                }).map(itemB => {
                return (
                    <AsProposalChallengerItem  toggleProcess = {this.handleToggleProcess.bind(this)} instance = {this.props.instance} key={itemB.key} itemB = {itemB}/>
                )
            });
        }

        let itemsC;
        if(this.state.votedContenders){
            itemsC = this.state.votedContenders.map(itemC => {
                return (
                    <AsContenderVoterItem toggleProcess = {this.handleToggleProcess.bind(this)} instance = {this.props.instance} key={itemC.key} itemC = {itemC}/>
                )
            });
        }

        let itemsD;
        if(this.state.votedProposals){
            itemsD = this.state.votedProposals.map(itemD => {
                return (
                    <AsProposalVoterItem toggleProcess = {this.handleToggleProcess.bind(this)} instance = {this.props.instance} key={itemD.key} itemD = {itemD}/>
                )
            });
        }

    return (
        <div className="Profile">

            <h3>Profile</h3>

            <h3>Contenders</h3>
            
            <h4>Challenged:</h4>
            {processA}
            {itemsA}
            
            <h4>Voted:</h4>
            {processB}
            {itemsB}

            <h3>Parameter Proposals</h3>
            
            <h4>Challenged:</h4>
            {processC}
            {itemsC}

            <h4>Voted:</h4>
            {processD}
            {itemsD}
            
        </div>
    );
  }
}

export default Profile;
