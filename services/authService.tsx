import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Register new user that can choose user or admin
export const registerUser = async (
  name: string,
  email: string, 
  password: string, 
  role: "user" | "admin"
): Promise<UserCredential> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    name,
    email: user.email,
    createdAt: new Date().toISOString(),
    role: role
  });

  return userCredential;
};

// Login user and fetch Firestore user data (including role)
export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const userDoc = await getDoc(doc(db, "users", user.uid));
  return { user, data: userDoc.exists() ? userDoc.data() : null };
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error: any) {
    throw error;
  }
};
