import authService from './authService';
import bookingService from './bookingService';
import matchService from './matchService';
import messageService from './messageService';
import notificationService from './notificationService';
import reviewService from './reviewService';
import locationService from './locationService';
import certificationService from './certificationService';
import tutorService from './tutorService';
import subjectService from './subjectService';
import api from './api';

export {
  authService,
  bookingService,
  matchService,
  messageService,
  notificationService,
  reviewService,
  locationService,
  certificationService,
  tutorService,
  subjectService,
  api,
};

export default {
  auth: authService,
  booking: bookingService,
  match: matchService,
  message: messageService,
  notification: notificationService,
  review: reviewService,
  location: locationService,
  certification: certificationService,
  tutor: tutorService,
  subject: subjectService,
  api,
};