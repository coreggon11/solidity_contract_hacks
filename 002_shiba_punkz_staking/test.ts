import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'

async function deploy() {
  await ethers.provider.send('evm_setAutomine', [true])
  const [deployer] = await ethers.getSigners()

  // deploy spooky punkz
  const { contract: spookyPunkz } = await deployContract('SpookyShibaPunkz')
  // deploy xmas
  const { contract: xmasPunkz } = await deployContract('SpookyShibaPunkz')
  // deploy staking
  const { contract: punkzStaking } = await deployContract(
    'SpookyXmasPunkzStaking',
    xmasPunkz.address,
    spookyPunkz.address
  )
  // deploy hack
  const { contract: stakingHack } = await deployContract(
    'XmasPunkzHack',
    spookyPunkz.address,
    xmasPunkz.address,
    punkzStaking.address,
    { value: '8070000000000000000' }
  )
  // transfer 2 to staking
  await xmasPunkz.transferFrom(deployer.address, punkzStaking.address, 0)
  await xmasPunkz.transferFrom(deployer.address, punkzStaking.address, 1)
  await spookyPunkz.transferFrom(deployer.address, stakingHack.address, 0)

  return { stakingHack, xmasPunkz, spookyPunkz, punkzStaking }
}

async function deployContract(factoryName: string, ...args: any) {
  const factory = await ethers.getContractFactory(factoryName)
  const contract = await factory.deploy(...args)
  await contract.deployed()

  console.log(`deployed ${factoryName}`)
  return { factory, contract }
}

describe.only('Stress test', function () {
  it.only('Can get more for staking hh', async function () {
    const { stakingHack, xmasPunkz, spookyPunkz, punkzStaking } =
      await loadFixture(deploy)

    // PART 0 - STAKE

    const balanceStakingXmas0 = await xmasPunkz.balanceOf(punkzStaking.address)
    const balanceStakingSpooky0 = await spookyPunkz.balanceOf(
      punkzStaking.address
    )
    const balanceHackXmas0 = await xmasPunkz.balanceOf(stakingHack.address)
    const balanceHackSpooky0 = await spookyPunkz.balanceOf(stakingHack.address)

    expect(balanceStakingXmas0).to.be.eq(2)
    expect(balanceStakingSpooky0).to.be.eq(0)
    expect(balanceHackXmas0).to.be.eq(0)
    expect(balanceHackSpooky0).to.be.eq(1)

    await stakingHack.stake()

    console.log('stake complete')

    // PART 1 - wait
    const balanceStakingXmas1 = await xmasPunkz.balanceOf(punkzStaking.address)
    const balanceStakingSpooky1 = await spookyPunkz.balanceOf(
      punkzStaking.address
    )
    const balanceHackXmas1 = await xmasPunkz.balanceOf(stakingHack.address)
    const balanceHackSpooky1 = await spookyPunkz.balanceOf(stakingHack.address)

    expect(balanceStakingXmas1).to.be.eq(2)
    expect(balanceStakingSpooky1).to.be.eq(1)
    expect(balanceHackXmas1).to.be.eq(0)
    expect(balanceHackSpooky1).to.be.eq(0)

    await ethers.provider.send('evm_increaseTime', [60 * 60 * 24 * 20 + 1])

    console.log('wait complete')

    // PART 2 - unstake

    await stakingHack.unstake()

    const balanceStakingXmas2 = await xmasPunkz.balanceOf(punkzStaking.address)
    const balanceStakingSpooky2 = await spookyPunkz.balanceOf(
      punkzStaking.address
    )
    const balanceHackXmas2 = await xmasPunkz.balanceOf(stakingHack.address)
    const balanceHackSpooky2 = await spookyPunkz.balanceOf(stakingHack.address)

    expect(balanceStakingXmas2).to.be.eq(0)
    expect(balanceStakingSpooky2).to.be.eq(0)
    expect(balanceHackXmas2).to.be.eq(2)
    expect(balanceHackSpooky2).to.be.eq(1)

    console.log('unstake complete')
  })
})
