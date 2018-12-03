import Web3 from 'web3'
import contracts from './ContractInstances';

class AugTCR {

    constructor() {
        
        this.paramNames = [
            "minDeposit", 
            "pMinDeposit", 
            "applyStageLen", 
            "pApplyStageLen", 
            "commitStageLen", 
            "pCommitStageLen",
            "revealStageLen",
            "pRevealStageLen",
            "dispensationPct",
            "pDispensationPct",
            "voteQuorum",
            "pVoteQuorum"
        ]

        //Initializes the Web3 connection instance.
        if(typeof window.web3 != 'undefined'){
            console.log("Using web3 detected from external source like Metamask");
            window.web3 = new Web3(window.web3.currentProvider);
        }
        else {
            window.web3 = new Web3(new 
            Web3.providers.HttpProvider("http://localhost:8545"));
        }
        
        console.log("Current Account: "+window.web3.eth.accounts[0]);
        //Sets the account, for it to be recognized by Metamask 
        window.web3.eth.defaultAccount = window.web3.eth.accounts[0];

        //Sets the contract connection for the instance.
        const OrchContract = window.web3.eth.contract(contracts.orchestratorABI);
        this.contractInstance = OrchContract.at(contracts.orchestratorAddress);
        
    }

    //Events
    PLCROperationEvent(){
        return new Promise((resolve)=>{
            this.plcrInstance.OperationSuccess().watch((error, result)=>{
                if(!error) {
                    resolve([true,"Transaction successful!"]);
                }
                else resolve([false, "Transaction failed."]);
            })
        }); 
    }

    paramOperationEvent(){
        return new Promise((resolve)=>{
            this.parameterizerInstance.OperationSuccess().watch((error, result)=>{
                if(!error) {
                    resolve(true);
                }
                else resolve(false);
            })
        }); 
    }

    paramNewProposal(){
        return new Promise((resolve)=>{
            this.parameterizerInstance.NewProposal().watch((error, result)=>{
                if(!error) {
                    resolve([true,"New proposal has been raised!"]);
                }
                else resolve([false, "Transaction failed."]);
            })
        }); 
    }
    
    paramNewProposalChallenge(){
        return new Promise((resolve)=>{
            this.parameterizerInstance.NewProposalChallenge().watch((error, result)=>{
                if(!error) {
                    resolve([true,"A proposal has been disputed!"]);
                }
                else resolve([false, "Transaction failed."]);
            })
        }); 
    }

    registryOperationEvent(){
        return new Promise((resolve)=>{
            this.registryInstance.OperationSuccess().watch((error, result)=>{
                if(!error) {
                    resolve(true);
                }
                else resolve(false);
            })
        }); 
    }
    
    registryNewContender(){
        return new Promise((resolve) => {
            this.registryInstance.NewContender().watch((error, result)=>{
                if(!error) {
                    resolve([true, "A new contender has been added!"]);
                }
                else resolve([false, "Transaction failed."]);
            })
        })
    }

    registryNewChallenge(){
        return new Promise((resolve) => {
            this.registryInstance.NewChallenge().watch((error, result)=>{
                if(!error) {
                    resolve([true, "A contender has been challenged!"]);
                }
                else resolve([false, "Transaction failed."]);
            })
        })
    }


    //Environment Builder
    initEnvironmentWithToken(_token, _registryName, _parameters){
        this.contractInstance.buildEnv(_token, _registryName, _parameters,
            {gas: 3000000, from: window.web3.eth.accounts[0]},(err, result) => {
                alert("Transaction Successful!");
            }
        );
    }

    initEnvironmentAndToken(_supply, _tokenName, _decimals, _symbol, _parameters, _registryName){
        this.contractInstance.buildEnvAndToken(window.web3.toWei(_supply, 'ether'), _tokenName, _decimals, _symbol, _parameters, _registryName,
            {gas: 3000000, from: window.web3.eth.accounts[0]},(err, result) => {
                alert("Transaction Successful!");
            }
        );
    }

