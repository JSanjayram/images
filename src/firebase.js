import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { getAuth ,onAuthStateChanged, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";

const firebaseConfig = {
    apiKey: "AIzaSyCu190WbRUlR_KND7vODQdVy4FOgLLOFEA",
    authDomain: "sample-6fce0.firebaseapp.com",
    databaseURL: "https://sample-6fce0-default-rtdb.firebaseio.com",
    projectId: "sample-6fce0",
    storageBucket: "sample-6fce0.appspot.com",
    messagingSenderId: "625856667950",
    appId: "1:625856667950:web:55b184a368384ad69a1abf",
    measurementId: "G-J7JRB45E1D"
  };


// Firebase Authentication hook
export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  return user;
};

// Login function for admin
export const login = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Logout function for admin
export const logout = async () => {
  return await signOut(auth);
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const user = auth.currentUser;
if (!user) {
  console.log('User is not authenticated');
}

export async function getMobileApps() {
  const appsCol = collection(db, 'mobileApps');
  const appSnapshot = await getDocs(appsCol);
  return appSnapshot.docs.map(doc => doc.data());
}

// Add this function to fetch partners from Firestore
export async function getPartners() {
  const partnersCol = collection(db, 'partners');
  const partnersSnapshot = await getDocs(partnersCol);
  return partnersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

const teamMembersCollection = collection(db, 'teamMembers');

export const getTeamMembers = async () => {
  const snapshot = await getDocs(teamMembersCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addTeamMember = async (member) => {
  return await addDoc(teamMembersCollection, member);
};

export const updateTeamMember = async (id, updatedMember) => {
  const memberDoc = doc(db, 'teamMembers', id);
  await updateDoc(memberDoc, updatedMember);
};

export const deleteTeamMember = async (id) => {
  const memberDoc = doc(db, 'teamMembers', id);
  await deleteDoc(memberDoc);
};
// Add this function to handle career application submissions
export const submitCareerApplication = async (form) => {
  let docName = '';
  if (form.documentation) {
    docName = form.documentation.name;
  }
  await addDoc(collection(db, 'careerApplications'), {
    ...form,
    documentation: docName,
    submittedAt: new Date()
  });
};

// Add this function to fetch all career applications
export const getCareerApplications = async () => {
  const appsCol = collection(db, 'careerApplications');
  const appSnapshot = await getDocs(appsCol);
  return appSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Add this function to fetch a single career application by ID
export const getCareerApplicationById = async (id) => {
  const appDoc = doc(db, 'careerApplications', id);
  const appSnapshot = await getDoc(appDoc);
  return appSnapshot.exists() ? { id: appSnapshot.id, ...appSnapshot.data() } : null;
};

// Fetch all services
export const getServices = async () => {
  const servicesCol = collection(db, 'services');
  const snap = await getDocs(servicesCol);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Add a new service
export const addService = async (service) => {
  return await addDoc(collection(db, 'services'), service);
};

// Update a service
export const updateService = async (id, updatedService) => {
  const serviceDoc = doc(db, 'services', id);
  await updateDoc(serviceDoc, updatedService);
};

// Delete a service
export const deleteService = async (id) => {
  const serviceDoc = doc(db, 'services', id);
  await deleteDoc(serviceDoc);
};

// Upload SVG file to Firebase Storage and return the download URL
export const uploadSvgAndGetUrl = async (file) => {
  const storageRef = ref(storage, `service-icons/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

// Upload APK file to Firebase Storage and return the download URL
export const uploadApkAndGetUrl = async (file) => {
  const storageRef = ref(storage, `mobile-apps-apk/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

// Upload screenshot image file to Firebase Storage and return the download URL
export const uploadScreenshotAndGetUrl = async (file) => {
  const storageRef = ref(storage, `mobile-apps-screenshots/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export { db, auth, storage };

