import OneSignal from 'react-onesignal';

export async function initOneSignal() {
  await OneSignal.init({
    appId: '4dab244c-6ec4-4beb-af50-023653df8132',
    notifyButton: {
      enable: true,
    },
  });
}
