import express from 'express';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import User from '../models/User.js';
import { rpID, rpName, origin } from '../config/webauthn.js';

const router = express.Router();
const challenges = new Map();

// Helper function to convert string to Uint8Array
function stringToUint8Array(str) {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

router.post('/register-challenge', async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    console.log('Register challenge - Received userId:', userId);
    console.log('Request body:', req.body);
    console.log('Request user:', req.user);
    
    if (!userId) return res.status(400).json({ message: 'User ID required' });
    
    const user = await User.findById(userId);
    console.log('Found user:', user ? user.email : 'NOT FOUND');
    
    if (!user) return res.status(400).json({ message: 'User not found' });

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: stringToUint8Array(user._id.toString()),
      userName: user.email,
      userDisplayName: user.name,
      attestationType: 'none',
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
    });
    
    // Store challenge with string key
    challenges.set(userId.toString(), options.challenge);
    return res.json(options);
  } catch (error) {
    console.error('Register challenge error:', error);
    return res.status(500).json({ message: 'Failed to generate registration options', error: error.message });
  }
});

router.post('/register-verify', async (req, res) => {
  try {
    const { userId, attestationResponse } = req.body;
    const expectedChallenge = challenges.get(userId.toString());
    if (!expectedChallenge) return res.status(400).json({ message: 'No challenge found' });

    const verification = await verifyRegistrationResponse({
      response: attestationResponse,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });
    
    if (!verification.verified) {
      return res.status(400).json({ message: 'Verification failed' });
    }

    const { credentialID, credentialPublicKey } = verification.registrationInfo;
    
    await User.findByIdAndUpdate(userId, {
      credentialId: Buffer.from(credentialID).toString('base64url'),
      publicKey: Buffer.from(credentialPublicKey).toString('base64url'),
    });
    
    challenges.delete(userId.toString());
    return res.json({ message: 'Biometric registered successfully' });
  } catch (error) {
    console.error('Register verify error:', error);
    return res.status(500).json({ message: 'Verification failed', error: error.message });
  }
});

router.post('/auth-challenge', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user || !user.credentialId) return res.status(400).json({ message: 'No credential' });

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: [
        {
          id: user.credentialId, // Already a base64url string in DB
          type: 'public-key',
        },
      ],
    });
    challenges.set(userId.toString(), options.challenge);
    return res.json(options);
  } catch (error) {
    console.error('Auth challenge error:', error);
    return res.status(500).json({ message: 'Failed to generate auth options', error: error.message });
  }
});

router.post('/auth-verify', async (req, res) => {
  try {
    const { userId, assertionResponse } = req.body;
    const expectedChallenge = challenges.get(userId.toString());
    const user = await User.findById(userId);
    if (!expectedChallenge || !user) return res.status(400).json({ message: 'No challenge or user' });

    const verification = await verifyAuthenticationResponse({
      response: assertionResponse,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: Buffer.from(user.credentialId, 'base64url'),
        credentialPublicKey: Buffer.from(user.publicKey, 'base64url'),
        counter: 0,
      },
    });
    challenges.delete(userId.toString());
    
    if (!verification.verified) return res.status(400).json({ message: 'Auth failed' });
    return res.json({ message: 'Biometric ok' });
  } catch (error) {
    console.error('Auth verify error:', error);
    return res.status(500).json({ message: 'Authentication failed', error: error.message });
  }
});

export default router;
