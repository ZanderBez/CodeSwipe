import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential, updateProfile, GoogleAuthProvider, signInWithPopup, signInWithCredential, setPersistence, browserLocalPersistence } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export const registerUser = async (name: string, email: string, password: string): Promise<UserCredential> => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name, photoURL: null as any });
  await setDoc(doc(db, "users", cred.user.uid), {
    name,
    email: cred.user.email,
    photoURL: null,
    createdAt: serverTimestamp(),
  });
  return cred;
};

export const loginUser = async (email: string, password: string) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const snap = await getDoc(doc(db, "users", cred.user.uid));
  return { user: cred.user, data: snap.exists() ? snap.data() : null };
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const syncUserProfile = async (params: {
  uid: string;
  name?: string | null;
  photoURL?: string | null;
  email?: string | null; 
}) => {
  const { uid, name, photoURL } = params; 

  if (auth.currentUser && auth.currentUser.uid === uid) {
    await updateProfile(auth.currentUser, {
      displayName: name ?? auth.currentUser.displayName ?? "",
      photoURL: photoURL ?? auth.currentUser.photoURL ?? null as any,
    });
  }

  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    ...(name !== undefined ? { name } : {}),
    ...(photoURL !== undefined ? { photoURL } : {}),

  });
};


//Google Sign-In
const ensureUserDoc = async (u: { uid: string; email: string | null; displayName: string | null; photoURL: string | null; }) => {
  const ref = doc(db, "users", u.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: u.uid,
      email: u.email,
      name: u.displayName ?? "",
      photoURL: u.photoURL ?? "",
      role: "user",
      provider: "google",
      createdAt: serverTimestamp(),
    });
  }
};

export const signInWithGoogleWeb = async () => {
  await setPersistence(auth, browserLocalPersistence);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const result = await signInWithPopup(auth, provider);
  await ensureUserDoc(result.user);
  return result;
};

export const finishGoogleSignIn = async (idToken: string) => {
  const credential = GoogleAuthProvider.credential(idToken);
  const userCred = await signInWithCredential(auth, credential);
  await ensureUserDoc(userCred.user);
  return userCred;
};
