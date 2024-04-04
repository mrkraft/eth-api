import { FastifyRequest, FastifyReply } from 'fastify';
import { injectable } from 'tsyringe';

import { StEthProvider } from '../../../../domain/providers/st-eth.provider';

@injectable()
class TotalSharesHandler {
  constructor() {}

  public async handler(_: FastifyRequest, reply: FastifyReply): Promise<void> {
    const pr = new StEthProvider();
    const result = await pr.getTotalShares();

    await reply.send(result);
  }
}

export { TotalSharesHandler };