import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: "user" | "admin"
): Promise<UserCredential> => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name, photoURL: null as any });
  await setDoc(doc(db, "users", cred.user.uid), {
    name,
    email: cred.user.email,
    photoURL: null,
    createdAt: new Date().toISOString(),
    role
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
  const { uid, name, photoURL, email } = params;
  if (auth.currentUser && auth.currentUser.uid === uid) {
    await updateProfile(auth.currentUser, {
      displayName: name ?? auth.currentUser.displayName ?? "",
      photoURL: photoURL ?? auth.currentUser.photoURL ?? null as any
    });
  }
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    ...(name !== undefined ? { name } : {}),
    ...(photoURL !== undefined ? { photoURL } : {}),
    ...(email !== undefined ? { email } : {})
  });
};