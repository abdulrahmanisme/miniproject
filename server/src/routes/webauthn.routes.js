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

router.post('/register-challenge', async (req, res) => {
  const userId = req.user?.id || req.body.userId;
  const user = await User.findById(userId);
  if (!user) return res.status(400).json({ message: 'User not found' });

  const options = generateRegistrationOptions({
    rpName,
    rpID,
    userID: user._id.toString(),
    userName: user.email,
    attestationType: 'none',
  });
  challenges.set(userId, options.challenge);
  return res.json(options);
});

router.post('/register-verify', async (req, res) => {
  const { userId, attestationResponse } = req.body;
  const expectedChallenge = challenges.get(userId);
  if (!expectedChallenge) return res.status(400).json({ message: 'No challenge' });

  const verification = await verifyRegistrationResponse({
    response: attestationResponse,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });
  if (!verification.verified) return res.status(400).json({ message: 'Verification failed' });

  const { credentialID, credentialPublicKey } = verification.registrationInfo;
  await User.findByIdAndUpdate(userId, {
    credentialId: credentialID.toString('base64url'),
    publicKey: credentialPublicKey.toString('base64url'),
  });
  challenges.delete(userId);
  return res.json({ message: 'Biometric registered' });
});

router.post('/auth-challenge', async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user || !user.credentialId) return res.status(400).json({ message: 'No credential' });

  const options = generateAuthenticationOptions({
    rpID,
    allowCredentials: [
      {
        id: Buffer.from(user.credentialId, 'base64url'),
        type: 'public-key',
      },
    ],
  });
  challenges.set(userId, options.challenge);
  return res.json(options);
});

router.post('/auth-verify', async (req, res) => {
  const { userId, assertionResponse } = req.body;
  const expectedChallenge = challenges.get(userId);
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
  challenges.delete(userId);
  if (!verification.verified) return res.status(400).json({ message: 'Auth failed' });
  return res.json({ message: 'Biometric ok' });
});

export default router;
