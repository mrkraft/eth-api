import { ethers } from 'ethers';
import config from 'config-dug';

import { Transfer } from '../entities/transfer';

class StEthProvider {
  private readonly ST_ETH_ABI = [
    'function getTotalPooledEther() view returns (uint256)',
    'function getTotalShares() view returns (uint256)',
    'event Transfer(address indexed from, address indexed to, uint256 value)',
    'event Submitted(address indexed sender, uint256 amount, address referral)'
  ];

  private readonly MAX_BLOCK_COUNT_TO_CHECK = config.MAX_BLOCK_COUNT_TO_CHECK as number;

  private rpcProvider;
  private stETHContract;

  constructor() {
    this.rpcProvider = new ethers.JsonRpcProvider(config.NODE_RPC_URL as string);
    this.stETHContract = new ethers.Contract(config.ST_ETH_ADDRESS as string, this.ST_ETH_ABI, this.rpcProvider);
  }

  public async getTotalPooledEther(): Promise<string> {
    const result: ethers.BigNumberish = await this.stETHContract.getTotalPooledEther();

    const formattedResult: string = ethers.formatEther(result);

    return formattedResult;
  }

  public async getTotalShares(): Promise<string> {
    const result: ethers.BigNumberish = await this.stETHContract.getTotalShares();

    const formattedResult = result.toString();

    return formattedResult;
  }

  public async getLastDepositSenderAddress(): Promise<string> {
    const latestBlock = await this.rpcProvider.getBlockNumber();

    const submittedEventAll = await this.stETHContract.queryFilter('Submitted', latestBlock - this.MAX_BLOCK_COUNT_TO_CHECK, latestBlock);
    const latestSubmitEventParsed = this.stETHContract.interface.parseLog(submittedEventAll[submittedEventAll.length - 1]);

    const sender = latestSubmitEventParsed?.args[0];

    return sender;
  }

  public async getTransfersForAddress(address: string, blockCountToCheck: number = 100): Promise<string> {
    const formattedAddress = address.toLowerCase();

    const blockCount = Math.min(blockCountToCheck, this.MAX_BLOCK_COUNT_TO_CHECK);

    const latestBlock = await this.rpcProvider.getBlockNumber();

    const transferList: Transfer[] = [];

    const transferEvents = await this.stETHContract.queryFilter('Transfer', latestBlock - blockCount, latestBlock);
    for (const transferEvent of transferEvents) {
      const transferParsed = this.stETHContract.interface.parseLog(transferEvent);
      if (!transferParsed?.args) {
        continue;
      }

      if (transferParsed.args[0].toLowerCase() === formattedAddress || transferParsed.args[1].toLowerCase() === formattedAddress) {
        transferList.push({
          from: transferParsed.args[0],
          to: transferParsed.args[1],
          value: transferParsed.args[2].toString()
        });
      }
    }

    return JSON.stringify(transferList, null, 2);
  }
}

export { StEthProvider };