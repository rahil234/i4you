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

  uploadImage = (file: File, url: string, fields: any) =>
    handleApi(async () => {
      const formData = new FormData();
      formData.append('file', file);
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      const res = await axios
        .post(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      return res.data;
    });
}

export default new MediaService();
