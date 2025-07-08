import { inject, injectable } from 'inversify';

import { TYPES } from '@/types';
import { MatchService } from '@/services/match.service';
import { handleAsync } from '@/utils/handle-async';
import { createError } from '@i4you/http-errors';

@injectable()
export class MatchController {
  constructor(@inject(TYPES.MatchService) private matchService: MatchService) {}

  getMatches = handleAsync(async (req, res) => {
    const { id: userId } = req.user;

    if (!userId) {
      throw createError.Unauthorized('User ID is required');
    }

    const matches = await this.matchService.handleLike('s', 's');
    res.status(200).json(matches);
  });
}
