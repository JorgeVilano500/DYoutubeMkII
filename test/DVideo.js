
 require('chai').use(require('chai-as-promised')).should();
const {ethers} = require('hardhat');
const {expect, assert} = require('chai')



const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
}

const ether = tokens; 


describe('Decentralized Video Test', () => {
    let dvideo;
    let videoCount, user1, accounts; 
    let videoCreation;

    beforeEach(async () => {
        // Get contracts
        let DVideo = await ethers.getContractFactory('DVideo');
        // deploy contracts
        dvideo = await DVideo.deploy();
        //get accounts to use 
         accounts = await ethers.getSigners();
        user1 = accounts[0];
        //get the videoCount 
        videoCount = await dvideo.videoCount();
        
        //create a video each time before deployment 
        videoCreation = await dvideo.mint('asdfadsfeadsfasdfae', 'Test Video', { value: ether(0.00005)})
        // have to create a new count on the video after making a new one 
        videoCount = await dvideo.videoCount();
    })

    describe('Deployment', ()=>{
        it('NFT Exists', async () => {
            // checks to see how many they can have
            expect(await dvideo.maxPerWallet()).to.equal(5);
            // checks the maxSupply
            expect(await dvideo.maxSupply()).to.equal(1000);
            // checks the mint price 
            expect(await dvideo.mintPrice()).to.equal(ether(0.00005))
        })
    })

    describe('Mint a Video', () => {
        it('Is Able to Create A Video', async () => {
            // expect(videoCreation).to.emit(dvideo, 'VideoUploaded').withArgs(videoCount,'asdfadsfeadsfasdfae', 'Test Video', user1)
            // expect(videoCreation).to.emit('VideoUploaded')
            // expect(await dvideo.videoCount()).to.equal(8)
            // jave tp ,ale sire that this is the first video created 
            assert.equal(videoCount, 1);

            // have to make sure that the video has the arguments needed to be created 
            // first with the id 
            // console.log(videoCreation)

            // should be rejected if these aren't present
            await dvideo.mint('', 'Video', {value: ether(0.00005)}).should.be.rejected;
            // should be rejected if there is no video title
            await dvideo.mint('Video Hash', '', {value: ether(0.00005)}).should.be.rejected;


        }) // have to refactor this code to make sure it is able to know a video was created

        it('Is Able to Retrieve Video', async () => {
            // have to get the video we stored in the blockchain
            let response = await dvideo.videos(videoCount)
            // have to check the id of the video to make sure it worked
            expect(response.id).to.equal(videoCount);
            // we have to check if the hash that we uploaded is the same as the one stored
            expect(response.hash).to.equal('asdfadsfeadsfasdfae')
            // have to check if the title is the same as the input 
            expect(response.title).to.equal('Test Video')
            // have to check if the author is the same 
            expect(response.author).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
        })
    })



})
