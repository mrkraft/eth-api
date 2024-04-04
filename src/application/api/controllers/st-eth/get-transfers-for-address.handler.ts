import { FastifyRequest, FastifyReply } from 'fastify';
import { injectable } from 'tsyringe';

import { StEthProvider } from '../../../../domain/providers/st-eth.provider';

export type GetTransfersForAddressRequest = FastifyRequest<{
  Params: { address: string };
}>;

@injectable()
class TransfersForAddressHandler {
  constructor() {}

  public async handler(request: GetTransfersForAddressRequest, reply: FastifyReply): Promise<void> {
    const pr = new StEthProvider();
    const result = await pr.getTransfersForAddress(request.params.address);

    await reply.send(result);
  }
}

export { TransfersForAddressHandler };