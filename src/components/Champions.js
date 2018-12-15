import React, { Component } from 'react';
import ChampionItem from './ChampionItem';


class Champions extends Component {
    
    handleChallenge(contender){
        this.props.challengeClicked(contender);
    }

    render() {

        let process = "";
        if(this.props.dataStatus === true){
            process = <div><br/><div className="preloader-wrapper small active">
            <div className="spinner-layer">
              <div className="circle-clipper left">
                <div className="circle"></div>
              </div><div className="gap-patch">
                <div className="circle"></div>
              </div><div className="circle-clipper right">
                <div className="circle"></div>
              </div>
            </div>
          </div></div>
        }

        let items;
        if(this.props.currentContenders){
            items = this.props.currentContenders.filter((item) => {return item.contender === "" ? false: true}).map(item => {
                if(item.isChampion){
                    return (
                        <ChampionItem instance = {this.props.instance} challengeClicked = {this.handleChallenge.bind(this)} key={item.key} item = {item}/>
                    )
                }
            });
        }
            
    return (
        <div className="Champions">
            <h6 style={{color: "#666666"}}><b><i className="small material-icons right teal-text text-darken-1">thumb_up</i>Current Consultants</b></h6>
            <div className="divider"></div>
            {items}
            {process}
        </div>
    );
  }
}

export default Champions;
