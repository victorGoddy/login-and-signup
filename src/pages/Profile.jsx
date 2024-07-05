import { getAuth, updateProfile } from "firebase/auth";
import {  doc, getDoc, updateDoc,} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ShareIcon, EditIcon, SignOutIcon } from "../components/icons"

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [profilePic, setProfilePic] = useState(auth.currentUser.photoURL || '');
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
    photo: auth.currentUser.photoURL,
    bio: '',
  });
 

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    // Generate share URL
    const currentUrl = window.location.href;
    const shareUrl = `${currentUrl.split("/").slice(0, 3).join("/")}/user-profile/${auth.currentUser.displayName}`;
    setShareUrl(shareUrl);
  }, [auth.currentUser.displayName]);

  const storage = getStorage();

  useEffect(() => {
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  const handlePageShow = (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  };

  const handleProfilePicUpload = async (image) => {
    try {
      const imageUrl = await storeImage(image);
      setProfilePic(imageUrl);
      updateProfile(auth.currentUser, { photoURL: imageUrl });
      await updateDoc(doc(db, "users", auth.currentUser.uid), { photoURL: imageUrl });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error("Error uploading profile picture");
    }
  };

  const storeImage = async (image) => {
    return new Promise((resolve, reject) => {
      const filename = `profile-${auth.currentUser.uid}`;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleProfilePicUpload(file);
    }
  };

  const { name, email, bio } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({ ...prevState, [e.target.id]: e.target.value }));
  };

  const onSubmit = async () => {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);

      if (auth.currentUser.displayName !== name || formData.bio) {
        const updateData = {
          displayName: name,
          ...(formData.bio && { bio: formData.bio }), // Include bio if it exists
        };

        await updateProfile(auth.currentUser, { displayName: name });
        await updateDoc(userRef, updateData);
      }

      toast.success("Profile details updated");
    } catch (error) {
      toast.error("Could not update the profile details");
    }
  };
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();

          setFormData((prevState) => ({
            ...prevState,
            bio: userData.bio || '', // Set bio to empty string if it doesn't exist
          }));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }

    fetchUserProfile();
  }, [auth.currentUser.uid]);

  return (
    <div>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            {(!profilePic || changeDetail) && (
              <div className="mb-6">
                <label htmlFor="profilePic" className="block text-xl mb-2">
                  Profile Picture
                </label>
                <input
                  type="file"
                  id="profilePic"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border rounded p-2 w-full"
                  required
                />
              </div>
            )}
            {profilePic && (
              <div className="max-w-md mx-auto flex justify-center mb-5">
                <img
                  src={profilePic}
                  alt="Profile"
                  className="mt-2 w-32 h-32 object-cover rounded-full border-4 border-blue-400"
                />
              </div>
            )}
            <input
              type="text"
              id="name"
              value={name}
              disabled={!changeDetail}
              onChange={onChange}
              className={`mb-1 w-full h-auto px-4 py-1 text-xl text-gray-700 text-center border rounded transition ease-in-out ${changeDetail ? "border border-red-500" : "border border-transparent bg-transparent focus:bg-transparent"}`}
            />
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className={`mb-1 w-full px-4 py-0 text-xl text-center bg-transparent text-gray-700 bg-white border rounded transition ease-in-out ${changeDetail ? "border border-red-500" : "border border-transparent bg-transparent focus:bg-transparent"}`}
            />
            <div className="flex justify-center gap-1.5 whitespace-nowrap text-sm sm:text-lg mb-2">
              <p className="flex items-center">
                {" "}
                <span
                  onClick={() => {
                    changeDetail && onSubmit();
                    setChangeDetail((prevState) => !prevState);
                  }}
                  className="hover:title text-black hover:text-white bg-gray-300 rounded-lg hover:bg-blue-400 transition ease-in-out duration-200 cursor-pointer py-2 px-6"
                  title="Edit Profile">
                  {changeDetail ? "Apply changes" : <EditIcon />}
                </span>
              </p>
              {/* Share button */}
              <button
                className="hover:title text-black hover:text-white bg-gray-300 rounded-lg hover:bg-blue-400 transition ease-in-out duration-200 cursor-pointer py-2 px-6"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default button behavior
                  navigator.clipboard.writeText(shareUrl);
                  toast.info("User profile URL copied!");
                }}
                title="Share Profile" >
                <ShareIcon />
              </button>

            </div>
            <textarea
              id="bio"
              value={bio}
              disabled={!changeDetail}
              onChange={onChange}
              className={`mb-6 w-full px-4 py-2 text-center text-xl h-auto text-gray-700 border rounded transition ease-in-out ${changeDetail ? "border border-red-500" : "border border-transparent bg-transparent h-auto focus:bg-transparent"}`}
              placeholder="Bio"
            />

          </form>
          <div className="flex justify-between items-center gap-3 mb-[70px]">
            <p
              onClick={onLogout}
              className="hover:title w-full flex justify-center text-black text-center hover:text-white text-[25px] font-medium uppercase bg-gray-300 rounded hover:bg-blue-400 shadow-md transition ease-in-out duration-150 cursor-pointer py-3 px-7"
              title="Sign Out" >
              <SignOutIcon />
            </p>
          </div>
        </div>
      </section>
      {/* <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6">
              My Listings
            </h2>
            <ul className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl-grid-cols-5 mb-[100px]">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div> */}
    </div>
  );
}
