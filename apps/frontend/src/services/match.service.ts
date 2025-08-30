import api from '@/lib/api';
import { handleApi } from '@/utils/apiHandler';

class MatchService {
  getPotentialMatches = () => handleApi(() =>
    api
      .get('/match/potential-matches')
      .then(res => res.data),
  );

  getMatches = () => handleApi(() =>
    api
      .get('/match')
      .then(res => res.data),
  );

  blockMatch = (matchId: string) => handleApi(() =>
    api
      .delete(`/match/${matchId}`)
      .then(res => res.data),
  );

  getBlockedMatches = () => handleApi(() =>
    api
      .get('/match/blocked')
      .then(res => res.data),
  );

  unblockMatch = (matchId: string) => handleApi(() =>
    api
      .patch(`/match/${matchId}/unblock`)
      .then(res => res.data),
  );
}

export default new MatchService();
