import React, { Component } from 'react';
import AsContenderChallengerItem from './ProfileComponents/AsContenderChallengerItem';
import AsProposalChallengerItem from './ProfileComponents/AsProposalChallengerItem';
import AsContenderVoterItem from './ProfileComponents/AsContenderVoterItem';
import AsProposalVoterItem from './ProfileComponents/AsProposalVoterItem';
import AsChampionItem from './ProfileComponents/AsChampionItem';
import {Collapsible, CollapsibleItem, Card} from 'react-materialize'


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
            profileType: "Identifying Profile...",
            userChampions: [],
            wonVotedContenders: [],
            wonVotedProposals: [],
            revealCard: false,
            revealChallengeID: 0,
            salt: 0

        }
    }

    async determineUserType(){

        let currentProfileType = "Regular User";

        let champions = await this.props.currentContenders.filter((item) => {
            return (item.contender === "" || (!item.isChampion || !(item.issuer === this.props.instance.getCurrentAccount()))) ? false: true})
        
        if(champions.length > 0) currentProfileType = "Consultant";
        else{
            let tokenRights = await this.props.instance.PLCRGetVotingBalance();    
            if(tokenRights > 0) {
                currentProfileType = "Token Voter";
            }
        }

        if(champions.length > 0){
            this.setState({userChampions: [champions[0]]});    
        }
        this.setState({profileType: currentProfileType}, ()=>{})
        
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

    onRevealChallenge(id){
        this.setState({
            revealCard: true,
            revealChallengeID: id
        })
    }

    onRevealVoteUpClicked(){
        this.props.instance.PLCRRevealVote(this.state.revealChallengeID, 1, this.state.salt)
        .then((isTransaction) => {
            this.props.onProcess(isTransaction);
        });
    }

    onRevealVoteDownClicked(){
        this.props.instance.PLCRRevealVote(this.state.revealChallengeID, 0, this.state.salt)
        .then((isTransaction) => {
            this.props.onProcess(isTransaction);
        });
    }

    cancelCommit(){
        this.setState({
            revealCard: false,
            salt: 0
        })
    }

    onSaltChange(evt){
        this.setState({
            salt: evt.target.value
        })
    }
    
    render() {
        let process = "";
        let proposalIncentivesButton = "";
        let contenderIncentivesButton = "";
        let items;
        let itemsA;
        let itemsB;
        let itemsC;
        let itemsD;
        let userData = "";
        let revealCard = "";

        if(this.state.revealCard){
            revealCard = <div className="vote-card" style={{zIndex: "2"}}>
                <Card className="z-depth-2 white" actions={[
                <a href='#' className="teal-text text-lighten-1" onClick={this.onRevealVoteUpClicked.bind(this)}><b>Vote Up</b></a>,
                <a href='#' className="teal-text text-lighten-1" onClick={this.onRevealVoteDownClicked.bind(this)}><b>Vote Down</b></a>,
                <a href='#' className="teal-text text-lighten-1" onClick={this.cancelCommit.bind(this)}><b>Close</b></a>]}>
                    <h4 style={{color: "#666666"}}>Reveal Vote</h4>
                    <div className="divider"></div>
                    <br/>
                    <div>
                        <label>Committed Vote Key:</label><br/>
                        <input type="number" placeholder="Input your vote key" onChange={this.onSaltChange.bind(this)}/>
                    </div>
                </Card></div>
        }

        if(this.state.wonVotedContenders.length > 0) {
            contenderIncentivesButton = <div><a className="waves-effect waves-light teal-text text-lighten-1" onClick={this.collectContenderIncentives.bind(this)}>
            <i className="material-icons right">card_giftcard</i><b>Collect Incentives</b></a><br/><br/></div>
            
        }
        if(this.state.wonVotedProposals.length > 0) {
            proposalIncentivesButton = <div><a className="waves-effect waves-light teal-text text-lighten-1" onClick={this.collectProposalIncentives.bind(this)}>
            <i className="material-icons right">card_giftcard</i><b>Collect Incentives</b></a><br/><br/></div>
            
        }
        
        if(this.props.dataStatusA === true || this.props.dataStatusB === true || this.state.votedContendersStatus === false || this.state.votedProposalsStatus === false){
            process = <div className="progress" style ={{margin: "0"}}>
                        <div className="indeterminate"></div>
                    </div>
        }
        else{
            if(this.state.userChampions){
                items = this.state.userChampions.map(item => {
                    return (
                        <AsChampionItem toggleProcess = {this.handleToggleProcess.bind(this)} instance = {this.props.instance} key={item.key} item = {item}/>
                    )
                });
            }
    
            
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
    
            
            if(this.state.votedContenders){
                itemsC = this.state.votedContenders.map(itemC => {
                    return (
                        <AsContenderVoterItem selectedChallengeToReveal={this.onRevealChallenge.bind(this)} toggleProcess = {this.handleToggleProcess.bind(this)} instance = {this.props.instance} key={itemC.key} itemC = {itemC}/>
                    )
                });
            }
    
            
            if(this.state.votedProposals){
                itemsD = this.state.votedProposals.map(itemD => {
                    return (
                        <AsProposalVoterItem toggleProcess = {this.handleToggleProcess.bind(this)} instance = {this.props.instance} key={itemD.key} itemD = {itemD}/>
                    )
                });
            }

            userData = "teal-text text-lighten-1 bold";
        }
        

    return (
        <div className="Profile">
            
            <div className="card grey-text text-lighten-5 z-depth-0" style={{backgroundColor: "#7f2099", margin: 0,paddingTop: "1px", paddingBottom: "1px", paddingLeft: "30px", borderTopLeftRadius: "25px", borderBottomRightRadius: "25px"}}><h4>{this.state.profileType}</h4></div>
            <div className="card">
                
                <div style={{color: "#999999"}}>
                    {revealCard}
                    <div style={{paddingLeft:"30px", paddingTop: "15px"}}>
                        {items} 
                        <br/>
                    </div>
                    <div className = {userData}>
                    <Collapsible className="z-depth-0">
                        {process}
                        <CollapsibleItem header='Challenged Applicants' icon='format_list_numbered'>
                            <div style={{color: "#666666"}}>
                                {itemsA}
                            </div>
                        </CollapsibleItem>
                        <CollapsibleItem header='Voted Applicants' icon='format_list_numbered'>
                            <div style={{color: "#666666"}}>
                                {contenderIncentivesButton}
                                {itemsC}
                            </div>
                        </CollapsibleItem>
                        <CollapsibleItem header='Challenged System Petition' icon='settings'>
                            <div style={{color: "#666666"}}>
                                {itemsB}
                            </div>
                        </CollapsibleItem>
                        <CollapsibleItem header='Voted System Petition' icon='settings'>
                            <div style={{color: "#666666"}}>
                                {proposalIncentivesButton}<br/>
                                {itemsD}
                            </div>
                        </CollapsibleItem>
                    </Collapsible>
                    
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default Profile;
