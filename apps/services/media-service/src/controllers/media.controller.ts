import { injectable } from 'inversify';
import { handleAsync } from '@/utils/handle-async';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { env } from '@/config';

@injectable()
export class MediaController {
  constructor() {}

  getUploadUrl = handleAsync(async (req, res) => {
    console.log('Getting upload URL');
    const fileType = req.query.fileType as string;
    if (!fileType) {
      res.status(400).json({ message: 'Missing fileType in query' });
      return;
    }

    const fileExtension = fileType.split('/')[1];
    const key = `uploads/${uuidv4()}.${fileExtension}`;

    const s3Client = new S3Client({
      region: 'ap-south-1',
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const command = new PutObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    res.status(200).json({
      url: signedUrl,
      key,
    });
  });
}
