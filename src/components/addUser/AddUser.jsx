import React, { useState } from "react";
import "./addUser.css";
import { db } from "../../lib/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { arrayUnion } from "firebase/firestore";
import { useUserStore } from "../../lib/userStore";

const AddUser = () => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();

  // Search user by username
  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
      } else {
        setUser(null);
        console.log("No user found with that username");
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // Add user to chats
  const handleAdd = async () => {
    try {
      // Create new chat document with auto-generated ID
      const chatRef = doc(collection(db, "chats"));
      await setDoc(chatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      // References to userchats collections
      const userChatRef = doc(db, "userchats", user.id);
      const currentUserChatRef = doc(db, "userchats", currentUser.id);

      // For the searched user
      await setDoc(
        userChatRef,
        {
          chats: arrayUnion({
            chatId: chatRef.id,
            lastMessage: "",
            receiverId: currentUser.id,
            updatedAt: Date.now(),
          }),
        },
        { merge: true } // ✅ creates doc if it doesn't exist
      );

      // For the current logged-in user
      await setDoc(
        currentUserChatRef,
        {
          chats: arrayUnion({
            chatId: chatRef.id,
            lastMessage: "",
            receiverId: user.id,
            updatedAt: Date.now(),
          }),
        },
        { merge: true } // ✅ creates doc if it doesn't exist
      );

      console.log("New chat created:", chatRef.id);
      setUser(null); // clear search result
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" name="username" placeholder="Username" />
        <button type="submit">Search</button>
      </form>

      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "/default-avatar.png"} alt="user" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
