import { auth, db, deleteDoc, doc, getDocs, isFirebaseConfigured, onAuthStateChanged, orderBy, query, signInWithEmailAndPassword, signOut, collection } from '../firebase-admin.js';

const setupMessage = document.getElementById('setup-message');
const loginPanel = document.getElementById('login-panel');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const bookingsBody = document.getElementById('bookings-body');
const dashboardStatus = document.getElementById('dashboard-status');
const searchInput = document.getElementById('search');
const emptyState = document.getElementById('empty-state');
let bookings = [];

function show(element, visible) {
  element.classList.toggle('hidden', !visible);
}

function errorMessage(error) {
  if (error.code === 'permission-denied' || error.code === 'firestore/permission-denied') {
    return 'Access denied. Check that this account email matches the admin email in firestore.rules, then publish the rules.';
  }
  if (error.code === 'auth/invalid-credential') return 'Email or password is incorrect.';
  return error.message || 'Something went wrong. Please try again.';
}

function renderBookings() {
  const term = searchInput.value.trim().toLowerCase();
  const visibleBookings = bookings.filter(({ data }) =>
    [data.name, data.phone, data.faculty, data.device, data.reason, data.date, data.time]
      .some((value) => String(value || '').toLowerCase().includes(term))
  );
  bookingsBody.replaceChildren();
  document.getElementById('booking-count').textContent = `${visibleBookings.length} ${visibleBookings.length === 1 ? 'booking' : 'bookings'}`;
  show(emptyState, visibleBookings.length === 0);

  visibleBookings.forEach(({ id, data }) => {
    const row = document.createElement('tr');
    const values = [
      `${data.date || '—'} ${data.time || ''}`,
      `${data.name || '—'}\n${data.phone || ''}`,
      data.device || '—',
      data.faculty || '—',
      data.reason || '—'
    ];
    values.forEach((value, index) => {
      const cell = document.createElement('td');
      if (index === 1) {
        const strong = document.createElement('strong');
        strong.textContent = data.name || '—';
        const contact = document.createElement('div');
        contact.textContent = data.phone || '';
        cell.append(strong, contact);
      } else {
        cell.textContent = value;
      }
      row.appendChild(cell);
    });
    const actionCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => removeBooking(id));
    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);
    bookingsBody.appendChild(row);
  });
}

async function loadBookings() {
  dashboardStatus.classList.remove('error');
  dashboardStatus.textContent = 'Loading bookings…';
  try {
    const result = await getDocs(query(collection(db, 'bookings'), orderBy('createdAt', 'desc')));
    bookings = result.docs.map((snapshot) => ({ id: snapshot.id, data: snapshot.data() }));
    dashboardStatus.textContent = '';
    renderBookings();
  } catch (error) {
    dashboardStatus.textContent = errorMessage(error);
    dashboardStatus.classList.add('error');
  }
}

async function removeBooking(id) {
  if (!window.confirm('Delete this booking? This cannot be undone.')) return;
  try {
    await deleteDoc(doc(db, 'bookings', id));
    await loadBookings();
  } catch (error) {
    dashboardStatus.textContent = errorMessage(error);
    dashboardStatus.classList.add('error');
  }
}

if (!isFirebaseConfigured) {
  show(setupMessage, true);
} else {
  onAuthStateChanged(auth, (user) => {
    show(loginPanel, !user);
    show(dashboard, Boolean(user));
    if (user) {
      document.getElementById('signed-in-as').textContent = `Signed in as ${user.email}`;
      loadBookings();
    }
  });
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginError.textContent = '';
  const button = loginForm.querySelector('button');
  button.disabled = true;
  try {
    await signInWithEmailAndPassword(auth, document.getElementById('email').value.trim(), document.getElementById('password').value);
  } catch (error) {
    loginError.textContent = errorMessage(error);
  } finally {
    button.disabled = false;
  }
});

document.getElementById('signout-button').addEventListener('click', () => signOut(auth));
document.getElementById('refresh-button').addEventListener('click', loadBookings);
searchInput.addEventListener('input', renderBookings);
