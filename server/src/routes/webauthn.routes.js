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
    console.log('=== REGISTER VERIFY START ===');
    console.log('Request body:', req.body);
    console.log('Request body type:', typeof req.body);
    console.log('Request body keys:', req.body ? Object.keys(req.body) : 'NO BODY');
    console.log('UserId:', req.body?.userId);
    console.log('Has attestationResponse:', !!req.body?.attestationResponse);
    
    const { userId, attestationResponse } = req.body || {};
    
    if (!userId) {
      console.log('❌ UserId is missing or undefined');
      return res.status(400).json({ message: 'userId is required' });
    }
    
    if (!attestationResponse) {
      console.log('❌ attestationResponse is missing');
      return res.status(400).json({ message: 'attestationResponse is required' });
    }
    
    const userIdString = userId.toString();
    console.log('Looking for challenge with key:', userIdString);
    const expectedChallenge = challenges.get(userIdString);
    
    if (!expectedChallenge) {
      console.log('❌ No challenge found for userId:', userIdString);
      console.log('Available challenges:', Array.from(challenges.keys()));
      return res.status(400).json({ message: 'No challenge found. Please try again from the beginning.' });
    }

    console.log('✓ Challenge found');
    console.log('Origin (env):', process.env.ORIGIN);
    console.log('Origin (config):', origin);
    console.log('RP_ID (env):', process.env.RP_ID);
    console.log('RP_ID (config):', rpID);
    console.log('Expected Origin Array:', [origin]);
    
    const verification = await verifyRegistrationResponse({
      response: attestationResponse,
      expectedChallenge,
      expectedOrigin: [origin], // Must be array
      expectedRPID: rpID,
    });
    
    console.log('✓ Verification result:', verification.verified);
    
    if (!verification.verified) {
      console.log('❌ Verification returned false');
      return res.status(400).json({ message: 'Verification failed' });
    }

    const { credentialID, credentialPublicKey } = verification.registrationInfo;
    
    await User.findByIdAndUpdate(userId, {
      credentialId: Buffer.from(credentialID).toString('base64url'),
      publicKey: Buffer.from(credentialPublicKey).toString('base64url'),
    });
    
    challenges.delete(userIdString);
    console.log('✅ Biometric registered successfully for user:', userId);
    return res.json({ message: 'Biometric registered successfully' });
  } catch (error) {
    console.error('❌ Register verify error:', error.message);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ message: 'Verification failed', error: error.message, stack: error.stack });
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
      expectedOrigin: [origin], // Must be array
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
