// const authService = require("../services/authService");
// const { validationResult } = require('express-validator');
// const logger = require("../utils/logger");
//
// const authController = {
// // Authentication endpoint
//     login: async (req, res) => {
//         try {
//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 return res.status(400).json({
//                     success: false,
//                     error: 'Validation failed',
//                     details: errors.array()
//                 });
//             }
//             const {email, password} = req.body;
//
//             const result = await authService.login(email, password);
//             if (!result.success) {
//                 return res.status(401).json({
//                     success: false,
//                     error: result.message
//                 });
//             }
//             res.cookie('refreshToken', result.refreshToken, {
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
//                 maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
//             });
//             res.json({
//                 success: true,
//                 data: {
//                     user: result.user,
//                     accessToken: result.accessToken,
//                     expiresIn: result.expiresIn
//                 },
//                 message: 'Login successful'
//             });
//         } catch (error) {
//             logger.error('Error during login:', error);
//             res.status(500).json({
//                 success: false,
//                 error: 'Server error during login. Please try again later.'
//             });
//         }
//     },
//     // Registration for Admin only
//     register: async (req, res) => {
//         try {
//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 return res.status(400).json({
//                     success: false,
//                     error: 'Validation failed',
//                     details: errors.array()
//                 });
//             }
//             const {email, password, name} = req.body;
//
//             const result = await authService.register(email, password, name);
//             if (!result.success) {
//                 return res.status(400).json({
//                     success: false,
//                     error: result.message
//                 });
//             }
//             res.json({
//                 success: true,
//                 data: result.user,
//                 message: 'Registration successful'
//             });
//         } catch (error) {
//             logger.error('Error during registration:', error);
//             res.status(500).json({
//                 success: false,
//                 error: 'Server error during registration. Please try again later.'
//             });
//         }
//     },
//     refreshToken: async (req, res) => {
//         try {
//             const {refreshToken} = req.cookies;
//             if (!refreshToken) {
//                 return res.status(401).json({
//                     success: false,
//                     error: 'Unauthorized',
//                     message: 'Refresh token is required'
//                 });
//             }
//
//             const result = await tokenService.refreshAccessToken(refreshToken);
//             if (!result.success) {
//                 return res.status(401).json({
//                     success: false,
//                     error: result.message
//                 });
//             }
//
//             res.json({
//                 success: true,
//                 data: {
//                     accessToken: result.accessToken,
//                     expiresIn: result.expiresIn
//                 },
//                 message: 'Token refreshed successfully'
//             });
//         } catch (error) {
//             logger.error('Error during token refresh:', error);
//             res.status(500).json({
//                 success: false,
//                 error: 'Server error during token refresh. Please try again later.'
//             });
//         }
//     },
//
//     // TODO: Implement the following methods as needed
//     /**
//      *   // Logout
//      *   async logout(req, res) {
//      *     try {
//      *       const { refreshToken } = req.cookies;
//      *
//      *       if (refreshToken) {
//      *         await tokenService.revokeRefreshToken(refreshToken);
//      *       }
//      *
//      *       res.clearCookie('refreshToken');
//      *
//      *       res.json({
//      *         success: true,
//      *         message: 'Logged out successfully'
//      *       });
//      *
//      *     } catch (error) {
//      *       console.error('Logout error:', error);
//      *       res.status(500).json({
//      *         success: false,
//      *         error: 'Internal server error'
//      *       });
//      *     }
//      *   }
//      *
//      *   // Forgot password
//      *   async forgotPassword(req, res) {
//      *     try {
//      *       const { email } = req.body;
//      *
//      *       const result = await authService.forgotPassword(email);
//      *
//      *       // Always return success for security (don't reveal if email exists)
//      *       res.json({
//      *         success: true,
//      *         message: 'If the email exists, a reset link has been sent'
//      *       });
//      *
//      *     } catch (error) {
//      *       console.error('Forgot password error:', error);
//      *       res.status(500).json({
//      *         success: false,
//      *         error: 'Internal server error'
//      *       });
//      *     }
//      *   }
//      *
//      *   // Reset password
//      *   async resetPassword(req, res) {
//      *     try {
//      *       const { token, newPassword } = req.body;
//      *
//      *       const result = await authService.resetPassword(token, newPassword);
//      *
//      *       if (!result.success) {
//      *         return res.status(400).json(result);
//      *       }
//      *
//      *       res.json({
//      *         success: true,
//      *         message: 'Password reset successfully'
//      *       });
//      *
//      *     } catch (error) {
//      *       console.error('Reset password error:', error);
//      *       res.status(500).json({
//      *         success: false,
//      *         error: 'Internal server error'
//      *       });
//      *     }
//      *   }
//      *
//      *   // Change password (authenticated users)
//      *   async changePassword(req, res) {
//      *     try {
//      *       const { currentPassword, newPassword } = req.body;
//      *       const userId = req.user.userId;
//      *
//      *       const result = await authService.changePassword(userId, currentPassword, newPassword);
//      *
//      *       if (!result.success) {
//      *         return res.status(400).json(result);
//      *       }
//      *
//      *       res.json({
//      *         success: true,
//      *         message: 'Password changed successfully'
//      *       });
//      *
//      *     } catch (error) {
//      *       console.error('Change password error:', error);
//      *       res.status(500).json({
//      *         success: false,
//      *         error: 'Internal server error'
//      *       });
//      *     }
//      *   }
//      *   */
// };
// module.exports = authController;
