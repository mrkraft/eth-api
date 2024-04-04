import { ethers } from 'ethers';
import config from 'config-dug';

import { Transaction } from '../entities/transaction';

class EthProvider {
  private readonly MAX_BLOCK_COUNT_TO_CHECK = config.MAX_BLOCK_COUNT_TO_CHECK as number;

  private rpcProvider;

  constructor() {
    this.rpcProvider = new ethers.JsonRpcProvider(config.NODE_RPC_URL as string);
  }

  public async getTransactionsForAddress(address: string, blockCountToCheck: number = 5): Promise<string> {
    const formattedAddress = address.toLowerCase();

    const blockCount = Math.min(blockCountToCheck, this.MAX_BLOCK_COUNT_TO_CHECK);

    const latestBlock = await this.rpcProvider.getBlockNumber();

    const transactionList: Transaction[] = [];

    for (let i = latestBlock; i > latestBlock - blockCount; i--) {

      const block = await this.rpcProvider.getBlock(i, true);

      if (block?.prefetchedTransactions && block.prefetchedTransactions.length > 0) {
        for (const txResponse of block.prefetchedTransactions) {

          if (txResponse.from.toLowerCase() === formattedAddress || txResponse.to?.toLowerCase() === formattedAddress) {
            transactionList.push({
              blockNumber: txResponse.blockNumber || 0,
              type: txResponse.type,
              from: txResponse.from,
              to: txResponse.to || '',
              value: txResponse.value.toString(),
            });
          }
        }
      }
    }

    return JSON.stringify(transactionList, null, 2);
  }
}

export { EthProvider };