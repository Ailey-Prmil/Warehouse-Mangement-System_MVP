// src/api/token-routes.ts
import express from 'express';
import { verifyRefreshToken, generateAccessToken, invalidateRefreshToken } from '../utils/auth-utils';

const router = express.Router();

/**
 * @route POST /api/token/refresh
 * @desc Refresh access token using a valid refresh token
 * @access Public
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify the refresh token
    const username = await verifyRefreshToken(refreshToken);

    if (!username) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    // Generate a new access token
    const accessToken = generateAccessToken(username);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      accessToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during token refresh'
    });
  }
});

/**
 * @route POST /api/token/logout
 * @desc Invalidate a refresh token (logout)
 * @access Public
 */
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Invalidate the refresh token
    const result = await invalidateRefreshToken(refreshToken);

    if (!result) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token or token already invalidated'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});

export default router;