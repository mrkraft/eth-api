import { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';

import { TotalPooledEtherHandler } from './controllers/st-eth/get-total-pooled-ether.handler';
import { TotalSharesHandler } from './controllers/st-eth/get-total-shares.handler';
import {
  LastDepositSenderAddressHandler
} from './controllers/st-eth/get-last-deposit-sender-address.handler';
import { TransfersForAddressHandler } from './controllers/st-eth/get-transfers-for-address.handler';
import { TransactionsForAddressHandler } from './controllers/eth/get-transactions-for-address.handler';

async function router(app: FastifyInstance) {

  const totalPooledEtherHandler = container.resolve(TotalPooledEtherHandler);
  app.get('/v1/eth/stEth/totalPooledEther', {
    handler: totalPooledEtherHandler.handler,
  });

  const totalSharesHandler = container.resolve(TotalSharesHandler);
  app.get('/v1/eth/stEth/totalShares', {
    handler: totalSharesHandler.handler,
  });

  const lastDepositSenderAddressHandler = container.resolve(LastDepositSenderAddressHandler);
  app.get('/v1/eth/stEth/lastDepositSenderAddress', {
    handler: lastDepositSenderAddressHandler.handler,
  });

  const transfersForAddressHandler = container.resolve(TransfersForAddressHandler);
  app.get('/v1/eth/stEth/transfersForAddress/:address', {
    handler: transfersForAddressHandler.handler,
  });

  const transactionsForAddressHandler = container.resolve(TransactionsForAddressHandler);
  app.get('/v1/eth/transactionsForAddress/:address', {
    handler: transactionsForAddressHandler.handler,
  });
}

export { router };