    //There should be a looper to navigate instances.
    retrieveEnvironmentInstance(_id, _creator){

        return new Promise((resolve) => {
            this.contractInstance.getEnvInstances(_id, _creator,
                {from: window.web3.eth.accounts[0]},
                (err, result) => {
                    console.log("PLCR: "+result[0])
                    console.log("Parameterizer: "+result[1])
                    console.log("Registry: "+result[2])
                    resolve(result);
                }
            );
        });
    }

    //Instance Setter
    setEnvironmentInstance(plcrAddress, paramAddress, regAddress){
        
        return new Promise((resolve) => {
            const PLCRContract = window.web3.eth.contract(contracts.plcrABI);
            this.plcrInstance = PLCRContract.at(plcrAddress);

            const ParameterizerContract = window.web3.eth.contract(contracts.parameterizerABI);
            this.parameterizerInstance = ParameterizerContract.at(paramAddress);

            const RegistryContract = window.web3.eth.contract(contracts.registryABI);
            this.registryInstance = RegistryContract.at(regAddress);

            resolve();
        });

    }

    //PLCR Functions

    PLCRTokenFaucet(_value){
        return new Promise((resolve)=>{
            this.plcrInstance.tokenFaucet(_value,
                {gas: 3000000, from: window.web3.eth.accounts[0], value: 3000000},
                (err, result) => {
                    if(typeof result === 'undefined'){
                        resolve(false)
                    }
                    else resolve(true)
                }
            );
        }); 
    }

    PLCRGetVotingBalance(){
        return new Promise((resolve) => {
            this.plcrInstance.getVotingBalance({from: window.web3.eth.accounts[0]},(err, result) => {
                resolve(result.c[0]);
            }    
        );
        });
    }

    PLCRGetTokenAddress(){
        return new Promise((resolve) => {
            this.plcrInstance.token.call((err, result) => {
                resolve(result);
            });
        });
        
    }

    PLCRGetPoll(_pollID){
        this.plcrInstance.getPoll(_pollID,
            (err, result) => {
                console.log(result);
            }    
        );
    }

    PLCRRequestVotingRights(_numTokens){
        this.plcrInstance.requestVotingRights(_numTokens,
            {gas: 300000, from: window.web3.eth.accounts[0]},
            (err, result) => {
                alert("Transaction Successful!");
            }
        );
    }

    PLCRWithdrawVotingRights(_numTokens) {
        this.plcrInstance.withdrawVotingRights(_numTokens,
            {gas: 300000, from: window.web3.eth.accounts[0]},
            (err, result) => {
                alert("Transaction Successful!");
            }
        );
    }

    PLCRCommitVote(_pollID, _voteOption, _salt, _numTokens){
        this.plcrInstance.commitVote(_pollID, window.web3.utils.keccak256(_voteOption+ '' +_salt), _numTokens, 0,
            {gas: 3000000, from: window.web3.eth.accounts[0]},
            (err, result) => {
                alert("Transaction Successful!");
            }
        );
    }

    PLCRRevealVote(_pollID, _voteOption, _salt){
        this.plcrInstance.revealVote(_pollID, _voteOption, _salt,
            {gas: 3000000, from: window.web3.eth.accounts[0]},
            (err, result) => {
                alert("Transaction Successful!");
            }
        );
    }

    PLCRAAAExpireCommitDuration(_pollID){
        this.plcrInstance.AAAexpireCommitDuration(_pollID,
            {gas: 3000000, from: window.web3.eth.accounts[0]},
            (err, result) => {
                if(typeof result === 'undefined'){
                    alert("Transaction Failed!")
                }
                else alert("Transaction Successful!");
            }
        );
    }

