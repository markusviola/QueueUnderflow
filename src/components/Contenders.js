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
            setTimeout(()=>{

                for(let i=0; i<result.length; i++){
                    
                    let updatedContenders = this.state.currentContenders;
                    var expiration;
                    var date1 = new Date(result[i].appExpiry*1000);
                    var date2 = new Date();

                    if(date2 > date1) expiration = "Process finished."
                    else expiration = "Application expires "+moment(date1).from(date2)+".";

                    
                    updatedContenders.push({
                        key: i+1,
                        contenderHash: result[i].contenderHash,
                        contender: result[i].desc,
                        issuer: result[i].issuer,
                        isChampion: result[i].isChampion,
                        challengeID: result[i].challengeID,
                        applicationExpiry: expiration
                    })
                    this.setState({currentContenders: updatedContenders});
                }
            }, 1000)
        });
    }

    getAllChallenges(){
        this.props.instance.registryGetAllChallenges()
        .then((result) => {
            setTimeout(()=>{

                for(let i=0; i<result.length; i++){
                    
                    let updatedChallenges = this.state.currentChallenges;

                    var commitExpiry;
                    var revealExpiry;
                    var now = new Date();
                    var commitEndDate = new Date(result[i].commitEndDate*1000);
                    var revealEndDate = new Date(result[i].revealEndDate*1000);
                    

                    if(now > commitEndDate) commitExpiry = "Voting duration concluded."
                    else commitExpiry = "Commit: Voting expires "+moment(commitEndDate).from(now)+". Keep voting!";

                    if(now > revealEndDate) revealExpiry = "Challenge duration concluded."
                    else revealExpiry = "Reveal: Confirmation expires "+moment(revealEndDate).from(now)+". Confirm now!"

                    
                    updatedChallenges.push({
                        key: i+1,
                        incentivePool: result[i].contenderHash,
                        isConcluded: result[i].desc,
                        commitState: result[i].commitExpiry,
                        revealState: result[i].revealExpiry
                    })
                    this.setState({currentChallenges: updatedChallenges});
                }
            }, 1000)
        })
    }   
    
    componentDidMount(){
        this.getContenderItems();
        this.getAllChallenges();
    }

    handleChallenge(_contenderHash){
        this.props.challengeClicked(_contenderHash);
    }

    render() {
        
        let items;
        if(this.state.currentContenders){
            items = this.state.currentContenders.map(item => {
                return (
                    <ContenderItem instance = {this.props.instance} challengeClicked = {this.handleChallenge.bind(this)} key={item.key} item = {item}/>
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
