import { auth, db } from "./config";
import { collection, doc, getDocs, runTransaction, Timestamp, } from "firebase/firestore";

// get all shop items
export async function getShopItems() {
  const snapshot = await getDocs(collection(db, "shopItems"));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// get current user's inventory
export async function getCurrentUserInventory() {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const snapshot = await getDocs(
    collection(db, "users", user.uid, "inventory")
  );

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// purchase item
export async function purchaseItem(itemId: string, price: number) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const userRef = doc(db, "users", user.uid);
  const inventoryRef = doc(db, "users", user.uid, "inventory", itemId);

  await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userRef);

    if (!userSnap.exists()) {
      throw new Error("User doc missing");
    }

    const userData = userSnap.data();
    const gems = userData.gems ?? 0;

    if (gems < price) {
      throw new Error("Not enough gems");
    }

    // deduct gems
    transaction.update(userRef, {
      gems: gems - price,
    });

    // add to inventory
    transaction.set(inventoryRef, {
      itemId,
      purchasedAt: Timestamp.now(),
      selectedVariantId: null,
    });
  });
}