    PLCRAAAExpireRevealDuration(_pollID){
        this.plcrInstance.AAAexpireRevealDuration(_pollID,
            {gas: 3000000, from: window.web3.eth.accounts[0]},
            (err, result) => {
                if(typeof result === 'undefined'){
                    alert("Transaction Failed!")
                }
                else alert("Transaction Successful!");
            }
        );
    }

    //Registry Functions
    registryRegister(_desc, _amount, _extra){
        return new Promise((resolve) => {
            this.registryInstance.register(window.web3.sha3((window.web3.eth.accounts[0]+_desc+_extra)), _amount, _desc, _extra,
                {gas: 3000000, from: window.web3.eth.accounts[0]},
                (err, result) => {
                    if(typeof result === 'undefined'){
                        resolve(false)
                    }
                    else resolve(true)
                }
            );
        });
    }

    registryDeposit(_contenderHash, _amount){
        this.registryInstance.deposit(_contenderHash, _amount,
            {gas: 3000000, from: window.web3.eth.accounts[0]},
            (err, result) => {
                alert("Transaction Successful!");
            }
        );
    }

    registryWithdraw(_contenderHash, _amount){
        this.registryInstance.withdraw(_contenderHash, _amount,
            {gas: 3000000, from: window.web3.eth.accounts[0]},
            (err, result) => {
                alert("Transaction Successful!");
            }
        );
    }

    registryChallenge(_contenderHash, _evidence){
        
        return new Promise((resolve) => {
            this.registryInstance.challenge(_contenderHash, _evidence,
                {gas: 3000000, from: window.web3.eth.accounts[0]},
                (err, result) => {
                    if(typeof result === 'undefined'){
                        resolve(false)
                    }
                    else resolve(true)
                }
            );
        });
    }

    //Array of Bytes32
    registryBatchUpdateStatuses(_contenderHashes){
        return new Promise((resolve) => {
            this.registryInstance.batchUpdateStatuses(_contenderHashes,
                {gas: 3000000, from: window.web3.eth.accounts[0]},
                (err, result) => {
                    if(typeof result === 'undefined'){
                        resolve(false)
                    }
                    else resolve(true)
                }
            );
        });
    }

    //Array of Integer
    registryBatchClaimIncentives(_challengeIDs){
        this.registryInstance.batchClaimIncentives(_challengeIDs,
            {gas: 3000000, from: window.web3.eth.accounts[0]},
            (err, result) => {
                alert("Transaction Successful!");
            }
        );
    }

    registryViewVoterIncentive(_voter, _challengeID){
        this.registryInstance.viewVoterIncentive(_voter, _challengeID,
            (err, result) => {
                return result;
            }
        );
    }

    registryIncentiveClaimStatus(_challengeID, _voter){
        this.registryInstance.incentiveClaimStatus(_challengeID, _voter,
            (err, result) => {
                return result;
            }
        );
    }

    registryIsChampion(_contenderHash){
        this.registryInstance.incentiveClaimStatus(_contenderHash,
            (err, result) => {
                return result;
            }
        );    
    }

    registryAAAExpireApplication(_contenderHash){
        this.registryInstance.AAAexpireApplication(_contenderHash,
            {gas: 3000000, from: window.web3.eth.accounts[0]},
            (err, result) => {
                if(typeof result === 'undefined'){
                    alert("Transaction Failed!")
                }
                else alert("Transaction Successful!");
            }
        );
    }
    
    registryGetContenderNonce() {
        return new Promise((resolve) => {
            this.registryInstance.getContenderNonce(
                (err, result) => {
                    console.log(result);
                    resolve(result);
                }
            );   
        });
    }

    registryGetContender(_contenderHash) {
        return new Promise((resolve) => {
            this.registryInstance.getContender(_contenderHash,
                (err, result) => {
                    return {
                        desc: result[0],
                        challengeID: result[1].c[0],
                        appExpiry: result[2],
                        isChampion: result[3],
                        issuer: result[4]    
                    };
                }
            );  
        });
    }

