//SPDX-License-Identifier: MIT 

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import '@openzeppelin/contracts/access/Ownable.sol';

//1. model the video 
// 2.store the video 
// 3. upload the video
//4. list the videos 

contract DVideo is ERC721, Ownable {
    uint256 public videoCount = 0; 
     uint256 public mintPrice;
    uint256 public totalSupply; 
    uint256 public maxSupply; 
    uint256 public maxPerWallet; 
    bool public isPublicMintEnabled; 
    string internal baseTokenUri; 
    address payable public withdrawWallet; // would be able to withdraw from the wallet. 
    mapping(address=> uint256) public walletMints;// keeps tracks of the mints that have happened

    constructor() payable ERC721('Decentraview', 'DV') {
         mintPrice = 0.000050 ether;
        totalSupply = 0;
        maxSupply = 1000;
        maxPerWallet = 5; 
        //set withdraw wallet address
    }


    mapping(uint => Video) public videos; 
    // mapping(string=> Comment)

    string[] hashList; // will keep a list of the hashes and store them in here. These hashes are from ipfs and they will link us to video
    uint hashNum; // keeps track of the amount of hashes we have stored

    //1. model the video 
    struct Video {
        uint id; 
        string hash; 
        string title; 
        address author; 
    }

    event VideoUploaded(
        uint id, 
        string hash, 
        string title, 
        address author
    );


    function mint(string memory _videoHash, string memory _title) payable public { // if we want this contract to be upgradeable in the future we would want to have all functions be external so only a proxy smart contract that we have can interact with it
        // makes suer the hash exists
        require(bytes(_videoHash).length > 0, 'This Video doesnt exist');
        // makes sure that there is a proper titleal
        require(bytes(_title).length > 0, 'Make Sure to Post a good Title');
        // makes sure that the address sending this video exists. 
        require((msg.sender != address(0)));

        require(msg.value == mintPrice, 'Wrong Mint Value');
        require(totalSupply + 1 <= maxSupply, 'Sold Out'); // we are only adding one video at a time so we just add one to the total supply
        require(walletMints[msg.sender] + 1 <= maxPerWallet, 'You Have Exceeded the max count');
        videoCount ++;

        totalSupply ++;
        uint _newTokenId = totalSupply + 1; 
        videos[videoCount] = Video(videoCount, _videoHash, _title, msg.sender);
        _safeMint(msg.sender, _newTokenId);

        emit VideoUploaded(videoCount, _videoHash, _title, msg.sender);

       }


}