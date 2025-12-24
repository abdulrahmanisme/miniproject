import api from './auth';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

// WebAuthn API

/**
 * Register biometric for a user (one-time setup)
 */
export const registerBiometric = async (userId) => {
  try {
    // Step 1: Get registration options from server
    const challengeResponse = await api.post('/webauthn/register-challenge', { userId });
    const options = challengeResponse.data;

    // Step 2: Start browser registration (triggers biometric prompt)
    const attestationResponse = await startRegistration(options);

    // Step 3: Send attestation to server for verification
    const verifyResponse = await api.post('/webauthn/register-verify', {
      userId,
      attestationResponse,
    });

    return verifyResponse.data;
  } catch (error) {
    console.error('Biometric registration error:', error);
    throw new Error(error.response?.data?.message || 'Biometric registration failed');
  }
};

/**
 * Authenticate user with biometric (for attendance confirmation)
 */
export const authenticateBiometric = async (userId) => {
  try {
    // Step 1: Get authentication challenge from server
    const challengeResponse = await api.post('/webauthn/auth-challenge', { userId });
    const options = challengeResponse.data;

    // Step 2: Start browser authentication (triggers biometric prompt)
    const assertionResponse = await startAuthentication(options);

    // Step 3: Send assertion to server for verification
    const verifyResponse = await api.post('/webauthn/auth-verify', {
      userId,
      assertionResponse,
    });

    return verifyResponse.data;
  } catch (error) {
    console.error('Biometric authentication error:', error);
    throw new Error(error.response?.data?.message || 'Biometric authentication failed');
  }
};

/**
 * Check if browser supports WebAuthn
 */
export const isWebAuthnSupported = () => {
  return window?.PublicKeyCredential !== undefined &&
         typeof window.PublicKeyCredential === 'function';
};

export default {
  registerBiometric,
  authenticateBiometric,
  isWebAuthnSupported,
};