    registryGetAllContenders(){

        return new Promise((resolve) => {
            let contenders = []
            this.registryInstance.getContenderNonce(
                (err, nonce) => {
                    for(let i = 0; i<nonce.length; i++){
                        this.registryInstance.getContender(nonce[i],
                            (err, result) => {
                                contenders.push({
                                    contenderHash: nonce[i],
                                    desc: result[0],
                                    challengeID: result[1].c[0],
                                    appExpiry: result[2].c[0],
                                    isChampion: result[3],
                                    issuer: result[4]
                                });
                            }
                        );
                        if(i === nonce.length - 1){
                            resolve(contenders);
                        }
                    }
                }
            );   
        });
        
    }

    registryGetChallengeNonce() {
        this.registryInstance.getChallengeNonce(
            (err, result) => {
                console.log(result);
                return result;
            }
        );   
    }

    registryGetChallenge(_challengeID) {
        let challenge = {}
        this.registryInstance.getChallenge(_challengeID,
            (err, result) => {
                challenge.isConcluded = result[0];
                challenge.incentivePool = result[1].c[0];
                this.plcrInstance.getPoll(_challengeID,
                    (err, result) => {
                        challenge.commitEndDate = result[0].c[0];
                        challenge.revealEndDate = result[1].c[0];
                        return challenge;
                    }    
                );
            }
        );  
    }

    registryGetAllChallenges(){
        let challenges = []
        this.registryInstance.getChallengeNonce(
            (err, result) => {
                for(let i = 0; i<result.length; i++){
                    let challenge = {}
                    this.registryInstance.getChallenge(i,
                        (err, result) => {
                            challenge.isConcluded = result[0];
                            challenge.incentivePool = result[1].c[0];
                            this.plcrInstance.getPoll(i,
                                (err, result) => {
                                    challenge.commitEndDate = result[0].c[0];
                                    challenge.revealEndDate = result[1].c[0];
                                    challenges.push(challenge);
                                }    
                            );
                        }
                    );  
                    if(i === result.length - 1){
                        return challenges;
                    }
                }
            }
        );   
    }

    //Parameterizer Functions

    paramProposeAdjustment(_paramName, _paramVal){
        return new Promise((resolve) => {
            this.parameterizerInstance.proposeAdjustment(_paramName, _paramVal,
                {gas: 3000000, from: window.web3.eth.accounts[0]},
                (err, result) => {
                    if(typeof result === 'undefined'){
                        resolve(false)
                    }
                    else resolve(true)
                }
            );
        });
    }
    
    paramChallengeProposal(_proposalID){
        return new Promise((resolve) => {
            this.parameterizerInstance.challengeProposal(_proposalID,
                {gas: 3000000, from: window.web3.eth.accounts[0]},
                (err, result) => {
                    if(typeof result === 'undefined'){
                        resolve(false)
                    }
                    else resolve(true)
                }
            );
        });
    }

    paramProcessProposalResult(_proposalID){
        this.parameterizerInstance.processProposalResult(_proposalID,
            {gas: 3000000, from: window.web3.eth.accounts[0]},
            (err, result) => {
                alert("Transaction Successful!");
            }
        );
    }

    paramBatchClaimIncentives(_challengeIDs){
        this.parameterizerInstance.batchClaimIncentives(_challengeIDs,
            {gas: 3000000, from: window.web3.eth.accounts[0]},
            (err, result) => {
                alert("Transaction Successful!");
            }
        );
    }

    paramViewVoterIncentive(_voter, _challengeID){
        this.parameterizerInstance.viewVoterIncentive(_voter, _challengeID,
            (err, result) => {
                return result;
            }
        ); 
    }

    paramIncentiveClaimStatus(_challengeID, _voter){
        this.parameterizerInstance.incentiveClaimStatus(_challengeID, _voter,
            (err, result) => {
                return result;
            }
        ); 
    }

