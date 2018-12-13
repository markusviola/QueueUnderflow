import React, { Component } from 'react';
import AsContenderChallengerItem from './ProfileComponents/AsContenderChallengerItem';
import AsProposalChallengerItem from './ProfileComponents/AsProposalChallengerItem';
import AsContenderVoterItem from './ProfileComponents/AsContenderVoterItem';
import AsProposalVoterItem from './ProfileComponents/AsProposalVoterItem';
import AsChampionItem from './ProfileComponents/AsChampionItem';


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
            votedProposalsStatus: false,
            profileType: "Regular",
            userChampions: [],
            wonVotedContenders: [],
            wonVotedProposals: []
        }
    }

    async determineUserType(){

        let currentProfileType = this.state.profileType;

        let champions = await this.props.currentContenders.filter((item) => {
            return (item.contender === "" || (!item.isChampion || !(item.issuer === this.props.instance.getCurrentAccount()))) ? false: true})
        
        if(champions.length > 0) currentProfileType = "Champion";
        else{
            let tokenRights = await this.props.instance.PLCRGetVotingBalance();    
            if(tokenRights > 0) {
                currentProfileType = "Token Voter";
            }
        }
        this.setState({userChampions: champions, profileType: currentProfileType}, ()=>{})
        
    }

    componentDidUpdate(prevProps){
        if(!this.props.dataStatusA && !this.props.dataStatusB && !this.props.dataStatusC && !this.props.dataStatusD){
            if ((this.props.dataStatusA !== prevProps.dataStatusA) || 
                (this.props.dataStatusB !== prevProps.dataStatusB) || 
                (this.props.dataStatusC !== prevProps.dataStatusC) || 
                (this.props.dataStatusD !== prevProps.dataStatusD)){
                this.getVotedContenders();
                this.getVotedProposals();
                this.determineUserType();
            }
        }
    }

    async getVotedContenders(){
        let updatedVotedContenders = []
        let wonIncentives = []
        for(let i=0; i<this.props.currentContenderChallenges.length; i++){

            let challenge = this.props.currentContenderChallenges[i];
            let didCommit = await this.props.instance.PLCRDidCommit(challenge.challengeID);
            if((challenge.challengeID === 0 || challenge.challenger === "") || !didCommit) continue;

            let didReveal = await this.props.instance.PLCRDidReveal(challenge.challengeID);
            let claimStatus = await this.props.instance.registryIncentiveClaimStatus(challenge.challengeID);
            if(claimStatus === "Error") continue;
            let contender = "Contender Eliminated"
            let contenderHash;
            let winnings = 0;
            let isTokenLocked = false;

            if(claimStatus === false && challenge.isConcluded){
                winnings = await this.props.instance.registryViewVoterIncentive(challenge.challengeID);
                if(winnings > 0) wonIncentives.push(challenge.challengeID);
            }

            for(let i=0; i<this.props.currentContenders.length; i++){
                if(this.props.currentContenders[i].challengeID === challenge.challengeID){
                    contender = this.props.currentContenders[i].contender;
                    contenderHash = this.props.currentContenders[i].contenderHash;
                }
            }

            let lastNode = await this.props.instance.PLCRGetLastNode();
            if(lastNode === challenge.challengeID){
                isTokenLocked = true;
            }

            updatedVotedContenders.push({
                key: i+1,
                contenderHash: contenderHash,
                contender: contender,
                challengeID: challenge.challengeID,
                incentivePool: challenge.incentivePool,
                isConcluded: challenge.isConcluded,
                commitVoteExpiry: challenge.commitVoteExpiry,
                revealVoteExpiry: challenge.revealVoteExpiry,
                wonTokens: winnings,
                hasClaimedReward: claimStatus,
                didReveal: didReveal,
                isTokenLocked: isTokenLocked
            });
        }
        this.setState({
            votedContenders: updatedVotedContenders, 
            votedContendersStatus: true,
            wonVotedContenders: wonIncentives
        }, () => {});
    }

    async getVotedProposals(){
        let updatedVotedProposals = []
        let wonIncentives = []
        for(let i=0; i<this.props.currentProposalChallenges.length; i++){

            let challenge = this.props.currentProposalChallenges[i];
            let didCommit = await this.props.instance.PLCRDidCommit(challenge.challengeID);
            if((challenge.challengeID === 0 || challenge.challenger === "") || !didCommit) continue;
            
            let didReveal = await this.props.instance.PLCRDidReveal(challenge.challengeID);
            let claimStatus = await this.props.instance.paramIncentiveClaimStatus(challenge.challengeID);
            if(claimStatus === "Error") continue;
            let paramName = "Parameter Proposal Rejected"
            let paramVal = "";
            let proposalID;
            let winnings = 0;
            let isTokenLocked = false;
            
            if(claimStatus === false && challenge.isConcluded){
                winnings = await this.props.instance.paramViewVoterIncentive(challenge.challengeID);
                if(winnings > 0) wonIncentives.push(challenge.challengeID);
            }
            
            for(let i=0; i<this.props.currentProposals.length; i++){
                if(this.props.currentProposals[i].challengeID === challenge.challengeID){
                    proposalID = this.props.currentProposals[i].proposalID;
                    paramName = this.props.currentProposals[i].paramName;
                    paramVal = this.props.currentProposals[i].paramVal;
                }
            }

            let lastNode = await this.props.instance.PLCRGetLastNode();
            if(lastNode === challenge.challengeID){
                isTokenLocked = true;
            }

            updatedVotedProposals.push({
                key: i+1,
                proposalID: proposalID,
                paramName: paramName,
                paramVal: paramVal,
                challengeID: challenge.challengeID,
                incentivePool: challenge.incentivePool,
                isConcluded: challenge.isConcluded,
                commitVoteExpiry: challenge.commitVoteExpiry,
                revealVoteExpiry: challenge.revealVoteExpiry,
                wonTokens: winnings,
                hasClaimedReward: claimStatus,
                didReveal: didReveal,
                isTokenLocked: isTokenLocked
            });
        }
        this.setState({
            votedProposals: updatedVotedProposals, 
            votedProposalsStatus: true,
            wonVotedProposals: wonIncentives
        }, () => {});
    }

    componentDidMount(){
        if (this.props.dataStatusA === false && 
            this.props.dataStatusB === false && 
            this.props.dataStatusC === false && 
            this.props.dataStatusD === false){

            this.getVotedContenders();
            this.getVotedProposals();
            this.determineUserType();
        }
    }

    handleToggleProcess(isTransaction){
        this.props.onProcess(isTransaction);
    }

    collectContenderIncentives(){
        this.props.instance.registryBatchClaimIncentives(this.state.wonVotedContenders)
        .then((isTransaction) => {
            this.props.onProcess(isTransaction);
            this.setState({wonVotedContenders: []})
        });
    }

    collectProposalIncentives(){
        this.props.instance.paramBatchClaimIncentives(this.state.wonVotedProposals)
        .then((isTransaction) => {
            this.props.onProcess(isTransaction);
            this.setState({wonVotedProposals: []})
        });      
    }

    
    render() {
        let processA = "";
        let processB = "";
        let processC = "";
        let processD = "";
        let championHeader = "";
        let proposalIncentivesButton = "";
        let contenderIncentivesButton = "";

        if(this.state.wonVotedContenders.length > 0) {
            contenderIncentivesButton = <button onClick={this.collectContenderIncentives.bind(this)}>Collect Incentives</button>;
        }
        if(this.state.wonVotedProposals.length > 0) {
            proposalIncentivesButton = <button onClick={this.collectProposalIncentives.bind(this)}>Collect Incentives</button>;
        }
        
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
        if(this.state.userChampions.length > 0){
            
            championHeader = <h3>Persona</h3>;
        }

        let items;
        if(this.state.userChampions){
            items = this.state.userChampions.map(item => {
                return (
                    <AsChampionItem toggleProcess = {this.handleToggleProcess.bind(this)} instance = {this.props.instance} key={item.key} item = {item}/>
                )
            });
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
            <div className="divider"></div>
            <strong>User Type: {this.state.profileType}</strong><br/>
            {championHeader}
            {items}
            

            <h3>Contenders</h3>
            <div className="divider"></div>
            <b>Challenged:</b>
            {processA}
            {itemsA}

            <b>Voted:</b>
            {contenderIncentivesButton}<br/><br/>
            {processB}
            {itemsC}

            <h3>Parameter Proposals</h3>
            <div className="divider"></div>
            <b>Challenged:</b>
            {processC}
            {itemsB}

            <b>Voted:</b>
            {proposalIncentivesButton}<br/><br/>
            {processD}
            {itemsD}
            
        </div>
    );
  }
}

export default Profile;
