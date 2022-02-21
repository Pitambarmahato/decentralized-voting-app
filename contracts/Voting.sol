// SPDX-License-Identifier: MIT

pragma solidity >=0.4.11 < 8.10.0;

contract Voting{

    address private manager;
    uint private id=0;
    uint private count=0;
    enum Confirmation{not_voted, voted}
    struct Candidate{
        string name;
        // address caddress;
        uint count;
    }

    struct CandidateVotes{
        address caddress;
        Confirmation step;
    }

    mapping(address => CandidateVotes) public cvotes;
    address[] voters;

    mapping(uint => Candidate) private candidates;

    constructor() public{
        manager = msg.sender;
    }

    function addCandidate(string memory _name) public{
        require(msg.sender==manager, "Only manager can add candidates");
        candidates[id].name = _name;
        // candidates[id].caddress = _caddress;
        id++;
    }

    function getCandidate(uint _id) public view returns(string memory){
        return candidates[_id].name;
    }

    function voteCandidate(uint _id) public{
        require(cvotes[msg.sender].step == Confirmation.not_voted, "You already voted in this election");
        candidates[_id].count++;
        cvotes[msg.sender].caddress = msg.sender;
        cvotes[msg.sender].step = Confirmation.voted;
        voters.push(msg.sender);
    }

    function getWinner() public view returns(string memory){
        uint largest = 0;
        uint index;
        for(uint i=0; i<id; i++){
            if(candidates[i].count > largest){
                largest = candidates[i].count;
                index = i;
            }
        }
        return candidates[index].name;
    }
}