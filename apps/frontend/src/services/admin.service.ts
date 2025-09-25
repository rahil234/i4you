import api from '@/lib/api';
import {handleApi} from '@/utils/apiHandler';

export interface Params {
    status: 'approved' | 'rejected' | 'pending';
    sortBy?: 'createdAt' | 'updatedAt';
}

export class AdminService {
    getModerationImages = ({status}: Params) => {
        console.log(`Fetching moderation images with status: ${status}}`);
        return handleApi(() =>
            api
                .get('/moderation/pending/images', {
                    params: {
                        status,
                    },
                })
                .then(res => res.data.data)
        );
    }

    updateModerationStatus = (publicId: string, status: 'approved' | 'rejected') =>
        handleApi(() =>
            api
                .patch('/moderation', {status, publicId})
                .then(res => res.data),
        );
}

export default new AdminService();
