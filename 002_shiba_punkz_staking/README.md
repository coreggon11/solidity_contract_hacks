# ShibaPunkz Staking

## Intro

I love ShibaPunkz and just wanted to check out the staking contract for xmas punks. When I saw the unstake function, I got to testing.

## Contract

https://www.shibariumscan.io/address/0x6A21B6176c23a57cD55d0e6dd7839cceeE3F7110?tab=contract

## Description

In this contract, you can stake your Spooky ShibaPunkz NFT during December, and after 20 days, you can claim a new XMas ShibaPunk NFT. For one staked, you get one xmas NFT. Or maybe more?

## Problem

Basically, the contract during unstake first sends the Xmas NFT, and only after that, it removes the information about staking. And since the user staking is our contract, it has the 
`onERC721Received` function. So, while the staking contract sends us the new beautiful Xmas Punk, we will call unstake again. We can do this multiple times, but for PoC, we did it only
once. The unstake function also sends us back our NFT, so after one successful unstake, we have to **send** it back to the contract so it does not revert. 

Since the staking functionality was not live yet I only did a test to test this with dummy NFT contracts. I notified the ShibaPunkz admin about this 
issue and a [new staking contract](https://www.shibariumscan.io/address/0xBA78D605a73B832c0A1a17e3fEF0141bF1d27F4E?tab=contract) was deployed.

