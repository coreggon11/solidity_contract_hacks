import { getContractAddress } from 'ethers/lib/utils'
import { ethers } from 'hardhat'

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log(deployer.address)

  const tokenFactory = await ethers.getContractFactory('ERC20')
  const token = tokenFactory.attach(
    '0x255f07B5c7f62E2eAec552b1866D089023B05a46'
  )

  let nonce = 1002
  let running = true
  while (running) {
    try {
      const account = getContractAddress({
        from: deployer.address,
        nonce: nonce
      })

      console.log(`Predicted ${account}`)

      const tx = await token.approve(account, token.balanceOf(deployer.address))
      await tx.wait()

      await deployContract('RouletteWinner', {
        gasLimit: '1000000'
      })

      running = false
      console.log('win')
    } catch (e) {
      console.log('unsucsessful')
    } finally {
      nonce += 2
    }
  }
}

async function deployContract(factoryName: string, ...args: any) {
  const factory = await ethers.getContractFactory(factoryName)
  const contract = await factory.deploy(...args)
  await contract.deployed()

  console.log(`deployed ${factoryName}`)
  return { factory, contract }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
