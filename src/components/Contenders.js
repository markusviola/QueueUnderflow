import React, { Component } from 'react';


class Contenders extends Component {

    constructor(){
        super();
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
                }
            }, 1000)
            
            
        });
    }
    
    componentDidMount(){
        this.getContenderItems();
    }

    render() {

    return (
        <div className="Contenders">
            <h3>Contenders</h3>
            
        </div>
    );
  }
}

export default Contenders;
