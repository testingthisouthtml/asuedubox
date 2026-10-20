import { addDoc, collection, db, isFirebaseConfigured, serverTimestamp } from './firebase.js';

window.eduBoxFirebase = {
  ready: isFirebaseConfigured,
  async saveBooking(booking) {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase is not configured yet. Follow the setup steps in README.md.');
    }
    const { date, time, device, name, phone, faculty, reason } = booking;
    await addDoc(collection(db, 'bookings'), {
      date, time, device, name, phone, faculty, reason,
      createdAt: serverTimestamp()
    });
  }
};
