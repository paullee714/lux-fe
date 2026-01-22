/**
 * API module exports
 */

// Client
export { apiClient, ApiClient, ApiClientError, tokenManager } from "./client";

// Auth API
export {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  updateProfile,
  refreshTokens,
  verifyEmail,
  resendVerificationEmail,
  changePassword,
} from "./auth";

// Events API
export {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getAttendingEvents,
  publishEvent,
  cancelEvent,
  getEventAttendees,
  registerForEvent,
  unregisterFromEvent,
  checkInAttendee,
  getUpcomingEvents,
  searchEvents,
} from "./events";

// Invitations API
export {
  getInvitations,
  getReceivedInvitations,
  getSentInvitations,
  getInvitation,
  createInvitation,
  sendInvitations,
  respondToInvitation,
  cancelInvitation,
  resendInvitation,
  getInvitationByToken,
  respondToInvitationByToken,
  getPendingInvitationCount,
} from "./invitations";

// Posts API
export {
  getEventPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  pinPost,
  unpinPost,
} from "./posts";
