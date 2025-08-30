import { inject, injectable } from 'inversify';

import { handleAsync } from '@/utils/handle-async';
import { IInteractionService } from '@/services/interfaces/IInteractionService';
import { TYPES } from '@/types';

@injectable()
export class InteractionController {
  constructor(
    @inject(TYPES.InteractionService)
    private _interactionService: IInteractionService
  ) {}

  create = handleAsync(async (req, res) => {
    const interaction = await this._interactionService.createInteraction(
      req.body
    );
    res.status(201).json(interaction);
  });
}
