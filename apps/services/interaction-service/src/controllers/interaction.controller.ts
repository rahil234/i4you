import { inject, injectable } from 'inversify';

import { handleAsync } from '@/utils/handle-async';
import { IInteractionService } from '@/services/interfaces/IInteractionService';
import { TYPES } from '@/types';
import { CreateInteractionDTO } from '@/dtos/interaction.dto';
import { INTERACTION } from '@/constants/interactions.constant';

@injectable()
export class InteractionController {
  constructor(
    @inject(TYPES.InteractionService)
    private _interactionService: IInteractionService
  ) {}

  likeUser = handleAsync(async (req, res) => {
    const data: CreateInteractionDTO = {
      fromUserId: req.user.id,
      toUserId: req.params.userId,
      type: INTERACTION.LIKE,
    };
    const interaction = await this._interactionService.createInteraction(data);
    res.status(201).json(interaction);
  });

  superLikeUser = handleAsync(async (req, res) => {
    const data: CreateInteractionDTO = {
      fromUserId: req.user.id,
      toUserId: req.params.userId,
      type: INTERACTION.SUPERLIKE,
    };
    const interaction = await this._interactionService.createInteraction(data);
    res.status(201).json(interaction);
  });

  dislikeUser = handleAsync(async (req, res) => {
    const data: CreateInteractionDTO = {
      fromUserId: req.user.id,
      toUserId: req.params.userId,
      type: INTERACTION.DISLIKE,
    };
    const interaction = await this._interactionService.createInteraction(data);
    res.status(201).json(interaction);
  });

  getInteractionBalances = handleAsync(async (req, res) => {
    const userId = req.user.id;
    const balances =
      await this._interactionService.getInteractionBalances(userId);
    res.status(200).json(balances);
  });
}
