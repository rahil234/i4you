import api from '@/lib/api';
import { handleApi } from '@/utils/apiHandler';

class MatchService {
  getMatches = () => handleApi(() =>
    api
      .get('/match')
      .then(res => res.data),
  );
}

export default new MatchService();
