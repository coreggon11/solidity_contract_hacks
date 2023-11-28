# Roulette

## Intro

Actually I came across this contract randomly. I was just looking at the verified contracts on chain and saw a roulette so I wanted to see how they managed to do randomness. 
And yes, the result was what I actually expected (no disrespect, actually I was looking for this).

## Contract

https://www.shibariumscan.io/address/0x2e7C1220E4C95e0828b9EeF55E2FC8CF3f1A1795?tab=contract

## Description

It is a simple roulette contract with `playRoulette` function which takes the arguments start, end and stake. A random number is rolled and if it is in range between start and end the player
wins. Apart from problem with probability there is also another problem which is much more critical.

## Problem #1

If we look at the probability part of the roulette, we can see that there are 15 numbers to roll, two ranges to bet on. Meaning if you bet on a range, you win in 7 instances, so 7/15 gives you
46% chance to win 3x bet. So if you bet 100 tokens, on average you will win (100 * 3 * 0,46) = 138 tokens. So eventually the casino will run out of tokens.

## Killer problem

We can play the roulette via a contract. Idk if devs were thinking about this, and it is possible they were. The game can be played with 
[this token](https://www.shibariumscan.io/token/0x255f07B5c7f62E2eAec552b1866D089023B05a46). This token can only be sent to whitelisted contracts. So theoretically, my contract should not be 
able to play the roulette since it cannot receive the token. Unfortunately, the token checks whether the receiver is contract by using `address.code > 0`, which is not true during the
construction of the contract, since it is not yet on the chain.

So in constructor of a contract I had to transfer the token to the contract, then play roulette, and then check if my contract had higher balance than in the beginning. And if not, I simply 
reverted the message and did it again. The only problem was that I had to approve the non-existing contract so it can use my tokens, but since we can predict the address of a deployed contract,
it was not a problem after all.

It took several failed constructions to 'win' 20 BONE (around 14 dollars).

[This](https://www.shibariumscan.io/tx/0x85b3609b3523b2c37a4af339ba1b7bb8f9d5b2c4f7123ae38fc3b67e3f4311af) was the first 'win' but then I realised I did not win everything so I had to change
14 to 13 in my contract and win the rest of the tokens with [this](https://www.shibariumscan.io/tx/0xf6f811434b14c51c3215fdb266367cba3c9b9393d1dc020d30e0f2441ce106b4) contract.
