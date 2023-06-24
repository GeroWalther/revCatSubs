const APIKeys = {
  // should be from env file
  apple: "appl_IWktWhdGuxDsSacvJYTzdHvbhTL",
  google: "",
};
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases, {
  CustomerInfo,
  PurchasesOffering,
} from "react-native-purchases";

const typesOfMemberships = {
  monthly: "promthly",
  yearly: "ProYly",
};

function useRevCat() {
  const [curOffering, setCurOffering] = useState<PurchasesOffering | null>(
    null
  );
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  const isProMember =
    customerInfo?.activeSubscriptions.includes(typesOfMemberships.monthly) ||
    customerInfo?.activeSubscriptions.includes(typesOfMemberships.yearly);

  useEffect(() => {
    const configurePurchases = async () => {
      try {
        if (Platform.OS === "android") {
          await Purchases.configure({ apiKey: APIKeys.google });
        } else {
          await Purchases.configure({ apiKey: APIKeys.apple });
        }

        const offerings = await Purchases.getOfferings();
        const customerInfo = await Purchases.getCustomerInfo();

        setCustomerInfo(customerInfo);
        setCurOffering(offerings.current);
      } catch (error) {
        console.error("Error configuring purchases:", error);
      }
    };

    configurePurchases().catch(console.error);
  }, []);

  useEffect(() => {
    const customerInfoUpdated = async (purchaserInfo: CustomerInfo) => {
      setCustomerInfo(purchaserInfo);
    };

    Purchases.addCustomerInfoUpdateListener(customerInfoUpdated);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(customerInfoUpdated);
    };
  }, []);

  return { curOffering, customerInfo, isProMember };
}

export default useRevCat;
