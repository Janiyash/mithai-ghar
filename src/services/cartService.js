import { db } from "../firebase";
import {
  doc,
  collection,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  increment,
} from "firebase/firestore";

/* ADD / UPDATE CART ITEM */
export async function addToCartFirestore(userId, product) {
  const cartRef = doc(db, "users", userId, "cart", product.id);

  await setDoc(
    cartRef,
    {
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: increment(1),
    },
    { merge: true }
  );
}

/* GET CART */
export async function getCartFirestore(userId) {
  const cartRef = collection(db, "users", userId, "cart");
  const snapshot = await getDocs(cartRef);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/* UPDATE QUANTITY */
export async function updateQtyFirestore(userId, productId, qty) {
  const ref = doc(db, "users", userId, "cart", productId);

  if (qty <= 0) {
    await deleteDoc(ref);
  } else {
    await updateDoc(ref, { quantity: qty });
  }
}

/* REMOVE ITEM */
export async function removeFromCartFirestore(userId, productId) {
  await deleteDoc(doc(db, "users", userId, "cart", productId));
}
