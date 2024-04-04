import { container } from 'tsyringe';

import { StEthProvider } from '../domain/providers/st-eth.provider';

function registerDependencies() {
  container.register('StEthProvider', { useClass: StEthProvider });
}

export { registerDependencies };