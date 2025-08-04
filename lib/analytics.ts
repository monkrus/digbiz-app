import { db } from '@/firebase';
import { doc, getDoc, increment, setDoc } from 'firebase/firestore';

export async function recordView(uid: string) {
  await setDoc(doc(db, 'analytics', uid), { views: increment(1) }, { merge: true });
}

export async function recordShare(uid: string) {
  await setDoc(doc(db, 'analytics', uid), { shares: increment(1) }, { merge: true });
}

export async function fetchAnalytics(uid: string) {
  const snap = await getDoc(doc(db, 'analytics', uid));
  return snap.exists() ? snap.data() : { views: 0, shares: 0 };
}
