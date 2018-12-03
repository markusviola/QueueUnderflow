import React, { Component } from 'react';
import moment from 'moment';
import ContenderItem from './ContenderItem'

class Contenders extends Component {

    constructor(){
        super();

        this.state = {
            currentContenders: []
        }
    }

    getContenderItems(){
        this.props.instance.registryGetAllContenders()
        .then((result) => {
            setTimeout(()=>{

                for(let i=0; i<result.length; i++){
                    console.log("contender: "+result[i].desc);
                    console.log("issuer: "+result[i].issuer);
                    console.log("isChampion: "+result[i].isChampion);
                    console.log("challengeID: "+result[i].challengeID);
                    console.log("applicationExpiry: "+result[i].appExpiry);
                    
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
    
    componentDidMount(){
        this.getContenderItems();
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
