import api from '@/lib/api';
import { handleApi } from '@/utils/apiHandler';
import axios from 'axios';

class MediaService {
  getUploadUrl = (file: File) =>
    handleApi(() =>
      api
        .get(`/media/upload-url?fileType=${encodeURIComponent(file.type)}`)
        .then(res => res.data),
    );

  uploadImage = (file: File, url: string) =>
    handleApi(() =>
      axios
        .put(url, file)
        .then(res => res.data),
    );
}

export default new MediaService();
