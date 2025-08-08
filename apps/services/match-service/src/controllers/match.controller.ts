import { inject, injectable } from 'inversify';

import { TYPES } from '@/types';
import { MatchService } from '@/services/match.service';
import { handleAsync } from '@/utils/handle-async';
import { createError } from '@i4you/http-errors';
import MatchesResponseDTO from '@/dtos/matches.response.dtos';

@injectable()
export class MatchController {
  constructor(@inject(TYPES.MatchService) private matchService: MatchService) {}

  getMatches = handleAsync(async (req, res) => {
    const matches = await this.matchService.getMatches(req.user.id);
    res.status(200).json(matches);
  });

  getPotentialMatches = handleAsync(async (req, res) => {
    const matches = await this.matchService.getPotentialMatches(req.user.id);
    res.status(200).json(matches.map((m) => new MatchesResponseDTO(m)));
  });
}
