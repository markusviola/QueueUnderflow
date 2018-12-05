import React, { Component } from 'react';
import moment from 'moment';
import ContenderItem from './ContenderItem'

class Contenders extends Component {

    constructor(){
        super();

        this.state = {
            currentContenders: [],
            currentChallenges: []
        }
    }

    getContenderItems(){
        this.props.instance.registryGetAllContenders()
        .then((result) => {
            for(let i=0; i<result.length; i++){
            
                let updatedContenders = this.state.currentContenders;
                var incentivePool = "N/A";
                var isConcluded = "N/A";
                var commitState = "N/A";
                var revealState = "N/A";

                var expiration;
                var applyExpiry = new Date(result[i].appExpiry*1000);
                var now = new Date();

                if(now > applyExpiry) expiration = "Process finished."
                else expiration = "Application expires "+moment(applyExpiry).from(now)+".";
                
                var challenges = this.state.currentChallenges
                for(let j=0; j<challenges.length; j++){
                    if(challenges[j].challengeID === result[i].challengeID){
                        incentivePool = challenges[j].incentivePool;
                        isConcluded = challenges[j].isConcluded;
                        commitState = challenges[j].commitState;
                        revealState = challenges[j].revealState;
                    }
                }
                
                updatedContenders.push({
                    key: i+1,
                    contenderHash: result[i].contenderHash,
                    contender: result[i].desc,
                    issuer: result[i].issuer,
                    isChampion: result[i].isChampion,
                    challengeID: result[i].challengeID,
                    applicationExpiry: expiration,
                    incentivePool: incentivePool,
                    isConcluded: isConcluded,
                    commitVoteExpiry: commitState,
                    revealVoteExpiry: revealState
                })

                this.setState({currentContenders: updatedContenders});
            }
        });
    }

    getAllChallenges(){
        return new Promise((resolve) => {
            this.props.instance.registryGetAllChallenges()
            .then((result) => {
                let i=0;
                for(; i<result.length; i++){
                    
                    let updatedChallenges = this.state.currentChallenges;

                    var commitExpiry;
                    var revealExpiry;
                    var now = new Date();
                    var commitEndDate = new Date(result[i].commitEndDate*1000);
                    var revealEndDate = new Date(result[i].revealEndDate*1000);
                    
                    if(now > commitEndDate) commitExpiry = "Voting duration concluded."
                    else commitExpiry = <div>{"Commit: Voting expires "+moment(commitEndDate).from(now)+". Keep voting!"}<br/></div>;

                    if(now > revealEndDate) revealExpiry = "Reveal duration concluded."
                    else revealExpiry = <div>{"Reveal: Confirmation expires "+moment(revealEndDate).from(now)+". Confirm now!"}<br/></div>;

                    updatedChallenges.push({
                        key: i+1,
                        challengeID: result[i].challengeID,
                        incentivePool: result[i].incentivePool,
                        isConcluded: result[i].isConcluded,
                        commitState: commitExpiry,
                        revealState: revealExpiry
                    })
                    this.setState({currentChallenges: updatedChallenges}, () => {
                        if(i === result.length -1){
                            resolve();
                        }
                    });
                }
            })
        })
        
    }   
    

    componentDidMount(){
        
        this.getAllChallenges().then(() => {
            this.getContenderItems();
        });
        
    }

    handleChallenge(_contenderHash){
        this.props.challengeClicked(_contenderHash);
    }

    handleToggleProcess(isTransaction){
        this.props.onProcess(isTransaction);
    }

    render() {
        
        let items;
        if(this.state.currentContenders){
            items = this.state.currentContenders.map(item => {
                return (
                    <ContenderItem toggleProcess = {this.handleToggleProcess.bind(this)} instance = {this.props.instance} challengeClicked = {this.handleChallenge.bind(this)} key={item.key} item = {item}/>
                )
            });
        }

    return (
        <div className="Contenders">
            <h3>Contenders</h3>
            {items}
        </div>
    );
  }
}

export default Contenders;
