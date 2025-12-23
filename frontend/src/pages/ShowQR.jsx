import { useLocation, useParams } from 'react-router-dom';

export default function ShowQR() {
  const { state } = useLocation();
  const { token } = useParams();
  const qrDataUrl = state?.qrDataUrl;

  return (
    <div className="text-center space-y-3">
      <h1 className="text-xl font-semibold">Lecture QR</h1>
      {qrDataUrl ? (
        <img src={qrDataUrl} alt="QR" className="mx-auto w-60" />
      ) : (
        <p>Token: {decodeURIComponent(token)}</p>
      )}
      <p className="text-sm text-gray-600">Expires: {state?.expiresAt && new Date(state.expiresAt).toLocaleTimeString()}</p>
    </div>
  );
}
