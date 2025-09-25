import { inject, injectable } from 'inversify';

import { TYPES } from '@/types';
import { handleAsync } from '@/utils/handle-async';
import { createError } from '@i4you/http-errors';
import MatchesResponseDTO from '@/dtos/matches.response.dtos';
import { IMatchService } from '@/services/interfaces/IMatchService';
import { IMediaService } from '@/services/interfaces/IMediaService';
import { HTTP_STATUS } from '@/constants/http-status.constant';
import { MATCH_RESPONSE_MESSAGES } from '@/constants/response-messages.constant';

@injectable()
export class MatchController {
  constructor(
    @inject(TYPES.MatchService) private matchService: IMatchService,
    @inject(TYPES.MediaService) private mediaService: IMediaService
  ) {}

  getMatches = handleAsync(async (req, res) => {
    const matches = await this.matchService.getMatches(req.user.id);
    res.status(HTTP_STATUS.OK).json(matches);
  });

  getPotentialMatches = handleAsync(async (req, res) => {
    const matches = await this.matchService.getPotentialMatches(req.user.id);

    const matchesWithPhotos = await Promise.all(
      matches.map(
        async (match) =>
          new MatchesResponseDTO(
            match,
            await this.mediaService.getUserImages(match.id)
          )
      )
    );

    res.status(HTTP_STATUS.OK).json(matchesWithPhotos);
  });

  getBlockedMatches = handleAsync(async (req, res) => {
    const blockedMatches = await this.matchService.getBlockedMatches(
      req.user.id
    );
    res.status(HTTP_STATUS.OK).json(blockedMatches);
  });

  blockMatch = handleAsync(async (req, res) => {
    const matchId = req.params.matchId;
    if (!matchId) {
      createError.BadRequest(MATCH_RESPONSE_MESSAGES.MATCH_ID_REQUIRED);
    }
    await this.matchService.blockMatch(req.user.id, matchId);
    res
      .status(HTTP_STATUS.OK)
      .json({ message: MATCH_RESPONSE_MESSAGES.BLOCK_SUCCESS });
  });

  unblockMatch = handleAsync(async (req, res) => {
    const matchId = req.params.matchId;
    if (!matchId) {
      createError.BadRequest(MATCH_RESPONSE_MESSAGES.MATCH_ID_REQUIRED);
    }
    await this.matchService.unblockMatch(req.user.id, matchId);
    res
      .status(HTTP_STATUS.OK)
      .json({ message: MATCH_RESPONSE_MESSAGES.UNBLOCK_SUCCESS });
  });
}
