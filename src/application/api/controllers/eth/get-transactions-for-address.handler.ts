import { FastifyRequest, FastifyReply } from 'fastify';
import { injectable } from 'tsyringe';

import { EthProvider } from '../../../../domain/providers/eth.provider';

export type GetTransactionsForAddressRequest = FastifyRequest<{
  Params: { address: string };
}>;

@injectable()
class TransactionsForAddressHandler {
  constructor() {}

  public async handler(request: GetTransactionsForAddressRequest, reply: FastifyReply): Promise<void> {
    const pr = new EthProvider();
    const result = await pr.getTransactionsForAddress(request.params.address);

    await reply.send(result);
  }
}

export { TransactionsForAddressHandler };