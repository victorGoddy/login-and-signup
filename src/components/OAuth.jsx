import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { db } from "../firebase";

import { useNavigate } from "react-router-dom";

const OAuth = () => {

  const navigate = useNavigate();

  async function onGoogleClick() {
    try {


      const auth = getAuth();

      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      //we need to change the this function to asynchronous and we can just now get the results from is signing
      const user = result.user;

      //check for the user
      const docRef = doc(db, "users", user.uid);//This address docRef.
      const docSnap = await getDoc(docRef);

      //Now we can check if it's available or not.
      //Is not available so we can check it by using the dot exist.
      //So if it's if doesn't exist, the took is snap.
      //So we're going to add it to the database.
      if(!docSnap.exists()){
        //So set doc is going to get the address as well, which is the same address we have here.
        //And the what we want to add to this document is this.
        await setDoc(docRef, {
          //Firstly, we want to add the name, which is a user dot display name, which is coming from here user
          name: user.displayName,
          //We can have the email. Which is a user that email.
          email: user.email,
          //And also we can add the time stamp, which is the time that the person is signed up.
          //So this this is going to use the server time stamp from Firestone store.
          timestamp: serverTimestamp(),
        })
      }
      navigate("/");
    } catch (error) {
      toast.error("Could not authorize with Google");
      
    }
  }

  return (
    <button
      type="button"
      onClick={onGoogleClick}
      className="mb-[100px] flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-800 active:bg-red-900 shadow-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out rounded"
    >
      <FcGoogle className="text-2xl bg-white rounded-full mr-2" />
      Continue with Google
    </button>
  );
};

export default OAuth;