    // paramSet(_name, _value){
    //     this.parameterizerInstance.set(_name, _value,
    //         {gas: 3000000, from: window.web3.eth.accounts[0]},
    //         (err, result) => {
    //             alert("Transaction Successful!");
    //         }
    //     );
    // }

    paramGet(_name){
        return new Promise((resolve) => {
            this.parameterizerInstance.get(_name,
                (err, result) => {
                    resolve(String(result.c[0]));
                }
            ); 
        });
    }

    paramGetAllParameterizers(){

        return new Promise((resolve) => {
            let parameterizers = []
            
            for(let i = 0; i<this.paramNames.length; i++){
                this.parameterizerInstance.get(this.paramNames[i],
                    (err, result) => {
                        parameterizers.push({
                            paramName: this.paramNames[i],
                            paramVal: result.c[0]
                        });
                    }
                );
                if(i === this.paramNames.length - 1){
                    resolve(parameterizers);
                }
            }     
        });    
    }

    paramGetProposalNonce() {
        this.parameterizerInstance.getProposalNonce(
            (err, result) => {
                console.log(result);
                return result;
            }
        );   
    }

    paramGetProposal(_contenderHash) {
        this.parameterizerInstance.getProposal(_contenderHash,
            (err, result) => {
                return {
                    paramName: result[0],
                    paramVal: result[1].c[0],
                    challengeID: result[2].c[0],
                    proposalExpiry: result[3].c[0],
                };
            }
        );  
    }

    paramGetAllProposals(){
        return new Promise((resolve) => {
        let proposals = []
            this.parameterizerInstance.getProposalNonce(
                (err, result) => {
                    for(let i = 0; i<result.length; i++){
                        this.parameterizerInstance.getProposal(result[i],
                            (err, result) => {
                                // console.log(result);
                                proposals.push({
                                    paramName: result[0],
                                    paramVal: result[1].c[0],
                                    challengeID: result[2].c[0],
                                    proposalExpiry: result[3].c[0],
                                });
                            }
                        );
                        if(i === result.length - 1){
                            resolve(proposals);
                        }
                    }
                }
            );   
        });    
    }

    paramGetChallengeNonce() {
        this.parameterizerInstance.getChallengeNonce(
            (err, result) => {
                console.log(result);
                return result;
            }
        );   
    }

    paramGetChallenge(_challengeID) {
        let challenge = {}
        this.parameterizerInstance.getChallenge(_challengeID,
            (err, result) => {
                challenge.isConcluded = result[0];
                challenge.incentivePool = result[1].c[0];
                this.plcrInstance.getPoll(_challengeID,
                    (err, result) => {
                        challenge.commitEndDate = result[0].c[0];
                        challenge.revealEndDate = result[1].c[0];
                        return challenge;
                    }    
                );
            }
        );  
    }

    paramGetAllChallenges(){
        let challenges = []
        this.parameterizerInstance.getChallengeNonce(
            (err, result) => {
                for(let i = 0; i<result.length; i++){
                    let challenge = {}
                    this.parameterizerInstance.getChallenge(i,
                        (err, result) => {
                            challenge.isConcluded = result[0];
                            challenge.incentivePool = result[1].c[0];
                            this.plcrInstance.getPoll(i,
                                (err, result) => {
                                    challenge.commitEndDate = result[0].c[0];
                                    challenge.revealEndDate = result[1].c[0];
                                    challenges.push(challenge);
                                }    
                            );
                        }
                    );  
                    if(i === result.length - 1){
                        return challenges;
                    }
                }
            }
        );   
    }

    paramAAAExpireProposal(_proposalID){
        this.parameterizerInstance.AAAexpireProposal(_proposalID,
            {gas: 3000000, from: window.web3.eth.accounts[0]},
            (err, result) => {
                if(typeof result === 'undefined'){
                    alert("Transaction Failed!")
                }
                else alert("Transaction Successful!");
            }
        );
    }

}

export default AugTCR;